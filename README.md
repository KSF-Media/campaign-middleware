The project consists of 2 major parts. The frontend (found in the .html files in the root of this folder) and the middleware for WordPress (containing fonts, .css .js .php) which can be found in the campaign-pages folder in the root of this folder.

To get this to work you will have to import a zipped version of the campaign-pages folder into wordpress as a plugin and activate it (only needed to be done once, has already been done).

How to import the plugin and activate it:

1. Zip the campaign-pages folder
2. Go to the wordpress admin dashboard and click Plugins > Add New
3. In the upperleft corner select `Upload Plugin`
4. Drag-and-drop the zip folder created above
5. Go to Plugins > Installed plugins and click Activate on the ksf-campaign-post

Since the plug-in already exists in the plug-in folder I have done the testing in staging and simply copypasted the code into the existing .js, .css and .php files in the plug-in. Simply just so you don't have to delete the existing plug-in in live. Simply make changes in the plug-in editor and update the files.

For staging and prod there aren't really any smart env. management tools for wordpress unless hosting the wordpress server yourself (you will need to talk to Håkan about setting up .env variables if going further with this project). So we will have to go and manually change the endpoints if we are going to prod.
Therefor, go into the campaign-pages.php and replace all occurences of `staging` with `api` to have the correct
endpoints in the WP middleware and go into the JS file and comment the localhost url and uncomment the ksf url.
I made it so that you simply need to uncomment and comment respective stages of dev.

HOW TO PUT THE HTML INTO WORDPRESS:

1. Start by replacing the URLs in the JS file with the appropriate wordpress url. i.e. url: 'https://stage.ksfmedia.fi/wp-json/ksf-campaign/v1/new'
2. Copy the HTML file content and paste it into the text section of a new WordPress page.
3. Make sure that the js and css corresponds to the one on ksfmedia.fi, i.e. `<link rel="stylesheet" href="https://www.ksfmedia.fi/wp-content/plugins/campaign-pages/src/ksf-campaign-pages.css">`

HOW TO ADD CAMPAIGNS:

Simply copy the code snippet below into a text editor, press CTRL+F and replace all occurrences of "REPLACE_ME"
with a UID, can be the campaignNo but it doesn't really matter since this is just a unique identifier for hiding and showing
stuff in the DOM. The most important thing is that you replace:

```html
<input type="hidden" value="1" id="REPLACE_ME-period" />
<input type="hidden" value="4049" id="REPLACE_ME-campaignNo" />
```

with the correct packageId and campaignNo, put these inside the quotes after value.
And insert the original price and period for the campaign item. If you're unsure about this, you can
check bottega and the offers array (Valtteri said that this doesn't serve any real purpose so hopefully removed in the future).

Last but not least, replace the picture with a URL where you are hosting your campaign images. You can experiment around
with width and height. And replace the text fields with your campaign data.

Once you've done that you can safely paste this snippet into the HTML on the campaign pages.
Paste it before a `<!--CAMPAIGN ITEM-->` snippet or after a `<!--ENDING OF CAMPAIGN ITEM-->` snippet.

This is the body of a campaign:

```html
<!--CAMPAIGN ITEM-->
<div class="cards_item" id="REPLACE_ME-campaign_info_container">
    <div class="card">
        <div class="img-container">
            <img id="REPLACE_ME-picture"
                src="https://www.ksfmedia.fi/wp-content/uploads/2021/05/HBL-365-nurminen.png"
                style="width:100%;">
            <div class="bottom-right-campaign-image ">digitalt</div>
        </div>
        <div class="card_content">
            <h2 class="card_title" id="REPLACE_ME-text">HBL 365</h2>
            <p class="card_text">Kvalitetsjournalistik när, var och hur du vill</p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <div class="text-center" id="more-REPLACE_ME-drop">
                    <div class="text-center">
                        <p class="price-cross">norm. 17.90 € /mån.</p>
                        <p class="price-actual" id="REPLACE_ME-price">49 €</p>
                        <p id="REPLACE_ME-extra_text_price" class="per_month">/6 mån.</p>
                        <p class="campaign_info_header">Prenumerationen är fortlöpande</p>
                        <p class="campaign_info" id="REPLACE_ME-campaign_info">August 31, 2021 23:59:59</p>
                    </div>
                    <div id="more-REPLACE_ME-details" style="display:none;" class="hidden-text">
                        <p class="offer_header">Prenumerationen innehåller</p>
                        <div class="offering_items">
                            <p class="offer_item"><i class="fas fa-check"></i> E-tidningsappen HBL
                                365
                            <p class="offer_sub">E-tidningarna HBL, Västra Nyland, Östnyland och
                                digitala korsord på mobilen
                                eller surfplattan</p>
                            </p>
                            <p class="offer_item"><i class="fas fa-check"></i> E-tidningar på dator
                            <p class="offer_sub">HBL, Västra Nyland, Östnyland och digitala korsord
                                på datorn</p>
                            </p>
                            <p class="offer_item"><i class="fas fa-check"></i> Nyhetsappar
                            <p class="offer_sub">HBL nyheter, VN nyheter och ÖN nyheter, pushnotiser
                            </p>
                            </p>
                            <p class="offer_item"><i class="fas fa-check"></i> Alla artiklar inkl.
                                Premium
                            <p class="offer_sub">Alla artiklar på hbl.fi, vastranyland.fi och
                                ostnyland.fi</p>
                            </p>
                            <p class="offer_item"><i class="fas fa-check"></i> Digitalt månadsbrev
                            <p class="offer_sub">Nyheter & förmåner</p>
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <button
                                class="btn btn-show-down dropdown-toggle rounded-pill detail-button"
                                onclick="moreOrLess(this.id)" id="more-REPLACE_ME">Se detaljer</button>
                        </div>
                        <div class="col">
                            <button class="btn select-button rounded-pill btn-dark"
                                onClick="selectCampaign(this.id)" id="REPLACE_ME">Välj paket</button>
                        </div>
                    </div>
                    <div style="display:none;">
                        <input type="hidden" value="4182" id="REPLACE_ME-campaignNo">
                        <input type="hidden" value="HBL 365" id="REPLACE_ME-packageId">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--ENDING OF CAMPAIGN ITEM-->
```

Christel and Jeppe also do not like to have the visual editor on the campaign pages, to disable this, simply contact Håkan from your WordPress company and provide him with the pageID and tell him to disable the visual editor for that page.

HOW TO PRESELECT A CAMPAIGN

If there is only one campaign, it can be preselected for the user. To do this, add this script to the bottom of the HTML file, changing `REPLACE_ME` to the campaign ID, as done above.

Note that `selectCampaignWithoutScroll` avoids a disorientating page scroll just after page load. 

```html
<script>
  window.onload = (event) => {
    selectCampaignWithoutScroll(REPLACE_ME);
  };
</script>
```

If Elementor has been used to create the campaign page, click on the relevant section in the Elementor visual editor to access and edit the HTML code.
