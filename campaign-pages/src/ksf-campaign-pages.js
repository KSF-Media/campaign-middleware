// Does the countdown until the campaign ends, required format is i.e August 31, 2021 23:59:59 inside
//campaign_info class
$(function () {
  $('.campaign_info').each(function (idx, el) {
    var countDown = new Date(el.innerHTML).getTime();
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDown - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    if (distance < 0) {
      document.getElementById(el.id + '_container').classList.add("expired_div");
      el.innerHTML = 'Kampanjen har gått ut';
      el.classList.add('expired_text');
    } else if (days < 1) {
      el.innerHTML = 'Kampanjen tar slut om ' + hours + ' timmar och ' + minutes + ' minuter';
    } else {
      el.innerHTML = 'Kampanjen tar slut om ' + days + ' dagar och ' + hours + ' timmar';
    }

  });

  // Cleans up extra padding that WordPress for some reason adds. dont change
  $('p').each(function (index, item) {
    if ($.trim(item.innerHTML) == "") {
      $(item).not('[id],[class]').remove();
    }
  });
});

// onload, if url contains parameter campaign it preselects the given campaign based on its campaignNo
$(function () {
  window.dataLayer = window.dataLayer || [];
  dataLayer.push(dataLayer.push({'event': 'ksf_campaign_page'}));
  let parCheck = getParameterByName('campaign');
  let test = $('.card').find("input[value='" + parCheck + "']").attr('id') || $('.card_one_pager').find("input[value='" + parCheck + "']").attr('id');
  if (test) {
    selectCampaign(test.slice(0, -11));
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#info_section").offset().top
  }, 500);
  } else {
  }
});

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Drop down show more for the individual cards
function moreOrLess(id) {
  var detailText = document.getElementById(id + '-details');
  var drop = document.getElementById(id + '-drop');
  var btnText = document.getElementById(id);

  if (detailText.style.display !== "none") {
    btnText.innerHTML = "Se detaljer";
    detailText.style.display = "none";
    drop.classList.remove("dropup");
  } else {
    btnText.innerHTML = "Göm detaljer";
    detailText.style.display = "inline";
    drop.classList.add("dropup");
  }
}

function selectCampaign(id) {
  $('#submit-button').prop('disabled', !$("#terms-accept").is(':checked'));
  var currentCampaign = document.getElementById("selectedCampaign");
  if (!currentCampaign.value) {
    currentCampaign.value = id;
    document.getElementById(id).innerHTML = "Paket valt";
    document.getElementById(id).classList.remove("btn-dark");
    if (document.getElementById(id).classList.contains("jr")) {
      document.getElementById(id).classList.add("btn-choose-jr");
    } else if (document.getElementById(id).classList.contains("js-orange-theme")) {
      document.getElementById(id).classList.add("btn-choose-orange");
    } else {
    	document.getElementById(id).classList.add("btn-choose");	
  	}
	  
    $("#error_text").hide();
    document.getElementById('campaign_selected').style.display = "inline";
  } else {
    document.getElementById(currentCampaign.value).innerHTML = "Välj paket";
    document.getElementById(currentCampaign.value).classList.add("btn-dark");
	  
  if (document.getElementById(id).classList.contains("jr")) {
  	document.getElementById(currentCampaign.value).classList.remove("btn-choose-jr");
  	document.getElementById(id).classList.add("btn-choose-jr");	
	} else {
	document.getElementById(id).classList.add("btn-choose");
	document.getElementById(currentCampaign.value).classList.remove("btn-choose");
	}

    document.getElementById(id).innerHTML = "Paket valt";
    document.getElementById(id).classList.remove("btn-dark");
    currentCampaign.value = id;

  }
  document.getElementById("selected_campaign_picture").src = document.getElementById(id + '-picture').src;
  document.getElementById("selected_campaign_text").innerHTML = document.getElementById(id + '-text').innerHTML;
  document.getElementById("selected_campaign_price").innerHTML = document.getElementById(id + '-price').innerHTML;
  document.getElementById("selected_campaign_price2").innerHTML = document.getElementById(id + '-price').innerHTML;
  document.getElementById("extra_text_price").innerHTML = document.getElementById(id + '-extra_text_price').innerHTML;
  document.getElementById("selected_campaign_indicator").style.display = 'inline-block';
  document.getElementById("campaignNo").value = document.getElementById(id + '-campaignNo').value;
  document.getElementById("packageId").value = document.getElementById(id + '-packageId').value;
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#info_section").offset().top
  }, 500);

  // GTM and GA datalayer
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'addToCart',
    'ecommerce': {
      'currencyCode': 'EUR',
      'add': {
        'products': [{
          'name': document.getElementById(id + '-text').innerHTML,
          'id': document.getElementById(id + '-campaignNo').value,
          'price': parseFloat(document.getElementById(id + '-price').innerHTML.replace(/[^0-9,]/g, '').replace(',', '.')),
          'category': 'Campaign',
          'variant': document.getElementById(id + '-packageId').value,
          'quantity': 1
        }]
      }
    }
  });
}

