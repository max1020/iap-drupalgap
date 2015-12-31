# iap-drupalgap

<h2>In app purchase module for Drupalgap</h2>

Experimental project to add In-app-purchasing to Drupalgap using Cordova and the Fovea iap plugin. Pull requests are welcome. Only consumable products are supported.

<h3>Requirements</h3>

<b>Drupal 7 and DrupalGap</b>

Cordova IAP plugin: https://github.com/j3k0/cordova-plugin-purchase (install with cordova plugin add cc.fovea.cordova.purchase)

<b>Basics for using this IAP DrupalGap module:</b>

Info: http://docs.drupalgap.org/7/Modules/Create_a_Custom_Module

1) Create a custom modules and iap folder in your app so that you have

appname/www/app/modules/iap/iap.js

2) Copy the content of iap.js from this repository in your iap.js file

3) enable the DrupalGap module in appname/www/app/settings.js like this:

```
/** Custom Modules - www/app/modules/custom **/
Drupal.modules.custom['iap'] = {};
```

4) Optional: Set a menu link on the home page or in the authenticated user menu (both in settings.js)

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
