# iap-drupalgap

<h2>In app purchase module for Drupalgap</h2>

Experimental project to add In-app-purchasing to Drupalgap using Cordova and the Fovea iap plugin. Pull requests are welcome. Only consumable products are supported.

<h3>Requirements</h3>

<b>Apple</b>

Those are just the most important steps to get IAP up and running in IOS.

1. Create an App id in Apple Developer
2. Create a provisioning profile (with the device you are testing it on, enable inAppPurchasing) for the app
2. Create an app in iTunesConnect for the same app
2. Create some CONSUMABLE products (only they are supported at this point)
3. Submit all documents to Apple (legal, tax)

Provided you follow the steps below, with this basic setup you should be able to connect to your iTunes store and pull your products from iTunesConnect. Check the console for something like 
```
{"id":"90punkte","alias":"90 Punkte","type":"consumable","state":"valid","title":"90 Punkte","description":"90 Pumnlte fasfasd","price":"$8.99","currency":"USD","loaded":true,"canPurchase":true,"owned":false,"downloading":false,"downloaded":false,"transaction":null,"valid":true}
2015-12-31 11:15:51.910 appname[372:60b] \o/ STORE READY \o/
```
If you get an invalid product, this might help: http://troybrant.net/blog/2010/01/invalid-product-ids/ 

You cannot order something without a sandbox user.
You need a physical device to make a purchase.

4. create a sandbox user (yes, you need to fill in a secret question)


<b>App Store, Drupal 7 and DrupalGap</b>

Cordova IAP plugin: https://github.com/j3k0/cordova-plugin-purchase (install with cordova plugin add cc.fovea.cordova.purchase)

<b>Drupal 7</b>

A transaction node is created in Drupal when an IAP order is completed/finished. So you need to create a content type called "transactions" in Drupal with corresponding permissions. If you do not want this just uncomment or delete the createTransactionNode call.

<b>DrupalGap</b>

Info on custom DrupalGap modules: http://docs.drupalgap.org/7/Modules/Create_a_Custom_Module

1) Create a custom modules and iap folder in your app so that you have such a folder structure (after you have exported DrupalGap to your local app project):

appname/www/app/modules/iap/iap.js

2) Copy the content of iap.js from this repository in your iap.js file

3) enable the DrupalGap module in appname/www/app/settings.js like this:

```
/** Custom Modules - www/app/modules/custom **/
Drupal.modules.custom['iap'] = {};
```

4) Make sure your product name matches the variable (orderedProductID) that is passed via store.order(orderedProductID). 

At this point the product IDs are hardcoded as radio button option values with a suffix added in the form_submit function. There certainly are better ways to dynamically populate the radio buttons.

```
function iap_payment_form_submit(form, form_state) {
  try {
    	var selectedProduct = form_state.values['points'];
  		//console.log("selected Product " + selectedProduct);
  		var orderedProductID = selectedProduct + "punkte";  	// you need to change this. Variable orderedProductID must match the productID of your product.
  		store.order(orderedProductID);
	}
  catch (error) { console.log('iap_payment_form_submit - ' + error); }
}
````

5) Optional: Set a menu link on the home page or in the authenticated user menu (both in settings.js)

  a) // App Front Page
```
drupalgap.settings.front = 'in-app';
```

  b) Authenticated user menu
  add it to this array:
```
drupalgap.settings.menus['user_menu_authenticated'] = {
  options: menu_popup_get_default_options(),
  links: [
.
.
.
{
      title: 'Get points',
      path: 'in-app',
      page_callback: 'drupalgap_get_form',
      page_arguments: ['iap_payment_form'],
      options: {
        attributes: {
          'data-icon': 'delete'
        }
      }
    }
```

<h3>Resources:</h3>

1. Simple example https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/minimal-example.js
2. Full example: https://github.com/dpa99c/cordova-plugin-purchase-demo/blob/master/www/js/index.js
3. Useful guide: https://software.intel.com/en-us/xdk/docs/html5-hybrid-apps-with-cordova-and-in-app-purchase
