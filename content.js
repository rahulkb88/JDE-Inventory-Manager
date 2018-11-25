//@author: Rahul Kumar; Sudharani Bhaskari
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	var j=0; 
	if(request.todo == "AddMultiItems"){
		
		var itemList = request.items;
       var s = top.window.document.getElementById("e1menuAppIframe");
   	          
		//debugger;
		var len = itemList.length;
		for(var index =0; index<len;index++)
		{
			var i = itemList.shift();
					   
	        $(s).contents().find('.JSTextfield')[j].value=i;
		    $(s).contents().find('.JSTextfield')[j].dispatchEvent(new KeyboardEvent('keydown',  {'keyCode':'40'}));
	
		    $(s).contents().find('.JSTextfield')[j+1].focus();
			   
		}
	}
	else 
		if(request.todo ="AddSingleItem")
		{
			var itemList = request.items;
           var s = top.window.document.getElementById("e1menuAppIframe");
	 
		   $(s).contents().find('.JSTextfield')[j].value=itemList; 	
	       $(s).contents().find('.JSTextfield')[j].dispatchEvent(new KeyboardEvent('keydown',  {'keyCode':'40'}));
		   $(s).contents().find('.JSTextfield')[j+1].focus();
		}
	
});

