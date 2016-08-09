function RandomCorlorBox(){
	this.manager={
		"doc": {
			"width": 0,
			"height": 0
		},
		"box": {
			"width": 30,
			"height": 30,
			"margin": 5
		},
		"boxs": {
			"count": 0,
			"row": 0,
			"col": 0
		},
		"container": {
			"width": 0,
			"height": 0
		},
		"emphalize": {
			"A": {
				"scale": 1.5,
				"opacity": 1
			},
			"B": {
				"scale": 1.3,
				"opacity": 0.9
			},
			"C": {
				"scale": 1.1,
				"opacity": 0.8
			}
		},
		"userData": {
			"kind": sessionStorage.getItem("mode") || "less",
			"mode": sessionStorage.getItem("mode") || "color",
			"opacity": sessionStorage.getItem("opacity") || 0.1
		}
	};

	if(typeof this.updateDocData != "function"){
		RandomCorlorBox.prototype.updateDocData = function(){
			this.manager.doc.width = $(document).width();
			this.manager.doc.height = $(document).height();
		}
	}

	if(typeof this.updateBoxsData != "function"){
		RandomCorlorBox.prototype.updateBoxsData = function(){
			var doc = this.manager.doc,
				box = this.manager.box,
				boxs = this.manager.boxs
			;
			boxs.row = Math.floor((doc.height - box.margin) / (box.height + box.margin * 2));
			boxs.col = Math.floor((doc.width - box.margin) / (box.width + box.margin  * 2));
			boxs.count = boxs.row * boxs.col;
			doc = 
			box = 
			boxs = null;
		}
	}

	if(typeof this.updateContainerData != "function"){
		RandomCorlorBox.prototype.updateContainerData = function(){
			var box = this.manager.box,
				boxs = this.manager.boxs,
				container = this.manager.container
			;
			container.width = boxs.col * (box.width + box.margin * 2);
			container.height = boxs.row * (box.height + box.margin * 2);
			box =
			boxs =
			container = null;
		}
	}



	if(typeof this.getRandomColor != "function"){
		RandomCorlorBox.prototype.getRandomColor = function(kind, mode){
			var color = "";
			switch(kind){	
				case "more":
					var count = 6,
						colorArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
					;
					do{
						var colorIndex = Math.floor(Math.random() * 15);
						switch(mode){
							case "gray":
								color += colorArray[colorIndex];
								if(count == 5){
									color = color + color + color;
									count = 1;
								}
								break;
							case "color":
								color += colorArray[colorIndex];
								if((count ==1) && (color[0] == color[2] == color [4]) && (color[1] == color[3] == color [5])){
									color = "";
									count = 6;
								}
								break;
							default:
						}
					} while (--count > 0);
					color = "#" + color;
					colorArray = null;
					break;
				case "less":
					switch(mode){
						case "gray":
							color = "hsl(0, 100%," + Math.floor(Math.random()*2) + "00%)";
							break;
						case "color":
							color = "hsl(" + Math.floor(Math.random() * 360) + ",80%,50%)";
							break;
						default:
					}
				break;
				default:
			}
			return color;
			
		}
	}

	if(typeof this.createBox != "function"){
		RandomCorlorBox.prototype.createBox = function(kind, mode){
			var box = this.manager.box,
				single = $("<div></div>")
			;
			single.css({
				"width": box.width,
				"height": box.height,
				"margin": box.margin,
				"float": "left",
				"background-color": this.getRandomColor(kind, mode)
			})
			box = null;
			return single;
		}
	}

	if(typeof this.createBoxs != "function"){
		RandomCorlorBox.prototype.createBoxs = function(containerElement){
			var row = this.manager.boxs.row,
				col = this.manager.boxs.col,
				kind = this.manager.userData.kind,
				mode = this.manager.userData.mode
			;
			for (var i = 0; i < row ; i++){
				for (var j = 0; j < col; j++){
					var single = this.createBox(kind, mode);
					single.attr("data-row", i);
					single.attr("data-col", j);
					containerElement.append(single);
					single = null;
				}
			}
		}
	}	

	if(typeof this.centerContainer != "function"){
		RandomCorlorBox.prototype.centerContainer = function(containerElement){
			containerElement.css("width", this.manager.container.width + "px");
			containerElement.css("height", this.manager.container.height + "px");
		}
	}	

	if(typeof this.clearCenterContainer != "function"){
		RandomCorlorBox.prototype.clearCenterContainer = function(containerElement){
			containerElement.css("width", "");
			containerElement.css("height", "");
		}
	}	

	if(typeof this.calElementIndex != "function"){
		RandomCorlorBox.prototype.calElementIndex = function(col, elementRow, elementCol){
			return elementRow * col + elementCol ;
		}
	}

	if(typeof this.getAroundArea != "function"){
		RandomCorlorBox.prototype.getAroundArea = function(element){
			var area ={
				"A": [],
				"B": [],
				"C": []
			},
				row = this.manager.boxs.row,
				col = this.manager.boxs.col,
				elementRow = parseInt(element.attr("data-row")),
				elementCol = parseInt(element.attr("data-col")),
				leftTop = 
				leftBottom = 
				rightTop = 
				rightBottom = 1
			;
			area.A.push(this.calElementIndex(col, elementRow, elementCol));

			if (elementRow - 2 > -1){
				area.C.push(this.calElementIndex(col, elementRow-2, elementCol));
			}
			if (elementRow - 1 > -1){
				area.B.push(this.calElementIndex(col, elementRow-1, elementCol));
			} else {
				leftTop = leftTop && 0;
				rightTop = rightTop && 0;
			}
			if (elementRow + 1 < row){
				area.B.push(this.calElementIndex(col, elementRow+1, elementCol));
			} else {
				leftBottom = leftBottom && 0;
				rightBottom = rightBottom && 0;
			}
			if (elementRow + 2 < row){
				area.C.push(this.calElementIndex(col, elementRow+2, elementCol));
			}

			if (elementCol - 2 > -1){
				area.C.push(this.calElementIndex(col, elementRow, elementCol-2));
			}
			if (elementCol - 1 > -1){
				area.B.push(this.calElementIndex(col, elementRow, elementCol-1));
			} else {
				leftTop = leftTop && 0;
				leftBottom = leftBottom && 0;
			}
			if (elementCol + 1 < col){
				area.B.push(this.calElementIndex(col, elementRow, elementCol+1));
			} else {
				rightTop = rightTop && 0;
				rightBottom = rightBottom && 0;
			}
			if (elementCol + 2 < col){
				area.C.push(this.calElementIndex(col, elementRow, elementCol+2));
			}

			if(leftTop == 1){
				area.B.push(this.calElementIndex(col, elementRow-1, elementCol-1));
			}
			if(rightTop == 1){
				area.B.push(this.calElementIndex(col, elementRow-1, elementCol+1));
			}
			if(leftBottom == 1){
				area.B.push(this.calElementIndex(col, elementRow+1, elementCol-1));
			}
			if(rightBottom == 1){
				area.B.push(this.calElementIndex(col, elementRow+1, elementCol+1));
			}
			row = 
			col = 
			elementRow = 
			elementCol = 
			leftTop = 
			leftBottom = 
			rightTop = 
			rightBottom = null;
			return area;
		}
	}

	if(typeof this.emphalizeArea != "function"){
		RandomCorlorBox.prototype.emphalizeArea = function(containerElement, area){
			for (var i in area){
				for (var j in area[i]){
					var index = area[i][j],
						scale = "scale(" + this.manager.emphalize[i]["scale"] +  ")",
						opacity = this.manager.emphalize[i]["opacity"]
					;
					containerElement.children().eq(index).css({
						"transform": scale,
						"opacity": opacity
					});
					index = 
					scale = 
					opacity = null;
				}
			}
		}
	}

	if(typeof this.clearEmphalizeArea != "function"){
		RandomCorlorBox.prototype.clearEmphalizeArea = function(containerElement){
			var that = this;
			containerElement.children("div").each(function(){
				$(this).css({
					"transform": "scale(1,1)",
					"opacity": that.manager.userData.opacity
				});
			})
		}
	}


	if(typeof this.addBoxsAction != "function"){
		RandomCorlorBox.prototype.addBoxsAction = function(containerElement){
			var that = this;
			containerElement.on("mouseover", "div", function(){
				var area = that.getAroundArea($(this));
				that.emphalizeArea(containerElement, area);
			})
			containerElement.on("mouseout", "div", function(){
				that.clearEmphalizeArea(containerElement);
			})
		}
	}

	if(typeof this.getUserData != "function"){
		RandomCorlorBox.prototype.getUserData = function(containerElement){
			if (sessionStorage.getItem("kind")){
				this.manager.userData.kind = sessionStorage.getItem("kind");
				this.manager.userData.mode = sessionStorage.getItem("mode");
				var opacity = parseFloat(sessionStorage.getItem("opacity"));
				this.manager.userData.opacity = (opacity >= 0 && opacity <=1) ? opacity : (opacity < 0 ? 0 : 1);
			}
		}
	}
	if(typeof this.setUserData != "function"){
		RandomCorlorBox.prototype.setUserData = function(settingElement, containerElement){
			sessionStorage.setItem("kind", settingElement.find("#kind").val());
			sessionStorage.setItem("mode", settingElement.find("#mode").val());
			sessionStorage.setItem("opacity", settingElement.find("#opacity").val());
	
		}
	}
	if(typeof this.addSettingAction != "function"){
		RandomCorlorBox.prototype.addSettingAction = function(settingIcoElement, settingElement){
			var that = this;
			settingIcoElement.on("click", function(){
				settingElement.css("display","block");
			})

			settingElement.find("#submit").on("click", function(){
				that.setUserData(settingElement);
				settingElement.css("display","none");
				location.reload();

			})
			
		}
	}
	if(typeof this.updateOpacity != "function"){
		RandomCorlorBox.prototype.updateOpacity = function(containerElement){
			var that = this;
			containerElement.children("div").each(function(){
				console.log
				$(this).css("opacity", that.manager.userData.opacity);
			})
		}
	}




}

$(document).ready(function(){
	var container = $(".container"),
		randomColorBox = new RandomCorlorBox(),
		setting = $(".setting"),
		settingIco = $(".settingIco")
	;
	randomColorBox.getUserData(container);
	randomColorBox.updateDocData();
	randomColorBox.updateBoxsData();
	randomColorBox.updateContainerData();
	randomColorBox.createBoxs(container);
	randomColorBox.centerContainer(container);
	randomColorBox.updateOpacity(container);
	randomColorBox.addBoxsAction(container);
	randomColorBox.addSettingAction(settingIco, setting);



})

