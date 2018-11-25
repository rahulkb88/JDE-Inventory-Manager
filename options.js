//Referenced in popup.html
/*
*	Inner Functions List
*	--------------
*	1. GetItems - Done
*	2. AddItem - Done
*	3. DeleteItem - Done
*	4. DeleteAllItems - Done
*	5. GetBuckets - Done
*	6. AddBucket - Done
*	7. DeleteBucket - Done
*	8. DeletAllBuckets - Done
*	9. AddItemInBucket - Done
*	10.ViewBucketItems - Done
*/

//jQuery.noConflict();

window.onload = function() {
	getItems();
	getBuckets();
	document.getElementById("addItem").onclick = addItem;
	document.getElementById("deleteAllItems").onclick = deleteAllItems;	
	document.getElementById("addBucket").onclick = addBucket;
	document.getElementById("deleteAllBuckets").onclick = deleteAllBuckets;
	document.getElementsByClassName("deleteItem").click = deleteItem;
	document.getElementsByClassName("deleteBucket").click = deleteBucket;
	//popover - Not Working :/
	//$('[data-toggle="popover"]').popover();   
	//document.getElementsByClassName("btn").popover();
	
};


//function 1
function getItems(){
	//FIND button click
	chrome.storage.sync.get('Collection', function(items) {
		var ItemVal = document.getElementById('tbody1');
		var index=1;//used to increment id for checkboxes

	    data = items['Collection'];
	    for(key in data) { 
	    	var item = data[key];       
	        //Creating and Appending Elements to table
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");	
			var td2 = document.createElement("td");	
			var td3 = document.createElement("td");
			//td1
			var txt = document.createTextNode(index.toString());
			td1.appendChild(txt);
			tr.appendChild(td1);
			//td2
			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.className = "itemSelect";
			checkbox.value = item.id;
			checkbox.id = "select"+index;
			td2.appendChild(checkbox);
			txt = document.createTextNode("\xa0\xa0\xa0\xa0\xa0\xa0"+item.id);// "\xa0" adds space.
			td2.appendChild(txt);			
			td2.draggable = "true";
			td2.name = item.id;
			td2.className = "itemClass";
			tr.appendChild(td2);
			//td3
			var del = document.createElement("img");
			del.src = "icon/trash.png";
			del.name = item.id;
			del.className = "deleteItem btn";
			del.onclick=deleteItem;
			td3.appendChild(del);	  
			tr.appendChild(td3);
			//append tr
    		ItemVal.appendChild(tr)  ;
    		index++;
    	};    
	});
}

//function 2
function addItem(){
	chrome.storage.sync.get('Collection', function(items) {
		var itemName = prompt("Please Enter the New Item:");
		if(itemName){
			var	duplicateExists = 0,
			key;

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
		            console.log('Settings saved');
		        });
		        //show notification
		        var notificate = {
		        	type:"basic",
		        	title:"New Item Added",
		        	message:itemName+" has been saved to the List",
		        	iconUrl:"icon/JDE_Ext64.jpg"
		        };
		        chrome.notifications.create(notificate);
		        location.reload();
			}
			else if(duplicateExists==1){
					alert("Duplicate Entry!");
			}
		}
	});
}


//function 3
function deleteItem(){
	itemName = this.name;
	if(confirm("Do you want to delete item "+ itemName + " ?")){
		chrome.storage.sync.get('Collection', function(items) {
			delete(items['Collection'][itemName]);
			chrome.storage.sync.set(items, function() {
	            // Notify that we saved.
	        });
	    	location.reload();
	    });
	}
}


//function 4
function deleteAllItems(){
	if(confirm("Do you want to delete all existing data?")){
		chrome.storage.sync.get('Collection', function(items) {
			items['Collection'] = null;
	        chrome.storage.sync.set(items, function() {
	        	//console.log("All Items Deleted!!!")
	        });
	    });
	    location.reload();
	}
}

