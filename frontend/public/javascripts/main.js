// var serverAddress = 'http://'+$(location).attr('host')+":443";
var serverAddress = 'http://cloud-31.skelabb.ltu.se:443';

var user = {
	logged:false,
}

function loadContent(content, callback){
    //Load the template for the current content
    $.get('templates/'+content+'.hgn', function(template) {
        var rendered = Mustache.render(template, {logged: user.logged});
        $('#page').html(rendered).trigger('changePage').slideToggle('fast');
        //Load the .js for the current content 
        $.get('javascripts/pages/'+content+'.js', null);      
    }).fail(function() {
        $.address.value('404');
    })  

    if (callback != undefined) callback();  
}

function loadHeaderMenu(data, callback){
    var smallphone = $( window ).width() <= 360 ? true : false;
    var phone = $( window ).width() <= 750 && !smallphone ? true : false;

    //Display header
    $.get('templates/header.hgn', function(template){
        $('header').html(Mustache.render(template, {logged: user.logged, login:user.login, snd_bttn: !(smallphone||phone), fst_bttn: !smallphone}));
    });

    //Display menu
    $.get('templates/menu.hgn', function(template){
        $('#menu').html(Mustache.render(template, {logged: user.logged, login:user.login, snd_bttn: (smallphone||phone), fst_bttn: smallphone}));
        //load the menu.js
        $.get('javascripts/pages/menu.js', null);
    }); 
    if (callback != undefined) callback();
}

function link(link){
    // Follow the link only if it's 'new'
    if($(location).attr('hash').substring(2) != link){
        $( "#close_menu" ).trigger( "click" );
        $('#page').slideToggle('fast', function(){                
            $.address.value(link);         
        }); 
    }
}

$( document ).ready(function() {	
	userFromLocal = JSON.parse(localStorage.getItem("user"));
	if(userFromLocal != null) user = userFromLocal;

	if($(location).attr('hash') == "" ){$.address.value('home');} 

    loadHeaderMenu(null, function(){});

    $.address.change(function (event) {
        $("#page").css('display', 'none');
        loadContent(event.value.substring(1), function(){});
    });

    $( window ).resize(function() {
        loadHeaderMenu(null, function(){});
    });

    $('body').hammer().bind("swiperight", function(ev) {
        $('#open_menu').trigger('click');
    });
    $('body').hammer().bind("swipeleft", function(ev) {
        $('#close_menu').trigger('click');
    });

    initDialog();

});

////////////////////////////////////////////////////////////////////////// 
//                                                                      //
//      FUNCTIONS FOR EVERYWHERE (YEAH VERY PRECISE :p)                 //
//                                                                      //
////////////////////////////////////////////////////////////////////////// 

// REGEX TESTS
function isAlphaNumeric(string){
    var patt = /^[a-z0-9]+$/i;
    return patt.test(string);
}

function isInRange(nb,min,max){
    return ($.isNumeric(nb) && nb <= max && nb >= min);
}

function isEmail(string){
    var patt = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
    return patt.test(string);
}

function isGoodPassword(string){
    var longenought = string.length >= 6;
    var onlyletters = /^[A-Z]+$/i;
    var onlydigits = /^[0-9]+$/i;
    return (longenought && !onlyletters.test(string) && !onlydigits.test(string));
}

// FORM FUNCTIONS
function appendErrorbox(elem, text){
    if(elem.next().hasClass('form_errorbox'))
        removeErrorbox(elem);
    if(elem.next().hasClass('form_infobox'))
        removeInfobox(elem);

    elem.after('<div class="form_errorbox"  style="display:none;">'+text+'</div>');
    elem.next().slideToggle('fast');
    elem.addClass('wrong');
}

function removeErrorbox(elem){
    if(elem.next().hasClass('form_errorbox')){
        elem.next().remove();
        elem.removeClass('wrong');        
    }
}

function pseudoCheck(event){
    if(this.value.length ==0)
        appendErrorbox($(this), 'Pseudo empty');    
    else if(!isAlphaNumeric(this.value))
        appendErrorbox($(this), 'Pseudo must not contains special signs');
    else if(this.value.length < 4)
        appendErrorbox($(this), 'Pseudo must be at least 4 caracters long');
    else if(this.value.length > 12)
        appendErrorbox($(this), 'Pseudo must be less than 12 caracters long');
    else if(this.value.length >= 4 && this.value.length <= 12)
        removeErrorbox($(this));
}

function emailCheck(event){
    if(this.value.length ==0)
        appendErrorbox($(this), 'Email empty');
    else if(!isEmail(this.value))
        appendErrorbox($(this), 'Incorrect email');
    else
        removeErrorbox($(this));
}

function passwordCheck(event){
    if(this.value.length ==0)
        appendErrorbox($(this), 'Password empty');
    else if(!isGoodPassword(this.value))
        appendErrorbox($(this), 'Password must contains letters and digits and be at least 6 caracters long');
    else
        removeErrorbox($(this));
}

function confPasswordCheck(event){  
    if(this.value.length ==0)
        appendErrorbox($(this), 'Password confirmation empty');  
    else if($('#pwd').val() == this.value)
        removeErrorbox($(this));
    else
        appendErrorbox($(this), 'Password confirmation does not match the password');
}

// DIALOG
var callback = function(){};

function initDialog(){
    $("#dialog_container, #dialog span.button_light").click(function(event) {
        closeDialog();
    });
    $("#dialog").click(function(event) {
        event.stopPropagation();
    });
}

