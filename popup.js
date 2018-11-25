
//Function to store item enterd and display earlier value
window.onload = function() {
	getItems();
	getItemBadges();
	getBacket();
	document.getElementsByClassName("AddBucketItems").onclick = AddBucketItems;
	document.getElementsByClassName("AddItemGrid").onclick = AddItemGrid;
    getBucketItemBadges();
};

function getItemBadges(){
	
	//Badge Creation to display number of Items in the Frequent Item list
	chrome.storage.sync.get('Collection', function(items) {
		data = items['Collection'];
		/*var len=0; for(key in data){len++;}*/
		len=Object.keys(data).length;
		chrome.browserAction.setBadgeText({"text": len.toString()});
	});
}

function getBucketItemBadges() { 
       var bucketName = this.name;
      chrome.storage.sync.get('Bucket', function(BucketItems){
	   data = BucketItems['Bucket'][bucketName];
			   
	   len=Object.keys(data).length;
	  document.getElementsByClassName("AddBucketItems").setBadgeText({"text": len.toString()});
		
   });
}

function getBacket()
{
	chrome.storage.sync.get('Bucket', function(BucketList) {
		var backetNames = document.getElementById('Backet');
		var index=0;//used to increment id 

	    data = BucketList['Bucket'];
	    for(key in data) { 
	    	var buckets = data[key];         
            if(index%3 ==0)
	    		var tr1 = document.createElement("tr");
	        //Creating and Appending Elements to table
			var td1 = document.createElement("td");	
			//td1
			var view = document.createElement("img");
			view.src = "icon/bucket2.png";
			view.name = buckets.id;
			view.className = "AddBucketItems";
			view.onclick = AddBucketItems;
			td1.appendChild(view);
			var sp = document.createElement("span");
			sp.setAttribute("class", "badge badge-secondary");
			txt = document.createTextNode(buckets.id);
			sp.appendChild(txt);
			td1.appendChild(sp);
			td1.className = "bucketClass";
			td1.setAttribute("title", buckets.id);
		    tr1.appendChild(td1);			
			if(index%3 ==0)	
				backetNames.appendChild(tr1);
			      
			index++;
		};   
	});
}


function getItems(){
	
	chrome.storage.sync.get('Collection', function(items){
	
	var ItemVal = document.getElementById('ItemVal');
    var index=0;//used to increment id for checkboxes
			
     data = items['Collection'];
	  for(key in data) 
	  {			 
		   var item = data[key];                	       

		   //Creating and Appending Elements to table
	    	var tr = document.createElement("tr");
			var td1 = document.createElement("td");	
			var td2 = document.createElement("td");	
			var clickbtn = document.createElement("img");
			clickbtn.src = "icon/addNew.png";
			clickbtn.name=item.id;
            clickbtn.className = "AddItemGrid";
			clickbtn.onclick = AddItemGrid;
			var txt = document.createTextNode("\xa0\xa0\xa0\xa0\xa0\xa0"+item.id);
		
			td1.appendChild(txt);
			tr.appendChild(td1);
			td2.appendChild(clickbtn);
			tr.appendChild(td2);
				  
    		ItemVal.appendChild(tr)  ;
    		index++;
		  
	  }    
	    if(index==0)
	     {
	    		alert("No Item Found!")
	     }  
	});
}

 function AddItemGrid(){ 
	var ButtonName=this.name;
	chrome.storage.sync.get('Collection', function(items) {
		ItemName = items['Collection'][ButtonName];
		chrome.tabs.query({active:true,currentWindow:true}, function(tabs){
		 	chrome.tabs.sendMessage(tabs[0].id,{todo: "AddSingleItem", items: ItemName.id});
	   }); 
	 });
	
}

function AddBucketItems(){
	var bucketName = this.name;
    var itemArray = new Array();	
    var itemFound = false;
	chrome.storage.sync.get('Bucket', function(BucketItems){
		data = BucketItems['Bucket'][bucketName];
		for(key in data){
			if(key != 'id' && key!= null){
				itemFound = true;
			 itemArray.push(data[key]["id"]);
		   }
		}
		if(itemFound == false){
			alert("No Items Found!");
			return;
			}
		chrome.tabs.query({active:true,currentWindow:true}, function(tabs){
		 	chrome.tabs.sendMessage(tabs[0].id,{todo: "AddMultiItems", items: itemArray});
   		});
	});
     
}
		 
