//@author: Rahul Kumar; Sudharani Bhaskari
//
//Background Javascript
//ContextMenus variable
var ContMenu = {
  	title: "Save to Frequent Used Item List",
  	contexts:["selection"],
  	onclick:myfunction
};
//Create ContextMenus
chrome.contextMenus.create(ContMenu, myfunction);
//ContextMenus Function
function myfunction(data){
	addItem = confirm("Do you want to add "+data.selectionText+" to favourite item list?");
	if(!addItem){
		return;
	}
	//NOTE: This is almost same as SAVE of popup.js :)
    chrome.storage.sync.get('Collection', function(items) {

		var itemName = data.selectionText,
		duplicateExists = 0;

		data = items['Collection'];
		//check for duplicate entry
	    for(key in data) {
	    	if(data[key].name==itemName){
	    		duplicateExists = 1;
	    		break;
	    	}
	    }
		if(itemName && duplicateExists==0)
		{
			obj = {
	            "id": itemName
        	};

			if(items && !items['Collection']) {
            	items['Collection'] = {};         
        	}
	        items['Collection'][obj.id] = obj;
	      // items['Collection'][name] = name;
	        chrome.storage.sync.set(items, function() {
	            // Notify that we saved.
	            console.log("item "+itemName+" saved!");
	        });
	        
	        //show notification
	        var notificate = {
	        	type:"basic",
	        	title:"New Item Added",
	        	message:"Item "+itemName+" has been saved to the List",
	        	iconUrl:"icon/JDE_Ext64.jpg"
	        };
	        chrome.notifications.create(notificate);
		}
		else 
		{
			if(duplicateExists==1){
				alert("Duplicate Entry!");
			}
			else
			{
				alert("Input is not valid. Please try again!!");
			}
		}
		
	});
}
//END of ContextMenus function


//Badge Creation to display number of Items in the Frequent Item list
chrome.storage.onChanged.addListener(function(changes, storageName){
	badgeLoad();
});

window.onload = function() {
	badgeLoad();
	//console.log("badge loaded");
}

function badgeLoad(){
	chrome.storage.sync.get('Collection', function(items) {
		data = items['Collection'];
		/*var len=0; for(key in data){len++;}*/
		len=Object.keys(data).length;
		chrome.browserAction.setBadgeText({"text": len.toString()});
	});
}