$("#terms-accept").click(function () {
  $('#submit-button').prop('disabled', !$(this).is(':checked') || !$("#selectedCampaign").val());
  window.dataLayer = window.dataLayer || [];
  // GTM and GA datalayer
  window.dataLayer.push({
    'event': 'Campaign_accept_terms',
    'package': document.getElementById('campaignNo').value
  });
});

$('#paymentModal').on('hidden.bs.modal', function () {
  location.reload();
});

// Simple function for assigning required to certain inputs if customer is new/removing if old
$(function () {
  $("#checkExisting").click(function () {
    if ($(this).is(":checked")) {
      $('#forgot_password_a').show();
      $("#new-customer :input").removeAttr("required");
      $("#new-customer").hide();
    } else {
      $('#forgot_password_a').hide();
      $("#new-customer").show();
      $("#new-customer :input").attr("required", "");
    }
  });
});

// Check if this is needed
$("#forgot-password").click(function () {
  $('#forgotPasswordModal').modal('show');
});

function forgotPwModal() {
  $('#forgotPasswordModal').modal('show');
}

$('#campaignFormInit').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: 'https://www.ksfmedia.fi/wp-json/ksf-campaign/v1/new',
    //url: 'http://localhost/wordpress/wp-json/ksf-campaign/v1/new',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: "POST",
    data: $(this).serialize(),
    beforeSend: function () {
	  /*if(document.getElementById('password').value!=document.getElementById('confirmPassword').value){
        $("#error_text").show();
        $('#error_text').html('Lösenorden matchar ej. Försök pånytt.');
        return false;
      }*/

      //GTM and GA datalayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Campaign_vetrina_click',
        'package': document.getElementById('campaignNo').value
      });

      // Show loader container
      $("#divLoading").css('display', 'flex');
    },
    success: function (result) {
      $("#divLoading").hide();
      if (result.code != 200) {
        $("#error_text").show();
        $('#error_text').html(result.message);
      } else {
        document.getElementById("paymentModalSrc").src = result.url;
        $('#paymentModal').modal('show');
        initiateOrderChecker(e, result.uuid, result.token, result.orderNumber);
      }
    },
    error: function (e) {
      $("#divLoading").hide();
      $("#error_text").show();
      $('#error_text').html('Någonting gick fel. Försök pånytt.');
    }
  });
});

$('#campaignFormOnePagerInit').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: 'https://www.ksfmedia.fi/wp-json/ksf-campaign/v1/new-paper',
    //url: 'http://localhost/wordpress/wp-json/ksf-campaign/v1/new-paper',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: "POST",
    data: $(this).serialize(),
    beforeSend: function () {
      /*if(document.getElementById('password').value!=document.getElementById('confirmPassword').value){
          $("#error_text").show();
          $('#error_text').html('Lösenorden matchar ej. Försök pånytt.');
          return false;
        }*/
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Campaign_vetrina_click',
        'package': document.getElementById('campaignNo').value
      });

      // Show loader container
      $("#divLoading").css('display', 'flex');
    },
    success: function (result) {
      $("#divLoading").hide();
      if (result.code != 200) {
        $("#error_text").show();
        $('#error_text').html(result.message);
      } else {
        $("#one-pager-successfull").show();
      }
    },
    error: function (e) {
      $("#divLoading").hide();
      $("#error_text").show();
      $('#error_text').html('Någonting gick fel. Försök pånytt.');
    }
  });
});

function initiateOrderChecker(e, uuid, token, orderNumber) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: 'https://www.ksfmedia.fi/wp-json/ksf-campaign/v1/get-order/',
    //url: 'http://localhost/wordpress/wp-json/ksf-campaign/v1/get-order/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      uuid,
      token,
      orderNumber
    },
    success: function (result) {
      if (result.status['state'] == 'created') {
        setTimeout(initiateOrderChecker(e, uuid, token, orderNumber), 5000);
      }
      else if (result.status['state'] == 'started') {
        $("#paymentModalSrc").hide();
        $("#payment-loading").show();
        setTimeout(initiateOrderChecker(e, uuid, token, orderNumber), 5000);
      }
      else if (result.status['state'] == 'completed') {
        $("#paymentModalSrc").hide();
        $("#payment-loading").hide();
        $("#payment-successfull").show();
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'purchase',
          'ecommerce': {
            'purchase': {
              'actionField': {
                'id': orderNumber,
                'revenue': parseFloat(document.getElementById("selected_campaign_price").innerHTML.replace(/[^0-9,]/g, '').replace(',', '.')),
                'currencyCode': 'EUR',
                'coupon': "" // if there is a coupon code 
              },
              'products': [{
                'name': document.getElementById("selected_campaign_text").innerHTML,
                'id': document.getElementById("campaignNo").value,
        				'price': parseFloat(document.getElementById("selected_campaign_price").innerHTML.replace(/[^0-9,]/g, '').replace(',', '.')),
                'category': 'Package deal',
                'variant': document.getElementById("packageId").value,
                'quantity': 1
              }]
            }
          }
        });
      }
      else if (result.status['state'] == 'failed') {
        $("#paymentModalSrc").hide();
        $("#payment-loading").hide();
        $("#payment-successfull").hide();
        $("#payment-unsuccessfull").show();
      }
    },
    error: function (e) {
    }
  });
}