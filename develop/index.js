window.onload = function(){
	var content = document.getElementsByClassName("content")[0],
		oneManager = new OneManager()
	;
	oneManager.countArticles(content);
	oneManager.displayArticlesCount(content);
	oneManager.addSelectorAction(content);

}






var EventUtil={
	addHandler:function(element,type,handler){ 
		if(element.addEventListener){ 
			element.addEventListener(type,handler,false);  
		}else if(element.attachEvent){                    
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;         
		}
	},
	getEvent:function(event){  
		return event?event:window.event;
	},
	getTarget:function(event){  
		return event.target||event.srcElement;
	}
 }

function OneManager(){
	this.articles = {};

	if(typeof this.countArticles != "function"){
		OneManager.prototype.countArticles = function(contentElement){
			var that = this,
				selector = contentElement.getElementsByClassName("selector")[0],
				ones = contentElement.getElementsByClassName("one")
			;
			for (var i=0, len=selector.childNodes.length; i<len; i++){
				var child = selector.childNodes[i];
				if (child.nodeType == 1){
					this.articles[child.id] = 0;
				}
			}
			for (var i=0, len=ones.length; i<len; i++){
				var one = ones[i];
				if (one.nodeType == 1){
					(function(){
						for (var j in that.articles){
							if(one.className.indexOf(j)>0){
								that.articles[j] ++;
							}
						}
					})();
				}
			}
		}	
	}

	if(typeof this.displayArticlesCount != "function"){
		OneManager.prototype.displayArticlesCount = function(contentElement){
			var that = this;
			var children = contentElement.getElementsByClassName("selector")[0].childNodes;
			for (var i=0, len=children.length; i<len; i++){
				if (children[i].nodeType == 1){
					children[i].getElementsByClassName("count")[0].innerText = that.articles[children[i].id];
				}
			}
			
		}	
	}


	if(typeof this.addSelectorAction != "function"){
		OneManager.prototype.addSelectorAction = function(contentElement){
			var selectors = contentElement.getElementsByClassName("selector")[0];
			EventUtil.addHandler(selectors, "click", function(event){	
				var event = EventUtil.getEvent(event),
					target = EventUtil.getTarget(event),
					children = selectors.childNodes
				;
				for (var j=0, len=children.length; j<len; j++){
					if (children[j].nodeType == 1){
						if (children[j].className.indexOf("current")>=0 && children[j] != target){
							children[j].className = children[j].className.replace("current","");
						} else if (children[j].className.indexOf("current")<0 && children[j] == target){
							children[j].className += " current";
						}
					}
				}
				var ones = contentElement.getElementsByClassName("one");
				for (var k=0,len=ones.length; k<len; k++){
					if (ones[k].className.indexOf(target.id)>0){
						ones[k].style.display = "block";
					} else {
						ones[k].style.display = "none";
					}
				}
			})


		}
	}


}