//function 5
function getBuckets(){
	chrome.storage.sync.get('Bucket', function(BucketList) {
		var tbody = document.getElementById('tbody2');
		var index=1;//used to increment id 

	    data = BucketList['Bucket'];
	    for(key in data) { 
	    	var buckets = data[key];         

	        //Creating and Appending Elements to table
			var tr = document.createElement("tr"); 
			var td1 = document.createElement("td");	
			var td2 = document.createElement("td");	
			var td3 = document.createElement("td");	
			var td4 = document.createElement("td");	
			//td1
			var txt = document.createTextNode(index.toString());
			td1.appendChild(txt);
			tr.appendChild(td1);
			//td2
			var view = document.createElement("img");
			view.src = "icon/view.png";
			view.name = buckets.id;
			view.className = "btn";
			//view.setAttribute("type", "button");style="float:right"
			view.setAttribute("data-toggle", "modal");
			view.setAttribute("data-target", "#exampleModalLong");
			view.onclick = ViewBucketItems;
			td2.appendChild(view);

			txt = document.createTextNode(buckets.id);
			td2.appendChild(txt);
			td2.className = "bucketClass";
			td2.setAttribute("title", buckets.id);
			//note: tabindex, data-toggle, data-trigger, data-content are required for popover
			//td2.setAttribute("tabindex", "0");
			//td2.setAttribute("data-toggle", "popover");
			//td2.setAttribute("data-trigger", "focus");
			//td2.setAttribute("data-content", "contents!");
			//td2.setAttribute("role", "button");			
			tr.appendChild(td2);	

			//td3
			var plus = document.createElement("img");
			plus.src = "icon/add.png";
			plus.name = buckets.id;
			plus.className = "addBucket btn";
			plus.onclick = addItemInBucket;
			td3.appendChild(plus);
			tr.appendChild(td3);  
			//td4
			var del = document.createElement("img");
			del.src = "icon/trash.png";
			del.name = buckets.id;
			del.className = "deleteBucket btn";
			del.onclick=deleteBucket;
			td4.appendChild(del);	  
			tr.appendChild(td4);
			//append tr
			tbody.appendChild(tr);
			index++;
		};   
	});
}


//function 6
function addBucket(){
	console.log("inside addbucket");
	chrome.storage.sync.get('Bucket', function(BucketList) {

		var bucketName = prompt("Enter the Bucket Name: ");	
		if(bucketName)
		{
			var duplicateExists = 0, key;

			data = BucketList['Bucket'];
			//check for duplicate entry
		    for(key in data) {
		    	if(data[key].name==bucketName){
		    		duplicateExists = 1;
		    		break;
		    	}
		    }
			if(bucketName && duplicateExists==0)
			{
				obj = {
		            "id": bucketName
	        	};

				if(BucketList && !BucketList['Bucket']) {
	            	BucketList['Bucket'] = {};         
	        	}
		        BucketList['Bucket'][obj.id] = obj;

		        chrome.storage.sync.set(BucketList, function() {
		            // Notify that we saved.
		            console.log('Bucket saved');
		        });

		        //show notification
		        var notificate = {
		        	type:"basic",
		        	title:"New Item Added",
		        	message:bucketName+" has been saved to the Bucket List",
		        	iconUrl:"icon/JDE_Ext64.jpg"
		        };
		        chrome.notifications.create(notificate);
		        location.reload();
			}
			else if(duplicateExists==1)
			{
				alert("Duplicate Entry!");
			}
		}	
	});
}


//function 7
function deleteBucket(){
	bucketName = this.name;
	if(confirm("Do you want to delete bucket "+ bucketName + " ?")){
		chrome.storage.sync.get('Bucket', function(BucketList) {
			delete(BucketList['Bucket'][bucketName]);
			chrome.storage.sync.set(BucketList, function() {});
	    	location.reload();
	    });
	}
}

//function 8
function deleteAllBuckets(){
	if(confirm("Do you want to delete all existing data?")){
		chrome.storage.sync.get('Bucket', function(BucketList) {
			BucketList['Bucket'] = null;
	        chrome.storage.sync.set(BucketList, function(){});
	    });
	    location.reload();
	}	
}


