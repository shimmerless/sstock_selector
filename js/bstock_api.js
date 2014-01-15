var acc_id = '304133';
var selected_category, search_term, infinite_scroll, page, jsonp_happening;

$(document).ready(function() {

$.getJSON("http://api.bigstockphoto.com/2/"+acc_id+"/categories/?callback=?", function(data){
        if(data && data.data) {
            $.each(data.data, function(i, v){      
				if(v.name == "Sexual") { return; }
                $("#search-cat").append("<input type='radio' name='radio-cat' id='"+v.name+"' /><label for='"+v.name+"''><span></span>"+v.name+"</label><br />");
            });
        }
});

}