function openDialog(title,message,validation,clbck){
    callback = clbck;
    if(title=='')
        $("#dialog h1").css('display', 'none');
    else
        $("#dialog h1").html(title).css('display', 'initial');

    $("#dialog p").html(message);
    $("#dialog #dialogSubmit").html(validation);
    $("#dialog_container").css({
        display: 'flex',
        opacity: '0'
    });
    $("#dialog_container").animate({opacity:1}, 'fast');
}

function closeDialog(){
    $("#dialog_container").animate({opacity: 0}, 'fast', function(){
        $("#dialog_container").css('display', 'none');    
        callback();
        callback = function(){}; //if the function is called a second time, not 2 callbacks    
    });
}

function openDialogImg(link){
    var openNewTab= "<span class='openNewTab'>OPEN IN NEW TAB</span>";
    var trashIcon = "<span class='deleteCross'><img src='images/ic_delete_black_18dp.png' alt='X' onClick=\"deletePhoto('"+link+"',null)\"/></span>"
    var content = "<div class='mapImg' ><img src='"+link+"' onClick=\"window.open('"+link+"','_blank')\"/>"+openNewTab+trashIcon+"</div>";
    openDialog('', content, 'close', function(){});
}

// GPS
function DMSToAbsolute(D, M, S, NSWE){
    var sign = 1;
    if(NSWE == 'W' || NSWE == 'S')
        sign = -1;

    return sign*(Number(D)+Number(M)/60+Number(S)/3600);                
}

// PICTURES
function addPreview(src, id, lat, lon){
    var tip = $('#tip');
    var image = src.replace('_min','');
    $('#tip').remove();
    $('.pictureCanvas').append('<div class="preview_drop" id="preview_drop_'+id+'" style="display:none;"></div>');
    $('#preview_drop_'+id)
    .append("<img src='"+src+"' height='200' id='prev_pic_"+id+"' onClick=\"openDialogImg('"+image+"' )\"/>")
    .append("<span class='deleteCross'><img src='images/ic_delete_black_18dp.png' alt='X' onClick=\"deletePhoto('"+src+"','"+id+"')\"/></span>")
    .append("<p></p>")
    .append("<input type='hidden' id='lat_"+id+"' value='"+lat+"'/>")
    .append("<input type='hidden' id='lon_"+id+"' value='"+lon+"'/>")
    $("#prev_pic_"+id)
    .load(function() { $('#preview_drop_'+id).show(400, function() {}); })
    .error(function() { console.error("error loading image"); });
    $('.pictureCanvas').append(tip);
}

function addCityToPreview(id, modifiable){
    var lat = $("#lat_"+id).val();
    lon = $("#lon_"+id).val();
    getCity(lat,lon, function(status, city) { 
        if (status) {
            if(modifiable)
                $('#prev_pic_'+id).parent().children("p").html('<div class="button_light link" onclick="openMap('+id+')">'+city+'</div>');
            else
                $('#prev_pic_'+id).parent().children("p").html(city);
        }else{
            $("#lat_"+id).val('undefined');
            $("#lon_"+id).val('undefined');
            $("#prev_pic_"+id).parent().children("p").html('<div class="button_raised link needgeolocalisation" onclick="openMap('+id+')">ADD GPS DATA</div>');
        }
    });
}

/** callback(status,city) : status==true if everything went well and city then contains the city
*/
function getCity(lat, lon, callback){
    $.ajax({
        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
        type: "GET"
    }).done(function(ret) { 
        var indice = ret.results.length - 4,
        status = (ret.status == "OK" && ret.results),
        city;
        try{
            city = ret.results[indice].formatted_address;
        }catch(e){
            city = null;
            status = false;
        }
        callback(status,city);
    });
}

function profile(){
    API("/user/","GET",null,function(data) {
        var string = "<b>Username</b> : "+data.login+"<br /><br />"+
        "<b>Mail</b> : "+data.mail+"<br /><br />";
        openDialog('Profile',string,'OK',function(){});
    });
}



// API

function API(url,method,data,callback,progressCB) {
    if (user.logged != true) {
        openDialog('Not connected ?', '<p>It seems like you are trying to access something you\'re not supposed to. Please login.</p>', 'OK', function(){link('login');})
        return;
    }

    var ts=Date.now().toString();
    var hash = CryptoJS.HmacSHA1(ts, user.passwordHash);
    $.ajax({
        url: serverAddress+"/api"+url,
        type: method,
        data:data,
        headers: {
            "X-API-Login":user.login,
            "X-API-Hash":hash,
            "X-API-Time":ts,
        },
        xhr: function () {
         var xhr = new window.XMLHttpRequest();
         if (progressCB != undefined && progressCB != null) {
            xhr.upload.addEventListener("progress", function (evt) {
               if (evt.lengthComputable) {
                  var percentComplete = evt.loaded / evt.total;
                  progressCB(percentComplete);
              }
          }, false);
        }
        return xhr;
    },
}).done(function(ret) {
    if (ret.success == false) {
        openDialog('An error occured', '<p>There was a problem while communicating with the server. Please try again.</p>', 'Try again', function(){})
        return;
    }

    if (callback != undefined && callback != null) {
        callback(ret);
    }
});
}

function logout() {
	user = {
		logged:false
	}
	
	localStorage.setItem("user",JSON.stringify(user));
	
	loadHeaderMenu();
	link('logout');
}

