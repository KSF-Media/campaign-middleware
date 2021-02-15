The project consists of 2 major parts. The frontend (found in the .html .css and fonts files) and the middleware for WordPress which can be found in this .php file.

To get this to work you will have to import the .php file into wordpress as a plugin and activate it.
Then you follow the instructions found in the ksf-campaign-pages-html repo

How to import the plugin and activate it: 
1. Zip the campaign-pages.php file
2. Go to the wordpress admin dashboard and click Plugins > Add New
3. In the upperleft corner select `Upload Plugin`
4. Drag-and-drop the zip folder created above
5. Go to Plugins > Installed plugins and click Activate on the ksf-campaign-pages-php

For staging and prod there aren't really any smart env. management tools for wordpress unless hosting the wordpress server yourself. So we will have to go and manually change the endpoints if we are going to prod.
Therefor, go into the campaign-pages.php and replace all occurences of `staging` with `api` to have the correct
endpoints in the WP middleware.