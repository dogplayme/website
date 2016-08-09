function ArticleManager(){
	this.catalogJson = [];



	if(typeof this.getCatalog != "function"){
		ArticleManager.prototype.getCatalog = function(articleElement){
			var that = this;
			articleElement.children().each(function(){
				var name = $(this)[0].nodeName.toLowerCase(),
					object = {},
					flag = 0
				;
				switch(name){
					case "h4":
						object.className = "level1";
						flag = 1;
						break;
					case "h5":
						object.className = "level2";
						flag = 1;
						break;
					case "h6":
						object.className = "level3";
						flag = 1;
						break;
					default:
				}
				if (flag == 1){
					object.text = $(this).text();
					object.offset = $(this).offset();
					that.catalogJson.push(object);
				}
				name = 
				object = 
				flag = null;
			});
		}
	}

	if(typeof this.writeCatalog != "function"){
		ArticleManager.prototype.writeCatalog = function(catalogElement){
			catalogElement.children("ul").empty();
			for(var i in this.catalogJson){
				var list = $("<li></li>");
				list.attr("class", this.catalogJson[i].className);
				list.attr("data-index", i);
				list.text(this.catalogJson[i].text);
				catalogElement.children("ul").append(list);
				list = null;
			}
		}
	}
/*
	if(typeof this.oldaddScrollEvent != "function"){
		ArticleManager.prototype.oldaddScrollEvent = function(catalogElement){
			var oldMarginTop = parseFloat(catalogElement.parent().css("margin-top")),
				documentHeight = $(document).height(),
				windowHeight = $(window).height()
			;

			$(document).scroll(function(){
				var additionalMarginTop = $(this).scrollTop(),
					newMarginTop = additionalMarginTop + oldMarginTop
				;
				catalogElement.parent().css("margin-top", newMarginTop+"px");
				console.log(documentHeight);
				console.log(windowHeight);
				if ($(document).scrollTop() > documentHeight-windowHeight){
					console.log("a");
				}
			})
		}
	}
	*/
	if(typeof this.updateCatalogArticlePosition != "function"){
		ArticleManager.prototype.updateCatalogArticlePosition = function(catalogElement, articleElement){
			if ($(window).width() >= 1000){
				var extraHalf = $(window).width() / 2 - 500;
				catalogElement.css({
					"display": "block",
					"left": extraHalf + "px"
				});
				articleElement.css({
					"margin-left": extraHalf + 280 + "px",
					"margin-right": 0
				});
				extraHalf = null;
			} else {
				catalogElement.css({
					"display": "none",
					"left": 0
				});
				articleElement.css({
					"margin-left": "auto",
					"margin-right": "auto"
				});
			}
		}
	}

	if(typeof this.addCatalogAction != "function"){
		ArticleManager.prototype.addCatalogAction = function(catalogElement){
			var that = this;
			$(document).scroll(function(){
				for (var i in that.catalogJson){
					if ($(document).scrollTop() > that.catalogJson[i].offset.top-60){
						catalogElement.children("ul").children().each(function(){
							$(this).removeClass("current");
						})
						catalogElement.children("ul").children().eq(i).addClass("current");
					}
				}
			})

			catalogElement.children("ul").on("click", "li", function(){
				var targetIndex = $(this).attr("data-index"),
					targetPosition = that.catalogJson[targetIndex].offset.top-60+1
				;
				$(document).scrollTop(targetPosition);
				targetIndex = targetPosition = null;
			} )

		}
	}


	if(typeof this.isCatalogExist != "function"){
		ArticleManager.prototype.isCatalogExist = function(catalogElement){
			if (catalogElement.css("display") == "block"){
				return true;
			} else {
				return false;
			}
		}
	}


};






$(document).ready(function(){
	var article = $("article"),
		catalog = $(".catalog"),
		articleManager = new ArticleManager()
	;
	articleManager.updateCatalogArticlePosition(catalog, article);
	articleManager.getCatalog(article);
	if (articleManager.isCatalogExist(catalog)){
		articleManager.writeCatalog(catalog);
		articleManager.addCatalogAction(catalog);		
	}

	$(window).resize(function(){
		articleManager.updateCatalogArticlePosition(catalog, article);
	})
	
})