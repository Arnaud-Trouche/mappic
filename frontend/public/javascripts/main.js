var serverAddress = "http://localhost:3000";

function loadContent(content, callback){
    var logged = localStorage.getItem("login");
    var path = '/nolog/'//logged ? '/log/' : '/nolog/'; 

    //Load the template for the current content
    $.get('templates'+path+content+'.hgn', function(template) {
        var rendered = Mustache.render(template, {});
        $('#page').html(rendered);
        $('#page').slideToggle('fast');
        //Load the .js for the current content 
        $.get('javascripts'+path+content+'.js', null);        
    }).fail(function() {
        $.address.value('404');
    })  

    callback();  
}

function loadHeaderMenu(data, callback){
    var logged = localStorage.getItem("login");
    var path = '/nolog/'//logged ? '/log/' : '/nolog/'; 
    var smallphone = $( window ).width() <= 360 ? true : false;
    var phone = $( window ).width() <= 500 && !smallphone ? true : false;

    //Display header
    $.get('templates'+path+"header.hgn", function(template){
        $('header').html(Mustache.render(template, {username: localStorage.getItem('username'), snd_bttn: !(smallphone||phone), fst_bttn: !smallphone}));
        //load the header.js
        $.get('javascripts'+path+'header.js', null);
    });

    //Display menu
    $.get('templates'+path+"menu.hgn", function(template){
        $('#menu').html(Mustache.render(template, {snd_bttn: (smallphone||phone), fst_bttn: smallphone}));
        //load the menu.js
        $.get('javascripts'+path+'menu.js', null);
    }); 
    callback();
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
    localStorage.setItem('login',false);
    loadHeaderMenu(null, function(){});

    $.address.change(function (event) {
        $("#page").css('display', 'none');
        var page = event.value == "/" ? 'home' : event.value.substring(1);
        loadContent(page, function(){});
    });

    $( window ).resize(function() {
        loadHeaderMenu(null, function(){});
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
    if(!isAlphaNumeric(this.value))
        appendErrorbox($(this), 'Pseudo must not contains special signs');   
    else if(this.value.length ==0)
        appendErrorbox($(this), 'Pseudo empty'); 
    else if(this.value.length < 4)
        appendErrorbox($(this), 'Pseudo must be at least 4 caracters long');
    else if(this.value.length >= 4)
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
    if($('#pwd').val() == this.value)
        removeErrorbox($(this));
    else
        appendErrorbox($(this), 'Password confirmation does not match the password');
}


