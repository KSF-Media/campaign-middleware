<?php
/*
Plugin Name: Ksf-campaign-post
Plugin URI:
Description: Plugin to post ksf-campaigns
Version: 1.0
Author:
Author URI:
License: GPLv2 or later
Text Domain:
*/
//header('Access-Control-Allow-Origin: *');

add_action( 'rest_api_init', function () {
  register_rest_route( 'ksf-campaign/v1', '/new', array(
    'methods' => 'POST',
    'callback' => 'make_api_call_campaign'
  ) );
} );

 add_action( 'rest_api_init', function () {
  register_rest_route( 'ksf-campaign/v1', '/new-paper', array(
    'methods' => 'POST',
    'callback' => 'make_api_call_campaign_paper_invoice'
  ) );
} );

add_action( 'rest_api_init', function () {
  register_rest_route( 'ksf-campaign/v1', '/get-order', array(
    'methods' => 'POST',
    'callback' => 'make_order_call_campaign'
  ) );
} );

function errorCodeHandler($e) {
  $errorObj = array(
   'email_address_in_use_registration'=>'Denna e-postadress är redan registrerad.',
    403=>'Fel användarnamn eller lösenord.',
    400=>'Någonting gick fel.<br>Kontrollera att du inte redan har ett konto med denna e-postadress. Du kan <a href="https://konto.ksfmedia.fi/#l%C3%B6senord" target="__blank">återställa lösenordet här</a>. <br>Var god granska att du valt en kampanj samt fyllt i rätt information. <br>Om du försöker beställa en papperstidning kan det hända att vi saknar dina adressuppgifter. Var vänlig och besök <a href="https://konto.ksfmedia.fi/" target="__blank">Mitt konto</a>, ange din adress och försök igen.',
    500=>'Någonting gick fel. Var god försök igen.',
    404=>'Någonting gick fel med din prenumeration. Var god försök igen.',
    103=>'Angiven kampanjkod är felaktig.',
    409=>'Eftersom du redan har en prenumeration är detta erbjudande inte tillgängligt för dig.'
  );
  return $errorObj[$e];
}

function make_api_call_campaign( WP_REST_Request $request ) {
  // get input parameters
  $body = $request->get_params();
  //throws error if body is empty
  if ( empty( $body ) ) {
    return new WP_Error( 'no_body', $body , array( 'status' => 404 ) );
  }
  // gets the user, either existing one or new one through persona
  try {
    $user = getUser($body);
    // creates an order request to bottega
    $order = makeOrder($user, $body);
    // creates the processing for order and returns the terminal URL for Nets
    $payment = goToPayment($user, $order);
    return $payment;
    exit;
  } catch (Exception $e) {
    $code = $e->getMessage();
    return array('code'=>$code,'message'=>errorCodeHandler($code));
    exit;
  }
}

function make_api_call_campaign_paper_invoice( WP_REST_Request $request ) {
  // get input parameters
  $body = $request->get_params();
  // throws error if body is empty
  if ( empty( $body ) ) {
    return new WP_Error( 'no_body', $body , array( 'status' => 404 ) );
  }
  // gets the user, either existing one or new one through persona
  try {
    $user = getUser($body);
    //creates an order request to bottega
    $order = makeOrder($user, $body);
    //creates the processing for order and returns the terminal URL for Nets
    $payment = goToPaymentPaperInvoice($user, $order);
    return $payment;
    exit;
  } catch (Exception $e) {
    $code = $e->getMessage();
    return array('code'=>$code,'message'=>errorCodeHandler($code));
    exit;
  }
}

function make_order_call_campaign( WP_REST_Request $request ) {
  //get input parameters
  $body = $request->get_params();
  //throws error if body is empty
  if ( empty( $body ) ) {
    return new WP_Error( 'no_body', $body , array( 'status' => 404 ) );
  }
  $pollingRequest = createPollingRequest($body);
  return $pollingRequest;
  exit;
}

function getUser($body) {
  if(array_key_exists('existingUser', $body)) {
    $existingUser = getExistingUser($body);
    return $existingUser;
  } else {
    $newUser = newUserSignup($body);
    return $newUser;
  }
}

 function makeOrder($user, $body) {
  $orderObj = array(
    'packageId' => $body['packageId'],
    'campaignNo' => (int)$body['campaignNo'],
    'orderSource' => 'CampaignPagesSource'
  );
  $formattedSignUpForm = wp_json_encode($orderObj);
  $options = formatJsonRequestBottega($formattedSignUpForm, $user->{'uuid'}, $user->{'token'});
  $response = wp_remote_post( 'https://bottega.api.ksfmedia.fi/v1/order', $options);
  if($response['response']['code']!=200) {
    throw new Exception($response['response']['code']);
  } else{
    $responseBody = json_decode(wp_remote_retrieve_body( $response ));
    return $responseBody;
  }
}

