## Campaign types - with invoice or without?

Most campaigns have a form with ID `campaignFormOnePagerInit`, but a few use the other ID `campaignFormInit`. Only one of these included a paper invoice, but then that changed, so this naming is a bit sub-optimal now.

## Workflow for HTTP requests and responses

### HTTP workflow for successful sign up for 2-week-free campaign

The first request is sent off when the form is submitted, starting here:

```js
$(document).on('submit', '#campaignFormOnePagerInit', function (e) {
```

Request 1:
- Form submission on https://www.ksfmedia.fi/365-2
- POST request to https://www.ksfmedia.fi/wp-json/ksf-campaign/v1/new-paper

```
{
	"emailAddress": "daniel.clarke+2-week-free-test-2@ksfmedia.fi",
	"password": "pass1234",
	"confirmPassword": "pass1234",
	"phone": "010",
	"firstName": "d",
	"lastName": "d",
	"streetAddress": "d",
	"zipCode": "00100",
	"city": "Helsinki",
	"country": "FI",
	"campaignNo": "4224",
	"packageId": "HBL+365",
	"period": "",
	"payAmountCents": ""
}
```

Note that some hidden form fields get sent in this request. And also note that the `3305` ID doesn't get sent, but has to be the same number throughout the HTML code to make sure the campaign data is all stitched together.

```html
<div style="display:none;">
  <input type="hidden" value="1" id="3305-period">
  <input type="hidden" value="4224" id="3305-campaignNo">
  <input type="hidden" value="HBL 365" id="3305-packageId">
  <input type="hidden" value="1790" id="3305-payAmountCents">
</div>
```

Note also that ksfmedia.fi MIGHT already know if it's an existing user. But it contacts Persona either way.

```php
function getUser($body) {
  if(array_key_exists('existingUser', $body)) {
    $existingUser = getExistingUser($body);
    return $existingUser;
  } else {
    $newUser = newUserSignup($body);
    return $newUser;
  }
}
```

Persona does its own check to see if it's an existing user, and that gets dealt with in the code that manages the response from Persona:

```php
    if (array_key_exists('email_address_in_use_registration', json_decode($response['body'])) ) {
        $message = "email_address_in_use_registration";
    } else {
        $message = $response['response']['code'];
    }
```

Response 1 (from Persona)

```
{
	"code": 200,
	"uuid": "74712975-b59d-4a98-b0de-73e4a87c5022",
	"token": "BIH3Vy9XoDwzryXI1IABbUacYLKiBZfMbKewq1uJCQIIDfAG",
	"orderNumber": "1635793426044729"
}
```

Troubleshooting Response 1

If you get a WordPress error in the response, it's probably something that Håkan would need to fix. Email him about it.

Request 2a-2d
POST request to /wp-json/ksf-campaign/v1/get-order/

```
{
	"uuid": "74712975-b59d-4a98-b0de-73e4a87c5022",
	"token": "BIH3Vy9XoDwzryXI1IABbUacYLKiBZfMbKewq1uJCQIIDfAG",
	"orderNumber": "1635793426044729"
}
```

Response 2a-2c

```
{
	"status": {
		"state": "started",
		"time": "2021-11-01T19:03:46.650317Z"
	},
	"user": "74712975-b59d-4a98-b0de-73e4a87c5022",
	"number": "1635793426044729"
}
```

Response 2d

```
{
	"status": {
		"state": "completed",
		"time": "2021-11-01T19:03:49.439284Z"
	},
	"user": "74712975-b59d-4a98-b0de-73e4a87c5022",
	"number": "1635793426044729"
}
```