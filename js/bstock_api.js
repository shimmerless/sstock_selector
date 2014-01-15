var account_id = '304133';
var selected_category, search_term, infinite_scroll, page, jsonp_happening;

$(document).ready(function() {

	// pop cats

	$.getJSON("http://api.bigstockphoto.com/2/"+account_id+"/categories/?callback=?", function(data){

        if(data && data.data) {

            $.each(data.data, function(i, v){      

				if(v.name == "Sexual") {

					return;

				}

            	$("#search-cat").append("<input type='radio' name='radio-cat' id='"+v.name+"' /><label for='"+v.name+"''><span></span>"+v.name+"</label><br />");

           	});

        }

    });

    // when cat is clicked


    $("#search-cat").on("click", "input", function(e){

        selected_category = $(this).attr('id');

        $("#search-form").trigger("submit", { category:true });

    });

    //show a loading message when the search button is clicked

    $("html").on("submit", "#search-form", function(e, val){

        page = 1;

        var results = $("#results-hold");

        results.html("");

        results.append("<li id=\"loading\"><span class=\"label\">Loading...</span></li>");

        var val = val || {};

        //check if the user selected a category or did a keyword search

        if (val.category) {

            search_term = "";

        } else {

            selected_category = "";

            search_term = $("#search-text").val();

        }

        //start the search

        $("html").trigger("bigstock_search", { q: search_term, category:selected_category });

        e.preventDefault();

    });

    //infinite scroll

    infinite_scroll = setInterval(function(){

        var offset = $("#results-hold li:last").offset();

        if(offset && offset.top < 1000 && !jsonp_happening && $("#search-results").is(":visible")) { 

            page++;

            $("html").trigger("bigstock_search", { q: search_term, category:selected_category, page:page })
        }

    }, 100);

    //populate the search results

	$("html").on("bigstock_search", function(e, val){

	    if(!jsonp_happening) {

	        jsonp_happening = true;

	        var val = val || {};

	        val.page = val.page || 1;

	        var results = $("#results-hold");

	        //setup the paramaters for the JSONP request

	        var params = {};

	        if(val.category != "") params.category = val.category;

	        params.q = val.q;

	        params.page = val.page;

	        $.getJSON("http://api.bigstockphoto.com/2/"+account_id+"/search/?callback=?", params, function(data){

	            results.find("#loading").remove();

	            results.find("#oops").remove();
	            
	            if(data && data.data && data.data.images) {

	                var template = $(".item-template");

	                $.each(data.data.images, function(i, v){

	                    template.find("img").attr("src",v.small_thumb.url);

	                    template.find("a").attr("href","#"+v.id);

	                    results.append(template.html())

	                });

	            } else {

	            	results.append("<li id=\"oops\"><div class=\"alert alert-error\">OOOPS! We found no results. Please try another search.</div></li>");            
	            }

	            jsonp_happening = false;

	        });

	    }

	});

	//when a user clicks on a thumbnail

	$("#results-hold").on("click", "a", function(e){

			$('#overlay').show();
			$('#overlay').fadeTo("fast", 0.2);
			$('#editing-template').show();
			$('#editing-template').fadeTo("fast", 1);

    		$.getJSON("http://api.bigstockphoto.com/2/"+account_id+"/image/"+$(this).attr("href").substring(1)+"/?callback=?", function(data) {

    		    if(data && data.data && data.data.image) {

           		 var detail_template = $(".detail-template");

           		 detail_template.find("img").attr("src",data.data.image.preview.url);

           		 detail_template.find("h3").html(data.data.image.title);

           		 $(".detail-template").modal({backdrop:false});

           		 e.preventDefault();  
       		}

  		});

	});

	$('#overlay').on("click", function() {

		$('#overlay').fadeTo("fast", 0, function() {

			$('#overlay').hide();

		});

		$('#editing-template').fadeTo("fast", 0, function() {

			$('#editing-template').hide();
			
		});

	});

});