function goToPayment($user, $order) {
  $orderNumber = $order->{'number'};
  $paymentObj = array(
    'paymentOption' => "CreditCard"
  );
  $formattedPaymentObj = wp_json_encode($paymentObj);
  $options = formatJsonRequestBottega($formattedPaymentObj, $user->{'uuid'}, $user->{'token'});
  $response = wp_remote_post( "https://bottega.api.ksfmedia.fi/v1/order/{$orderNumber}/pay", $options);
  if($response['response']['code']!=200) {
    throw new Exception($response['response']['code']);
  } else{
    $responseBody = json_decode(wp_remote_retrieve_body( $response ));
    $finalResponse = array (
      'code' => 200,
      'url' => $responseBody->{'paymentTerminalUrl'},
      'uuid' => $user->{'uuid'},
      'token' => $user->{'token'},
      'orderNumber' => $order->{'number'}
    );
    return $finalResponse;
  }
}

function goToPaymentPaperInvoice($user, $order) {
  $orderNumber = $order->{'number'};
  $paymentObj = array(
    'paymentOption' => "PaperInvoice"
  );
  $formattedPaymentObj = wp_json_encode($paymentObj);
  $options = formatJsonRequestBottega($formattedPaymentObj, $user->{'uuid'}, $user->{'token'});
  $response = wp_remote_post( "https://bottega.api.ksfmedia.fi/v1/order/{$orderNumber}/pay", $options);
  if($response['response']['code']!=200) {
    throw new Exception($response['response']['code']);
  } else {
    $finalResponse = array (
      'code' => 200,
      'uuid' => $user->{'uuid'},
      'token' => $user->{'token'},
      'orderNumber' => $order->{'number'}
    );
    return $finalResponse;
  }
}

function getExistingUser($body) {
  $userObj = array(
    'username' => $body['emailAddress'],
    'password' => $body['password']
  );
  $formattedSignUpForm = wp_json_encode($userObj);
  $options = formatJsonRequestPersona($formattedSignUpForm);
  $response = wp_remote_post( 'https://persona.api.ksfmedia.fi/v1/login', $options);

  if($response['response']['code']!=200) {
    throw new Exception($response['response']['code']);
  } else {
    $responseBody = json_decode(wp_remote_retrieve_body( $response ));
    return $responseBody;
  }
}

function createPollingRequest($body) {
  $orderNumber = $body['orderNumber'];
  $options = formatJsonGetRequestBottega($body['uuid'],$body['token']);
  $response = wp_remote_get( "https://bottega.api.ksfmedia.fi/v1/order/$orderNumber", $options);
  if($response['response']['code']!=200) {
    throw new Exception($response['response']['code']);
  } else {
  $responseBody = json_decode(wp_remote_retrieve_body( $response ));
  return $responseBody;
  }
}

function newUserSignup($body) {
  date_default_timezone_set('Finland/Helsinki');
  $datetime = date(DATE_ISO8601);
  $userObj = array(
    'firstName' => $body['firstName'],
    'lastName' => $body['lastName'],
    'emailAddress' => $body['emailAddress'],
    'password' => $body['password'],
    'confirmPassword' => $body['confirmPassword'],
    'streetAddress' => $body['streetAddress'],
    'zipCode' => $body['zipCode'],
    'city' => $body['city'],
    'country' => $body['country'],
    'phone' => $body['phone'],
    'legalConsents' => array([
      'screenName' => "legalAcceptanceScreen",
      "consentId" => "legal_acceptance_v1",
      "dateAccepted" => $datetime
    ])
  );
  $formattedSignUpForm = wp_json_encode($userObj);
  $options = formatJsonRequestPersona($formattedSignUpForm);
  $response = wp_remote_post( 'https://persona.api.ksfmedia.fi/v1/users', $options);
  if($response['response']['code']!=200) {
    $message = '';
    if (array_key_exists('email_address_in_use_registration', json_decode($response['body'])) ) {
        $message = "email_address_in_use_registration";
    } else {
        $message = $response['response']['code'];
    }
    throw new Exception($message);
  } else {
    $responseBody = json_decode(wp_remote_retrieve_body( $response ));
    return $responseBody;
  }
}

function formatJsonRequestPersona($body) {
  $options = [
    'body'        => $body,
    'headers'     => [
        'Content-Type' => 'application/json',
    ],
    'timeout'     => 60,
    'redirection' => 5,
    'blocking'    => true,
    'httpversion' => '1.0',
    'sslverify'   => false,
    'data_format' => 'body',
  ];
  return $options;
}

function formatJsonRequestBottega($body, $uuid, $token) {
  $options = [
    'body'        => $body,
    'headers'     => [
      'Content-Type' => 'application/json',
      'AuthUser' => $uuid,
      'Authorization' => 'OAuth ' . $token,
    ],
    'timeout'     => 30,
    'redirection' => 5,
    'blocking'    => true,
    'httpversion' => '1.0',
    'sslverify'   => false,
    'data_format' => 'body',
  ];
  return $options;
}

function formatJsonGetRequestBottega($uuid, $token) {
  $options = [
    'headers'     => [
        'Content-Type' => 'application/json',
        'AuthUser' => $uuid,
        'Authorization' => 'OAuth ' . $token,
    ],
    'timeout'     => 30,
    'redirection' => 5,
    'blocking'    => true,
    'httpversion' => '1.0',
    'sslverify'   => false
  ];
  return $options;
}
