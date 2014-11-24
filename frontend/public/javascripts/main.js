var serverAddress = 'http://'+$(location).attr('host')+":3000";
var user = {
	logged:false,
}

function loadContent(content, callback){
    //Load the template for the current content
    $.get('templates/'+content+'.hgn', function(template) {
        var rendered = Mustache.render(template, {logged: user.logged});
        $('#page').html(rendered);
        $('#page').slideToggle('fast');
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



function API(url,data,callback) {
    if (user.logged != true) {
        alert("Not connected ?");
        location="/";
        return;
    }

    if (data != null && data != undefined) {
        var type="POST";
    } else {
        var type="GET";
    }

    var ts=Date.now().toString();
    var hash = CryptoJS.HmacSHA1(ts, user.passwordHash);
    $.ajax({
        url: serverAddress+"/api"+url,
        type: type,
        headers: {
            "X-API-Login":user.login,
            "X-API-Hash":hash,
            "X-API-Time":ts,
        }
    }).done(function(ret) {
        if (ret.success == false) {
            alert("API error");
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