//function 9
function addItemInBucket(){
	var bucketName = this.name;
	chrome.storage.sync.get('Bucket', function(BucketList){		
		var len=0;
		var itemsList = document.getElementsByClassName('itemSelect');
		if(itemsList){
			while(len< itemsList.length){
				if(itemsList[len].checked){
					itemName = itemsList[len].value;
					if(itemName){
						console.log(itemName);
						if(BucketList['Bucket'] && !BucketList['Bucket'][bucketName]) {
				        	BucketList['Bucket'][bucketName] = {};         
				    	}
					    var obj = {
					    	"id" : itemName
					    }
						BucketList['Bucket'][bucketName][obj.id] = obj;
						chrome.storage.sync.set(BucketList, function(){
							console.log("saved "+itemName);
						});
					}
				}
				len++;
			}
			location.reload();
		}
	});
}


//function 10
function ViewBucketItems(){
	var bucketName = this.name;
	var itemFound = false;
	document.getElementById('ModalBodyId').innerHTML = '';
	document.getElementById('exampleModalLongTitle').innerHTML = bucketName;
	chrome.storage.sync.get('Bucket', function(BucketItems){
		data = BucketItems['Bucket'][bucketName];
		var Orderednode = document.createElement("ol");
		for(key in data){
			if(key != 'id' && key!= null){
				itemFound = true;
				var item= data[key]["id"];
				var node = document.createElement("li");
				var txt = document.createTextNode(item);
				node.appendChild(txt);
				Orderednode.appendChild(node);
			}
		}

		if(itemFound == false){
			var node = document.createElement("p");
			var txt = document.createTextNode("No Items Found!");
			node.appendChild(txt);
			document.getElementById('ModalBodyId').appendChild(node);
		}
		else{
			document.getElementById('ModalBodyId').appendChild(Orderednode);
		}
		
	});
}


// - not required--obsolete
function getBucketItem(idName){
	chrome.storage.sync.get(idName, function(bucketItem){
		var tbody = document.getElementById('tbody3');
		var index=1;//used to increment id for checkboxes

	    data = bucketItem[idName];
	    for(key in data) { 
	    	var item = data[key];         

	        //Creating and Appending Elements to table
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");	
			var td2 = document.createElement("td");	

			var txt = document.createTextNode(index.toString());
			td1.appendChild(txt);
			tr.appendChild(td1);
			txt = document.createTextNode(item.name);
			td2.appendChild(txt);
			tr.appendChild(td2);	  

			tbody.appendChild(tr)  ;
			index++;
		};  
	});
}


/* 
//drag & drop
 (function(){ 
	function drag(ev) {
		ev.dataTransfer.setData("text/html", ev.target.id);
	}  
	function allowDrop(ev) {
		ev.stopPropagation();
		ev.preventDefault();
	} 
	function drop(ev) {  
		ev.preventDefault();  
		var data = ev.dataTransfer.getData("text/html");  
		ev.target.appendChild(document.getElementById(data));  
	}  

	function Init(){
		source = document.getElementsByClassName("itemClass");
		target = document.getElementsByClassName("bucketClass");

		target.addEventListener("dragover", allowDrop, false);
		source.addEventListener("dragstart", drag, false);
		target.addEventListener("drop", drop, false);
	}

	Init();
})();
*/

/*s = document.getElementsByClassName("itemClass");
s.call(function(s){
	//s = document.getElementsByClassName("bucketClass");
	s.addEventListener('ondragover', function(ev) {ev.preventDefault();});  
	s.addEventListener('ondragstart', function(ev) {
		ev.dataTransfer.setData("text/html", ev.target.id);
	});  
	t.addEventListener('ondrop', function (ev) {  
		ev.preventDefault();  
		var data = ev.dataTransfer.getData("text/html");  
		ev.target.appendChild(document.getElementById(data));  
	});
});*/