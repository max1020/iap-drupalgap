/**
 * This is a custom DrupalGap module that adds in-app-purchasing via (Apple, Google and Windows) to DrupalGap. 
 * Tested only on iPhone at this point.
 * The module pulls the products from the store. 
 * User can select an amount (radio button widget) and buy the product. 
 * A Drupal transaction node is created when an item is successfully purchased (order is finished).
 * 
 * WISHLIST:
 * 
 *  *) add loading indicators after clicking the "buy" button (should disappear when the "Confirmation popup" shows up)
 *  *) dynamic population of radio buttons (instead of hardcoding product IDs)
 *  *) support for other IAP product types (e.g. NON_CONSUMABLE)
 *  *) feedback on Android and Windows
 */

/**
 * Implements hook_menu().
 */

function iap_menu() {
  try {
    var items = {};
    items['appstore'] = {
      title: 'Buy points',
      page_callback: 'drupalgap_get_form',
      page_arguments: ['iap_payment_form'],
      pageshow: 'iap_page_pageshow',
    };
    return items;
  }
  catch (error) {
    console.log('iap_menu - ' + error);
  }
}

/**
 * Define the form.
 */
function iap_payment_form(form, form_state) {
  try { 
  	console.log("form id inside mymodle " + form.id);
    form.elements['points'] = {
      type: 'radios',
      title: 'Points',
      options: {
      	50: "50 points", //make sure the value matches part of your product ID in iTunesConnect (e.g. Itunes Product is called "50punkte")
      	90: "90 points",
      	120: "120 points",
  		},
  		default_value:0,
      	required: true
    };
    form.elements['submit'] = {
      type: 'submit',
      value: 'Buy points'
    };
    return form;
  }
  catch (error) { console.log('iap_payment_form - ' + error); }
}

/**
 * Define the form's submit function.
 */
function iap_payment_form_submit(form, form_state) {
  try {
    	var selectedProduct = form_state.values['points'];
  		//console.log("selected Product " + selectedProduct);
  		var orderedProductID = selectedProduct + "punkte";  	// you need to change this. Variable orderedProductID must match the productID of your product.
  		store.order(orderedProductID);
	}
  catch (error) { console.log('iap_payment_form_submit - ' + error); }
}

function iap_page_pageshow(iap_form_alter) {
  drupalgap_alert('My pageshow event has been called!');
	store.verbosity = store.INFO;
	//store.verbosity = store.DEBUG;
	store.register({
	    id: "50punkte", // this is id of your product in iTunesConnect
	    alias: "50 Points",
	    type: store.CONSUMABLE
	});
	
	store.register({
	    id: "90punkte", // this is id of your product in iTunesConnect
	    alias: "90 Punkte",
	    type: store.CONSUMABLE
	});
	
	store.register({
	    id: "120punkte", // this is id of your product in iTunesConnect
	    alias: "120 Points",
	    type: store.CONSUMABLE
	});
	
	store.when("product").updated(function (p) {
		console.log("p stringed: " + JSON.stringify(p));
    });
    
	store.ready(function() {
    console.log("\\o/ STORE READY \\o/");
	});


// When a points purchase is approved, display in the log and finish the transaction.
	
	store.when("50punkte").approved(function (order) {
		createTransactionNode(50);
     	drupalgap_alert("You purchased 50 points!");
    	order.finish();
	}); 
	
	store.when("90punkte").approved(function (order) {
	createTransactionNode(90);
     	drupalgap_alert("You purchased 90 points!");
    	order.finish();
	}); 
	
	store.when("120punkte").approved(function (order) {
	createTransactionNode(120);
     	drupalgap_alert("You purchased 120 points!");
    	order.finish();
	}); 

// After we've done our setup, we tell the store to do
// it's first refresh. Nothing will happen if we do not call store.refresh()
	
	store.refresh();	

  return true; 
}

//requires that a content type with machine name "transaction" exists

function createTransactionNode(amount){
	var account = Drupal.user.name;
	if (account.uid == 0) {
	  alert('You need to be registered to buy Points!');
	}
		else {
			var node = {
  			title:"Amount: " + amount + "Name: " + Drupal.user.name + " UID: " + Drupal.user.uid,
  			type:"transactions"
			};
			node_save(node, {
	  			success:function(result) {
	    		alert("Transaction created. Nid: " + result.nid);
	  			}
			});
		}
}
