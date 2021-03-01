The project consists of 2 major parts. The frontend (found in the .html .css and fonts files) and the middleware for WordPress which can be found in the .php file.

To get this to work you will have to import the .php file into wordpress as a plugin and activate it.
Then you follow the instructions found in the ksf-campaign-pages-html repo

How to import the plugin and activate it: 
1. Zip everything in this folder but the HTML file
2. Go to the wordpress admin dashboard and click Plugins > Add New
3. In the upperleft corner select `Upload Plugin`
4. Drag-and-drop the zip folder created above
5. Go to Plugins > Installed plugins and click Activate on the ksf-campaign-pages-php

For staging and prod there aren't really any smart env. management tools for wordpress unless hosting the wordpress server yourself. So we will have to go and manually change the endpoints if we are going to prod.
Therefor, go into the campaign-pages.php and replace all occurences of `staging` with `api` to have the correct
endpoints in the WP middleware.

Still some error handling and figuring out the .env variables in wordpress left to do.
Just put in the staging API endpoints statically for now.

Then to get the HTML, CSS and JS components to work you will first need to upload the campaign-pages folder
to your wordpress site.

HOW TO:
//Kolla om vi kan ändra här så att den inte behöver ändras :)!
1. Start by replacing the URL found on line 85 of the js file in campaign-pages/ksf-campaign-pages.js with
your domain i.e. url: 'http://ksf.com/wp-json/ksf-campaign/v1/new'
//Kolla vart man kan upploada detta
2. Zip the campaign-pages folder and upload it to your wordpress site.
3. Change the css href location found on line 6 in the HTML to match the location of where you uploaded the zip folder
4. Change the js href location found on line 391 in the HTML to match the location of where you uploaded the zip folder
5. Copy the HTML file content and paste it into a a HTML snippet in your wordpress page.

HOW TO ADD CAMPAIGNS:

Simply copy the code snippet below into a text editor, press CTRL+F and replace all occurrences of "REPLACE_ME"
with a UID, can be the campaignNo but it doesn't really matter since this is just a unique identifier for hiding and showing 
stuff in the DOM. The most important thing is that you replace: 
`<input type="hidden" value="4049" id="REPLACE_ME-campaignNo">
<input type="hidden" value="HBL WEBB" id="REPLACE_ME-packageId">`
with the correct packageId and campaignNo, put these inside the quotes after value.

Last but not least, replace the picture with a URL where you are hosting your campaign images. You can experiment around
with width and height. And replace the text fields with your campaign data.

Once you've done that you can safely paste this snippet into the HTML on the campaign pages.
Paste it before a `<!--CAMPAIGN ITEM-->` snippet or after a `<!--ENDING OF CAMPAIGN ITEM-->` snippet.

This is the body of a campaign: 
`         <!--CAMPAIN ITEM-->
          <div class="cards_item">
            <div class="card">
              <div class="img-container">
                <img id="REPLACE_ME-picture" src="https://picsum.photos/300/220/?image=19" style="width:100%;">
                <div class="bottom-right-campaign-image ">fre-Sön</div>
              </div>
              <div class="card_content">
                <h2 class="card_title" id="REPLACE_ME-text">HBL+Presentkort till stockman</h2>
                <p class="card_text">HBL 7 dagar + 500 € presentkort till Stockholm</p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                  <div class="text-center" id="more-REPLACE_ME-drop">
                    <div class="text-center">
                      <p class="price-cross">norm. 299.95 €</p>
                      <p class="price-actual" id="REPLACE_ME-price">99,95 €</p>
                      <p class="per_month">/ månad *</p>
                      <p class="campaign_info">Jan 25, 2021 00:00:00</p>
                    </div>
                    <div id="more-REPLACE_ME-details" style="display:none;" class="hidden-text">
                      <p class="offer_header">Prenumerationen innehåller</p>
                      <div class="offering_items">
                        <p class="offer_item"><i class="fas fa-check"></i> Papperstidningen
                        <p class="offer_sub">Tryckta tidningen HBL fredag-söndag</p>
                        </p>
                      </div>
                    </div>
                    <div class="campaign-button-group">
                      <button class="btn btn-show-down dropdown-toggle rounded-pill detail-button"
                        onclick="moreOrLess(this.id)" id="more-REPLACE_ME">Se detaljer</button>
                      <button class="btn btn-dark rounded-pill select-button" onClick="selectCampaign(this.id)"
                        id="REPLACE_ME">Välj
                        paket</button>
                      <input type="hidden" value="4049" id="REPLACE_ME-campaignNo">
                      <input type="hidden" value="HBL WEBB" id="REPLACE_ME-packageId">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--ENDING OF CAMPAIGN ITEM-->`