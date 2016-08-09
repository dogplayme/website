function PhotoDisplayManager(){
	if(typeof this.initialManagerData != "function"){
		PhotoDisplayManager.prototype.initialManagerData = function(){
			this.manager = {
				outsideChain: "http://obbc714o1.bkt.clouddn.com/site/",
			//	outsideChain: "../",
				photos: [],
				photosCount: 0,
				status: {
					hiddenHead: [],
					displayNormal: [],
					hiddenTail: []
				},
				activatingIndex: 0,
				thumbAvailableWidth: 0
				
			}
		}
	}

	if(typeof this.installJsonp != "function"){
		PhotoDisplayManager.prototype.installJsonp = function(url){
			var jsonpScript = $("<script></script>");
			jsonpScript.attr("type", "text/javascript");
			jsonpScript.attr("src", url);
			jsonpScript.attr("id", "jsonp");
			$("body").append(jsonpScript);
			jsonpScript = null;
		}
	}

	if(typeof this.parseJsonpData != "function"){
		PhotoDisplayManager.prototype.parseJsonpData = function(method){
			var photosJS = JSON.parse(JSON.stringify(photosJsonp));
			switch (method){
				case "rewrite":
					this.initialManagerData();
					for(var i=0, len=photosJS.length; i<len; i++){
						var data = {
							index: i,
							name: photosJS[i]["name"],
							path: photosJS[i]["path"]
						};
						this.manager["photos"].push(data);
						this.manager["photosCount"]++;
						data = null;
					}
					break;
				case "add":
				default:
					break;
			}
			photosJS = null;	
		}
	}

	if(typeof this.uninstallJsonp != "function"){
		PhotoDisplayManager.prototype.uninstallJsonp = function(){
			$("#jsonp").remove();
		}
	}


	if(typeof this.updateThumbAvailableWidth != "function"){
		PhotoDisplayManager.prototype.updateThumbAvailableWidth = function(thumbShowElement){
			var count = this.manager["status"]["displayNormal"].length,
				total = parseFloat(thumbShowElement.parent().css("width")),
				exist = (count==0) ? 0 : this.getComputedVhVw(18, "vh") * count
			;
			this.manager["thumbAvailableWidth"] = total - exist;
			count = total = exist = null;
		}
	}

	if(typeof this.getComputedVhVw != "function"){
		PhotoDisplayManager.prototype.getComputedVhVw = function(num, unit){
			var tempElement = $("<div></div>"),
				tempValue = num + unit;
			tempElement.attr("class", "tempElement");
			tempElement.css("width", tempValue);
			tempElement.css("display", "none");
			$("body").append(tempElement);
			tempValue = $("body").children(".tempElement").css("width");
			tempElement  = null;
			$("body").children(".tempElement").remove();
			return parseFloat(tempValue);
		}
	}

	if(typeof this.isThumbInsertable != "function"){
		PhotoDisplayManager.prototype.isThumbInsertable = function(num){
			var newNeed,
				flag
			;
			if (typeof num == "number"){
				newNeed = num;
			} else {
				newNeed = this.getComputedVhVw(18,"vh");
			}
			flag = this.manager["thumbAvailableWidth"] - newNeed < 0 ? -1 : 1;
			newNeed = null;
			return flag;
		}	
	}

	if(typeof this.insertThumb != "function"){
		PhotoDisplayManager.prototype.insertThumb = function(thumbShowElement, index){
			var target = this.manager["photos"][index],
				url = "url('" + this.manager["outsideChain"] + target["path"] + target["name"] + "_low.jpg')",
				tempElement = $("<div></div>")
			;
			tempElement.attr({
				"class": "one",
				"aria-label": target["name"],
				"data-index": index
			});
			tempElement.css("background-image", url);
			thumbShowElement.append(tempElement);
			target = url = tempElement = null;
		}	
	}

	if(typeof this.updateStatus != "function"){
		PhotoDisplayManager.prototype.updateStatus = function(method, status){
			var displayNormalArray = this.manager["status"]["displayNormal"],
				hiddenHeadArray = this.manager["status"]["hiddenHead"],
				hiddenTailArray = this.manager["status"]["hiddenTail"],
				currentRightNormalIndex ,
				currentLeftNormalIndex = displayNormalArray[0]
			;
			if (typeof displayNormalArray[displayNormalArray.length-1] == "number"){
				currentRightNormalIndex = displayNormalArray[displayNormalArray.length-1];
			} else {
				currentRightNormalIndex = -1;
			}
			switch(method){
				case "seeMoreRight":
					switch(status){
						case "show":
							hiddenTailArray.shift();
							displayNormalArray.push(currentRightNormalIndex+1);
							break;
						case "hide":
							displayNormalArray.shift(currentLeftNormalIndex);
							hiddenHeadArray.push(currentLeftNormalIndex);
							break;
						default:
					}
					break;
				case "seeMoreLeft":
					switch(status){
						case "show":
							hiddenHeadArray.pop();
							displayNormalArray.unshift(currentLeftNormalIndex-1);
							break;
						case "hide":
							displayNormalArray.pop();
							hiddenTailArray.unshift(currentRightNormalIndex);
							break;
						default:
					}
					break;
				default:
			}
			status = 
			displayNormalArray = 
			hiddenHeadArray = 
			hiddenTailArray = 
			currentRightNormalIndex =
			currentLeftNormalIndex = null;
		}	
	}

	if(typeof this.hideOneThumb != "function"){
		PhotoDisplayManager.prototype.hideOneThumb = function(thumbShowElement, method){
			var displayNormalArray = this.manager["status"]["displayNormal"],
				target
			;
			switch(method){
				case "seeMoreRight":
					target = thumbShowElement.children().eq(displayNormalArray[0]);
					this.updateStatus(method, "hide");
					this.updateThumbAvailableWidth(thumbShowElement);

					break;
				case "seeMoreLeft":
					target = thumbShowElement.children().eq(displayNormalArray[displayNormalArray.length-1]);
					this.updateStatus( method, "hide");
					this.updateThumbAvailableWidth(thumbShowElement);
					break;
				default:
			}
			target.css("display", "none");
			target = null;
		}	
	}

	if(typeof this.showEnoughThumb != "function"){
		PhotoDisplayManager.prototype.showEnoughThumb = function(thumbShowElement, method){
			var displayNormalArray = this.manager["status"]["displayNormal"],
				target,
				targetIndex
			;

			switch(method){
				case "seeMoreRight":
					var currentRightNormalIndex;
					if (typeof displayNormalArray[displayNormalArray.length-1] == "number"){
						currentRightNormalIndex = displayNormalArray[displayNormalArray.length-1];
					} else {
						currentRightNormalIndex = -1;
					}
					targetIndex = currentRightNormalIndex + 1;
					while (this.isThumbInsertable() > 0){
						if (this.manager["status"]["hiddenTail"].length == 0){
							this.insertThumb(thumbShowElement, targetIndex);
						} else{
							target = thumbShowElement.children().eq(targetIndex);
							target.css("display", "block");
						}
						this.updateStatus(method, "show");
						this.updateThumbAvailableWidth(thumbShowElement);
						targetIndex ++;
					}
					currentRightNormalIndex = null;
					break;
				case "seeMoreLeft":
					var currentLeftNormalIndex = displayNormalArray[0];
					targetIndex = currentLeftNormalIndex - 1;
					target = thumbShowElement.children().eq(targetIndex);
					target.css("display", "block");
					this.updateStatus(method, "show");
					break;
				default:
			}
			
			displayNormalArray = 
			target = 
			targetIndex = null;

		}	
	}

	if(typeof this.changeActivatingIndex != "function"){
		PhotoDisplayManager.prototype.changeActivatingIndex = function(thumbShowElement, index){
			thumbShowElement.children().eq(this.manager["activatingIndex"]).attr("class", "one");
			this.manager["activatingIndex"] = parseInt(index);
			thumbShowElement.children().eq(this.manager["activatingIndex"]).attr("class", "one activating");
			
		}
	}

	if(typeof this.displayFullShow != "function"){
		PhotoDisplayManager.prototype.displayFullShow = function(fullShowElement, index){
			var target = this.manager["photos"][index],
				url = this.manager["outsideChain"] + target["path"] + target["name"] + "_low.jpg"
			;
			fullShowElement.children("img").attr({
				"src": url,
				"alt": target["name"]
			});
			
		}
	}

	if(typeof this.addThumbPhotoAction != "function"){
		PhotoDisplayManager.prototype.addThumbPhotoAction = function(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight){
			var that = this;
			thumbShowElement.on("click", ".one", function(){
				var targetIndex = $(this).attr("data-index");
				that.changeActivatingIndex(thumbShowElement, targetIndex);
				that.displayFullShow(fullShowElement, targetIndex);
				targetIndex = null;
				that.checkArrowStatus(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
			});

		}
	}



	if(typeof this.addFullPhotoAction != "function"){
		PhotoDisplayManager.prototype.addFullPhotoAction = function(fullShowElement, fullShowrelatedElement){
			fullShowElement.on("click", "img", function(){
				var url = $(this).attr("src").split("_")[0] + ".jpg";
				fullShowrelatedElement.css("display", "flex");
				fullShowrelatedElement.children("img").attr("src", url);
				
			})
			fullShowrelatedElement.on("click", ".mask", function(){
				fullShowrelatedElement.children("img").attr("src", "");
				fullShowrelatedElement.css("display", "none");
			})
			fullShowrelatedElement.on("click", ".leave", function(){
				fullShowrelatedElement.children("img").attr("src", "");
				fullShowrelatedElement.css("display", "none");
			})

		}
	}

	if(typeof this.addArrowAction != "function"){
		PhotoDisplayManager.prototype.addArrowAction = function(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight){
			var that = this;
			thumbArrowLeft.on("click",function(){
				if (that.manager["status"]["hiddenHead"].length != 0){
					that.hideOneThumb(thumbShowElement, "seeMoreLeft");
					that.showEnoughThumb(thumbShowElement, "seeMoreLeft");
					that.checkArrowStatus(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
				}
				
			})
			thumbArrowRight.on("click",function(){
				if (that.manager["status"]["displayNormal"][that.manager["status"]["displayNormal"].length-1] != that.manager["photosCount"]-1){
					that.hideOneThumb(thumbShowElement, "seeMoreRight");
					that.showEnoughThumb(thumbShowElement, "seeMoreRight");
					that.checkArrowStatus(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
				}
			})
			fullArrowLeft.on("click",function(){
				if (that.manager["activatingIndex"] != 0){
					var targetIndex = that.manager["activatingIndex"]-1,
						displayNormalArray = that.manager["status"]["displayNormal"],
						times = 0,
						dir,
						leftSubTarget = displayNormalArray[0] - targetIndex
					;
					if (leftSubTarget > 0){
						times = leftSubTarget;
						dir = "seeMoreLeft";
					} else {
						var rightSubTarget = displayNormalArray[displayNormalArray.length-1] - targetIndex;
						if (rightSubTarget < 0){
							times = -rightSubTarget;
							dir = "seeMoreRight";
						}
						rightSubTarget = null;
					}
					while(times != 0){
						that.hideOneThumb(thumbShowElement, dir);
						that.showEnoughThumb(thumbShowElement, dir);
						--times;
					}
					that.changeActivatingIndex(thumbShowElement, targetIndex);
					that.displayFullShow(fullShowElement, that.manager["activatingIndex"]);
					targetIndex = 
					displayNormalArray = 
					flag = 
					times = 
					dir = null;
					that.checkArrowStatus(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
				}
			})
			fullArrowRight.on("click",function(){
				if (that.manager["activatingIndex"] != that.manager["photosCount"]-1){
					var targetIndex = that.manager["activatingIndex"] + 1,
						displayNormalArray = that.manager["status"]["displayNormal"],
						times = 0,
						dir,
						leftSubTarget = displayNormalArray[0] - targetIndex
					;
					if (leftSubTarget > 0){
						times = leftSubTarget;
						dir = "seeMoreLeft";
					} else {
						var rightSubTarget = displayNormalArray[displayNormalArray.length-1] - targetIndex;
						if (rightSubTarget < 0){
							times = -rightSubTarget;
							dir = "seeMoreRight";
						}
						rightSubTarget = null;
					}
					while(times != 0){
						that.hideOneThumb(thumbShowElement, dir);
						that.showEnoughThumb(thumbShowElement, dir);
						--times;
					}
					that.changeActivatingIndex(thumbShowElement, targetIndex);
					that.displayFullShow(fullShowElement, that.manager["activatingIndex"]);
					targetIndex = 
					displayNormalArray = 
					flag = 
					times = 
					dir = null;
					that.checkArrowStatus(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
				}
			})
		}
	}

	if(typeof this.checkArrowStatus != "function"){
		PhotoDisplayManager.prototype.checkArrowStatus = function(thumbShowElement, fullShowElement, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight){
			if(this.manager["status"]["hiddenHead"].length == 0){

				thumbArrowLeft.children(".normal").css("display", "none");
				thumbArrowLeft.children(".stop").css("display", "inline");
			} else {
				thumbArrowLeft.children(".normal").css("display", "inline");
				thumbArrowLeft.children(".stop").css("display", "none");
			}


			if (this.manager["status"]["displayNormal"][this.manager["status"]["displayNormal"].length-1] == this.manager["photosCount"]-1){
				thumbArrowRight.children(".normal").css("display", "none");
				thumbArrowRight.children(".stop").css("display", "inline");
			} else {
				thumbArrowRight.children(".normal").css("display", "inline");
				thumbArrowRight.children(".stop").css("display", "none");
			}

			if (this.manager["activatingIndex"] == 0){
				fullArrowLeft.children(".normal").css("display", "none");
				fullArrowLeft.children(".stop").css("display", "inline");
			} else {
				fullArrowLeft.children(".normal").css("display", "inline");
				fullArrowLeft.children(".stop").css("display", "none");
			}

			if (this.manager["activatingIndex"] == this.manager["photosCount"]-1){
				fullArrowRight.children(".normal").css("display", "none");
				fullArrowRight.children(".stop").css("display", "inline");
			} else {
				fullArrowRight.children(".normal").css("display", "inline");
				fullArrowRight.children(".stop").css("display", "none");
			}
		}
	}



}


$(document).ready(function(){
	var thumbShow = $(".thumb").find(".show"),
		fullShow = $(".full").find(".show"),
		fullShowRelated = $(".forDisplayOriginalPhoto"),
		thumbArrowLeft = $(".thumb").find(".arrow-left"),
		thumbArrowRight = $(".thumb").find(".arrow-right"),
		fullArrowLeft = $(".full").find(".arrow-left"),
		fullArrowRight = $(".full").find(".arrow-right"),
		photoDisplayManager = new PhotoDisplayManager()
	;

	photoDisplayManager.installJsonp("photosData.json");
	photoDisplayManager.parseJsonpData("rewrite");
	photoDisplayManager.uninstallJsonp();
	photoDisplayManager.updateThumbAvailableWidth(thumbShow);
	photoDisplayManager.showEnoughThumb(thumbShow, "seeMoreRight");
	photoDisplayManager.changeActivatingIndex(thumbShow, 0);
	photoDisplayManager.displayFullShow(fullShow, 0);
	photoDisplayManager.addThumbPhotoAction(thumbShow, fullShow, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);
	photoDisplayManager.addFullPhotoAction(fullShow, fullShowRelated);
	photoDisplayManager.addArrowAction(thumbShow, fullShow, thumbArrowLeft, thumbArrowRight, fullArrowLeft, fullArrowRight);

});