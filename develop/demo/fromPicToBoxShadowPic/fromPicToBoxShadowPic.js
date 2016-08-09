var EventUtil={
	
	addHandler: function(element, type, handler){ 
		if (element.addEventListener){ 
			element.addEventListener(type,handler,false);  
		} else if (element.attachEvent){                    
			element.attachEvent("on"+type,handler);
		} else {
			element["on"+type]=handler;          
		}
	}
		
};

function FromPicToBoxShadowPic(){
	this.manager = {
		"before": {
			"width": 0,
			"height": 0
		},
		"after": {
			"sideLength": 0,
			"width": 0,
			"height": 0,
			"imageData": [],
			"boxShadowString": ""
		},
		"outsideChain": "../../",
		"path": "lib/pic/demo/fromPicToBoxShadowPic/"
	}

	if (typeof this.getBeforeData != "function"){
		FromPicToBoxShadowPic.prototype.getBeforeData = function(beforeElement){
			this.manager.before.width = beforeElement.width;
			this.manager.before.height = beforeElement.height;
		}
	}

	if (typeof this.getUserSettingData != "function"){
		FromPicToBoxShadowPic.prototype.getUserSettingData = function(sideLength, width, height){
			this.manager.after.sideLength = sideLength;
			this.manager.after.width = width;
			this.manager.after.height = height;

		}
	}

	if (typeof this.calAfterImageData != "function"){
		FromPicToBoxShadowPic.prototype.calAfterImageData = function(beforeElement){
			var drawing = document.createElement("canvas");
			drawing.width = this.manager.after.width;
			drawing.height = this.manager.after.height;
			var context = drawing.getContext("2d"),
				swidth = this.manager.before.width,
				sheight = this.manager.before.height,
				dwidth = this.manager.after.width,
				dheight = this.manager.after.height
			;
			context.drawImage(beforeElement, 0, 0, swidth, sheight, 0, 0, dwidth, dheight);
			this.manager.after.imageData = context.getImageData(0, 0, dwidth, dheight);
			drawing =
			context = 
			swidth = 
			sheight = 
			dwidth = 
			dheight = null;
		}
	}

	if (typeof this.calBoxShadowString != "function"){
		FromPicToBoxShadowPic.prototype.calBoxShadowString = function(){
			var str = "",
				data = this.manager.after.imageData.data
			;
			for (var i = 0, len = data.length; i < len; i += 4){
				var col = Math.floor(i / 4 / this.manager.after.width),
					row = i / 4 % this.manager.after.width + 1,
					color = "rgba(" + data[i] + ", " + data[i+1] + ", " + data[i+2] + ", " + data[i+3] +")"
				;
				str += " " + row + "em " + col + "em " + color + ",";
			}
			this.manager.after.boxShadowString = str.substr(1, str.length -2);
			data = 
			str = null;
		}
	}

	if (typeof this.paint != "function"){
		FromPicToBoxShadowPic.prototype.paint = function(afterElement){
			afterElement.parentNode.style.fontSize = this.manager.after.sideLength + "px";
			afterElement.style.boxShadow = this.manager.after.boxShadowString; 	
		}
	}

	if (typeof this.setParentSize != "function"){
		FromPicToBoxShadowPic.prototype.setParentSize = function(afterElement){
			afterElement.parentNode.style.width = this.manager.after.width * this.manager.after.sideLength + "px";
			afterElement.parentNode.style.height = this.manager.after.height * this.manager.after.sideLength + "px";
		}
	}

	if (typeof this.getScaleValue != "function"){
		FromPicToBoxShadowPic.prototype.getScaleValue = function(knownCondition, knownValue){
			var scale = this.manager.before.width / this.manager.before.height;
			return knownCondition == "width" ? knownValue/scale : knownValue*scale;
		}
	}


}



window.onload = function(){

	
	var fromPicToBoxShadowPic = new FromPicToBoxShadowPic(),
		before = document.getElementById("before"),
		setting_beforeWidth = document.getElementById("beforeWidth"),
		setting_beforeHeight = document.getElementById("beforeHeight"),
		after = document.getElementById("after"),
		setting_afterWidth = document.getElementById("afterWidth"),
		setting_afterHeight = document.getElementById("afterHeight"),
		setting_selectPic = document.getElementById("selectPic"),
		submit = document.getElementById("submit"),
		settingIco = document.getElementsByClassName("settingIco")[0],
		setting = document.getElementsByClassName("setting")[0]
	;

	fromPicToBoxShadowPic.getBeforeData(before);
	setting_beforeWidth.innerText = fromPicToBoxShadowPic.manager.before.width;
	setting_beforeHeight.innerText = fromPicToBoxShadowPic.manager.before.height;
	afterHeight.value = parseInt(fromPicToBoxShadowPic.getScaleValue("width", setting_afterWidth.value));

	EventUtil.addHandler(setting_selectPic, "change", function(){
		//var url = fromPicToBoxShadowPic.manager.outsideChain + fromPicToBoxShadowPic.manager.path + setting_selectPic.value + ".png";
		var url = setting_selectPic.value;
		before.src = url;
		before.onload = function(){
			document.getElementById("displayImage").src = url;
			fromPicToBoxShadowPic.getBeforeData(before);
			setting_beforeWidth.innerText = fromPicToBoxShadowPic.manager.before.width;
			setting_beforeHeight.innerText = fromPicToBoxShadowPic.manager.before.height;
			afterHeight.value = parseInt(fromPicToBoxShadowPic.getScaleValue("width", setting_afterWidth.value));
		}
	})

	EventUtil.addHandler(submit, "click", function(){
		setting.style.display = "none";
		fromPicToBoxShadowPic.getUserSettingData(document.getElementById("afterSideLength").value, setting_afterWidth.value, setting_afterHeight.value);
		fromPicToBoxShadowPic.calAfterImageData(before);
		fromPicToBoxShadowPic.calBoxShadowString();
		fromPicToBoxShadowPic.paint(after);
		fromPicToBoxShadowPic.setParentSize(after);

	})

	EventUtil.addHandler(setting_afterWidth, "focusout", function(){
		if (document.getElementById("scale").checked == true){
			afterHeight.value = parseInt(fromPicToBoxShadowPic.getScaleValue("width", setting_afterWidth.value));
		}
		
	})

	EventUtil.addHandler(setting_afterHeight, "focusout", function(){
		if (document.getElementById("scale").checked == true){
			setting_afterWidth.value = parseInt(fromPicToBoxShadowPic.getScaleValue("height", setting_afterHeight.value));
		}
	})

	EventUtil.addHandler(settingIco, "click", function(){
		setting.style.display = "block";
	})





	
	

}






