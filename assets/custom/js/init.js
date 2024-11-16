'use strict';

/*
|------------------------------------------------------------------------------
| Framework7 Plugins
|------------------------------------------------------------------------------
*/

Framework7.use(Framework7Keypad);

/*
|------------------------------------------------------------------------------
| Initialize App
|------------------------------------------------------------------------------
*/
var main_url='https://ipachicapital.com/phamarcy/';


var app = new Framework7({
	root: '#app',
	id: window.config.app.id,
	name: window.config.app.title,
	version: window.config.app.version,
	theme: 'md',
	rtl: false,
	routes: window.routes,
	lazyModulesPath: 'assets/vendor/framework7/lazy-components',
	init: false,
	data: function() {
		return {
			a2hs: null,
			config: window.config
		}
	},
	actions: {
		closeByOutsideClick: true,
		convertToPopover: false
	},
	autocomplete: {
		autoFocus: true,
		closeOnSelect: true,
		limit: 10,
		notFoundText: 'No Search Results',
		preloader: true,
		requestSourceOnOpen: true,
		searchbarPlaceholder: 'Search'
	},
	calendar: {
		headerPlaceholder: 'Select'
	},
	dialog: {
		title: window.config.app.title
	},
	lazy: {
		placeholder: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 256"><path fill="#F5F5F5" d="M384 0H0v256h384z" /><path fill="#ECF0F1" d="M164.5 107h55v42h-55z" /><path fill="#545E73" d="M220.5 150h-57v-44h57zm-55-2h53v-40h-53z" /><path fill="#545E73" d="M168.5 111h47v34h-47z" /><path fill="#ECF0F1" d="M216.5 146h-49v-36h49zm-47-2h45v-32h-45z" /><circle fill="#F3D55A" cx="178.50002" cy="119.569" r="4.5689998" /><path fill="#11A085" d="M213.5 134l-12-11-10.5 11.5 5.483 5.483L200.5 144h14v-8.889z" /><path fill="#26B999" d="M185.517 129.017L169.5 143v1h31l-4.017-4.017z" /></svg>',
		sequential: false
	},
	listIndex: {
		label: true
	},
	notification: {
		closeButton: true,
		icon: '<i class="fa fa-bell"></i>',
		title: window.config.app.title
	},
	panel: {
		swipe: false
	},
	searchbar: {
		removeDiacritics: true
	},
	sheet: {
		backdrop: true,
		closeByOutsideClick: true
	},
	smartSelect: {
		closeOnSelect: true
	},
	toast: {
		closeTimeout: 3000
	},
	touch: {
		fastClicksExclude: '.ap-dropdown-menu, .pac-container .pac-item'
	},
	view: {
		pushState: (function() {
			if (window.config.theme.navigation == 'hamburger') {
				return !Framework7.device.cordova;
			}
			else {
				return false;
			}
		})(),
		pushStateRoot: (function() {
			return location.pathname;
		})(),
		pushStateSeparator: '#!'
	}
});

/*
|------------------------------------------------------------------------------
| App Events
|------------------------------------------------------------------------------
*/

app.on('init', function() {
	//initializeServiceWorker();
	initializeViews();
	initializeTheme();
	initializeI18n();
	initializeA2HS();
	initializeBackButton();
	getInternetConnectionStatus();
	setAJAXDefaults();
	setFormValidatorDefaults();
	//initializeFacebookJsSdk();
});

app.on('pageInit', function() {
	localizeApp();
});

app.on('panelOpen', function() {
	app.$('.navbar .hamburger').addClass('is-active');
});

app.on('panelClose', function() {
	app.$('.navbar .hamburger').removeClass('is-active');
});

app.on('routerAjaxError', function() {
	app.toast.show({
		text: 'No Internet Connection',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
});

/*
|------------------------------------------------------------------------------
| Initialize Service Worker
|------------------------------------------------------------------------------
*/

function initializeServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./service-worker.js');
	}
}

/*
|------------------------------------------------------------------------------
| Initialize Views
|------------------------------------------------------------------------------
*/

function initializeViews() {
	var mainView = app.views.create('.view-main', {
		url: '/'
	});

	if (window.config.theme.navigation == 'tabbar') {
		var componentsView = app.views.create('.view-components', {
			url: '/components'
		});
		var screensView = app.views.create('.view-screens', {
			url: '/screens'
		});
		var moreView = app.views.create('.view-more', {
			url: '/more'
		});
	}
}

/*
|------------------------------------------------------------------------------
| Initialize Theme
|------------------------------------------------------------------------------
*/

function initializeTheme() {
	var color = app.utils.theme.getColor();
	var layout = app.utils.theme.getLayout();
	app.utils.theme.setColor(color);
	app.utils.theme.setLayout(layout);
}

/*
|------------------------------------------------------------------------------
| Initialize i18n
|------------------------------------------------------------------------------
*/

function initializeI18n() {
	var language = app.utils.i18n.getLanguage();
	i18next
		.use(i18nextXHRBackend)
		.init({
		lng: language.lang,
		fallbackLng: 'en',
		whitelist: ['en', 'hi', 'ar'],
		nonExplicitWhitelist: true,
		preload: ['en', 'hi', 'ar'],
		backend: {
			loadPath: 'assets/custom/i18n/{{lng}}.json'
		}
	},
					function() {
		app.utils.i18n.setLanguage(language);
	});
}


  function generateORDERCODE() { 
    var digits = '0123456789'; 
	var characters ='ABCDEFGHIJLKMNOPQRSTUVWXYZ'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
		OTP += characters[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 


function set_last_page(page){
	 localStorage.lastpage_phamarcy=page;
	 var user_id=localStorage.user_phamarcy_id;
	 console.log('Last Page: '+page);
	 var xhr = $.get( main_url+"data/notification_read.php?page="+page+"&user_id="+user_id, function(data) {
		 console.log(data);
	 });
}

function get_last_page(){
	check_home_login();
	app.dialog.progress('Loading...');
	if((localStorage.lastpage_phamarcy!='')){
		app.dialog.close();
		app.views.current.router.navigate(localStorage.lastpage_phamarcy);
	} else {
		app.dialog.close();
		app.views.current.router.navigate('/home');
	}
	
}







function check_login(){


if((localStorage.login_user_phamarcy=='true')&&(localStorage.user_phamarcy_session!='')){
 return true;
} else {
return false;
}

}


function check_home_login(){

//app.preloader.show();
if((localStorage.login_user_phamarcy=='true')&&(localStorage.user_phamarcy_session!='')){
 $('.locked').addClass('hidden');
$('.lock').removeClass('hidden');	
 showUser();
			

} else {

$('.locked').removeClass('hidden');
$('.lock').addClass('hidden');
}

}


function sign_out(){


var self = this;
				app.dialog.confirm(
					'Are you sure?',
					function() {
					app.preloader.show();
					var user_email=localStorage.user_phamarcy_session;
					
					var xhr = $.get( main_url+"profile/auth.php?signout=?", function(data) {
						console.log(data);
					app.preloader.hide();
					
					localStorage.login_user_phamarcy='false';
				
					app.toast.show({
						text: 'Signed Out',
						cssClass: 'bg-color-green'
					});
	
			get_last_page();
					
					
					}).fail(function() {
				app.preloader.hide();
				app.toast.show({
		text: 'No Internet Connection',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
					
				  });
					},
					function() {
					
					}
				);


		
				

}

			function remove(id) {
				var self = this;
				
				app.dialog.confirm(
					'Are you sure?',
					function() {
					app.preloader.show();
					var xhr = $.get( main_url+"cart/remove.php?id="+id+
					"&cart_remove=?", function(data) {
					app.preloader.hide();
					if(data==2){
					loadProducts_cart();
						app.toast.show({
					icon: '<i class="fas fa-fw  fa-check"></i>',
					text: 'Removed',
					position: 'bottom',
					cssClass: 'toast-round bg-color-green'
				});
					} else {
					console.log(data);
					app.toast.show({
					icon: '<i class="fas fa-fw fa-lg fa-close"></i>',
					text: 'Error',
					position: 'bottom',
					cssClass: 'toast-round bg-color-red'
				});
					
					}
					});
					},
					function() {
						
					}
				);
				
				
				
			}

function inputQuantity(id) {
				var self = this;
				var target = event.target.tagName === 'A' ? event.target : event.currentTarget;
				var title = target.dataset.title;
				app.dialog.prompt(
					'How many '+title+'?',
					function(value) {
						if (value != '') {
							app.preloader.show();
					var xhr = $.get( main_url+"cart/add_quantity.php?id="+id+"&quantity="+value+
					"&cart_remove=?", function(data) {
					app.preloader.hide();
					if(data==2){
					loadProducts_cart();
						app.toast.show({
					icon: '<i class="fas fa-fw  fa-check"></i>',
					text: 'Saved',
					position: 'bottom',
					cssClass: 'toast-round bg-color-green'
				});
					} else {
					console.log(data);
					app.toast.show({
					icon: '<i class="fas fa-fw fa-lg fa-close"></i>',
					text: 'Error',
					position: 'bottom',
					cssClass: 'toast-round bg-color-red'
				});
					
					}
					
					});
						}
						else {
							
						}
					}
				);
			}


function loadProducts_cart() {
		var self = this;
var branch_id=localStorage.getItem('selected_branch_id');		
		var user_id=localStorage.user_phamarcy_id;
				app.preloader.show();
					var xhr = $.get( main_url+"cart/products.php?user_id="+user_id+
					"&branch_id="+branch_id, function(data) {
						
					app.preloader.hide();
					
					getTotal_cart();
					
					$('.loadProducts_cart_status').html(data);
					}).fail(function() {
 
 alert('Check your internet connection');
  });
				
			}
			
function loadProducts_checkout() {
		var self = this;	
		var branch_id=localStorage.getItem('selected_branch_id');
		var user_id=localStorage.user_phamarcy_id;
				app.preloader.show();
					var xhr = $.get(main_url+"cart/productscheckout.php?user_id="+user_id+"&branch_id="+branch_id, function(data) {
						
					app.preloader.hide();
					$('.loadProducts_checkout_status').html(data);
					//check_branch();
					}).fail(function() {
 
 alert('Check your internet connection');
  });
				
}	
			

			
function clear_cart() {
	var self = this;
	var user_id=localStorage.user_phamarcy_id;
		
			var xhr = $.get( main_url+"cart/clear_cart.php?user_id="+user_id+
			"&getTotal=?", function(data) {
			console.log(data);
			cart_count();
			});
	
	}
	function getTotal_cart() {
			var self = this;
			var branch_id=localStorage.getItem('selected_branch_id');
			var user_id=localStorage.user_phamarcy_id;
				app.preloader.show();
					var xhr = $.get( main_url+"cart/getTotal.php?user_id="+user_id+
					"&branch_id="+branch_id, function(data) {
					app.preloader.hide();
					$('.getTotal_status').html(data);
					});
			
			}
function help_load() {
			
				app.preloader.show();
					var xhr = $.get( main_url+"data/help.php", function(data) {
					app.preloader.hide();
					$('#help_load').html(data);
					});
			
			}

function info_load() {
			
				app.preloader.show();
					var xhr = $.get( main_url+"data/info.php", function(data) {
					app.preloader.hide();
					$('#info_load').html(data);
					});
			
			}
			



function open_avatar_change(){
app.views.current.router.navigate('/avatar');
}
function showUser_profile(){
	var user_email=localStorage.user_phamarcy_session;
	
	
	app.request.json(main_url+"data/users.php?user_email="+user_email,
					function(data) {
					console.log(data);
					var user_id=data[0].id;
					var name=data[0].name;
					var avatar=data[0].avatar_file;
					var bio_summary=data[0].bio_summary;
					var mobile=data[0].mobile;
					var birthday=data[0].birthday;
					var location=data[0].location;
						
					$('#profile_name').val(name);
					$('#profile_mobile').val(mobile);
					$('#profile_birthday').val(birthday);
					$('#profile_location').val(location);
					$('#profile_bio_summary').val(bio_summary);
						 
							
						
					}
				);
	
	
	
}

	function showUser() {
			
				var user_email=localStorage.user_phamarcy_session;
				
				
			console.log(user_email);

			var class_data2=fetch(main_url+'data/users.php?user_email='+user_email)
			.then(response => response.text())
			.then(data => {
			//console.log(data);
			app.preloader.hide();
			var obj = JSON.parse(data);
			var user_id=obj[0].id;
			var fullname=obj[0].name;
			var mobile=obj[0].mobile;
			var birthday=obj[0].birthday;
			var location=obj[0].location;
			var avatar_file=obj[0].avatar_file;
			var bio_summary=obj[0].bio_summary;

			$('.user').html(fullname);
			$('.user-email').html(user_email);
			$('.user-mobile').html(mobile);
			$('.user-birthday').html(birthday);
			$('.user-location').html(location);
			$('.user-bio').html(bio_summary);
			$(".user-avatar").attr("src", avatar_file);

			console.log('REST: '+user_id);
			localStorage.user_phamarcy_id=user_id;
			cart_count();				


							
  }).catch(function(error) {
  
			app.toast.show({
		text: 'No Internet Connection',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
				}); 
				
				
			}
			
			function cart_count(){
				$('.cart_count').html('');
				var user_id=localStorage.user_phamarcy_id;
				var branch_id=localStorage.getItem('selected_branch_id');
				var xhr = $.get( main_url+"cart/count.php?id="+user_id+
					"&branch_id="+branch_id, function(data) {
					
					$('.cart_count').html(data);
					
				}).fail(function() {
					 
				  });
				
			}









function _(el){
	return document.getElementById(el);
}

function uploadFile(){
var memory_limit=8388608;
	var file = _("file1").files[0];
	var patient_type=$('#patient_type').val();
	var doctor_name=$('#doctor_name').val();
	var medical_card_number=$('#medical_card_number').val();
	var note=$('#note').val();
	var user_id=localStorage.user_phamarcy_id;
	var prescription_code=generateORDERCODE();
	var branch_id=localStorage.getItem('selected_branch_id');
	if(file==null){
		
		
		app.toast.show({
		text: 'Please Select to upload',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
		
		

}  else  if(medical_card_number==''){
		
		
		app.toast.show({
		text: 'Please Enter Medical or DPS Card Number',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
		
		

}  else if(file.size>memory_limit){


app.toast.show({
		text: 'Selected File Exceeds size limits:<b>'+file.size+'</b> bytes, Our limit is: <b>'+memory_limit+'</b> bytes',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});
		

}else{

	$("#progressBar").removeClass('hidden');
	var formdata = new FormData();
	formdata.append("file1", file);
	var ajax = new XMLHttpRequest();
	ajax.upload.addEventListener("progress", progressHandler, false);
	ajax.addEventListener("load", completeHandler, false);
	ajax.addEventListener("error", errorHandler, false);
	ajax.addEventListener("abort", abortHandler, false);
	ajax.open("POST", main_url+"uploads/pres/upload.php?user_id="+user_id+
	"&patient_type="+patient_type+
	"&doctor_name="+doctor_name+
	"&medical_card_number="+medical_card_number+
	"&branch_id="+branch_id+
	"&prescription_code="+prescription_code+
	"&note="+note);
	ajax.send(formdata);
	}
}
function progressHandler(event){
	app.preloader.show();
	_("loaded_n_total").innerHTML = "";
	var percent = (event.loaded / event.total) * 100;
	_("progressBar").value = Math.round(percent);
	_("status").innerHTML = Math.round(percent)+"% uploaded... please wait";
}
function completeHandler(event){
	app.preloader.hide();
	//_("status").innerHTML = event.target.responseText;
	_("progressBar").value = 100;
	
	if((event.target.responseText)==1){
		
		app.toast.show({
		text: 'Database connection error',
		position: 'bottom',
		cssClass: 'bg-color-red'
	});

	} else if((event.target.responseText)==2) {
		$('#patient_type').val('');
	$('#doctor_name').val('');
	$('#medical_card_number').val('');
	$('#note').val('');
	$("#progressBar").addClass('hidden');
	$("#status").addClass('hidden');
	app.views.current.router.navigate('/pres');
	app.toast.show({
		text: 'Uploaded successfuly',
		position: 'bottom',
		cssClass: 'bg-color-green'
	});
	
	} else {
		
		app.toast.show({
		text: 'File upload error',
		position: 'bottom',
		cssClass: 'bg-color-red'
		});
	
	}
	
	
}
function errorHandler(event){
	app.preloader.hide();
	_("status").innerHTML = "Upload Failed";
}
function abortHandler(event){
	app.preloader.hide();
	_("status").innerHTML = "Upload Aborted";
} 



/*
|------------------------------------------------------------------------------
| Localize App
|------------------------------------------------------------------------------
*/

function localizeApp() {
	if (window.localize) {
		window.localize('body');
	}
}

/*
|------------------------------------------------------------------------------
| Initialize Add to Home Screen
|------------------------------------------------------------------------------
*/

function initializeA2HS() {
	window.addEventListener('beforeinstallprompt', function(event) {
		event.preventDefault();
		app.a2hs = event;
		var dialog = app.dialog.create({
			title: '',
			content: '<div class="block no-margin no-padding text-align-center" style="font-size: 14px;"><img src="'+ window.config.app.logo +'" width="84" alt="" /><p><b>Add Nectar to your Home Screen?</b></p><p>Install Nectar on your home screen for quick and easy access when you\'re on the go.</p></div>',
			verticalButtons: true,
			buttons: [
				{
					text: 'Add to Home Screen',
					bold: true,
					color: 'green',
					onClick: function() {
						app.a2hs.prompt();
						app.a2hs.userChoice
							.then(function(choice) {
							if (choice.outcome == 'accepted') {
								app.toast.show({
									text: 'Yaay! Added to Home Screen',
									position:'bottom',
									cssClass: 'toast-round bg-color-green'
								});
							}
							else {
								app.toast.show({
									text: 'Oops! Could not add to Home Screen',
									position:'bottom',
									cssClass: 'toast-round bg-color-red'
								});
							}
							app.a2hs = null;
						});
						app.dialog.close();
					}
				},
				{
					text: 'No, Thanks',
					color: 'gray'
				}
			]
		});
		setTimeout(function() {
			dialog.open();
		}, 60000);
	});
}

/*
|------------------------------------------------------------------------------
| Initialize Back Button
|------------------------------------------------------------------------------
*/

function initializeBackButton() {
	document.addEventListener('backbutton', function(event) {
		event.preventDefault();
		var dismissibleModals = app.$('.actions-modal.modal-in').length + app.$('.login-screen.modal-in').length + app.$('.notification.modal-in').length + app.$('.panel-active').length + app.$('.popover.modal-in').length + app.$('.popup.modal-in').length + app.$('.sheet-modal.modal-in').length + app.$('.swipeout-opened').length + app.$('.td-wrap').length + app.$('.toast.modal-in').length + app.$('.tooltip.tooltip-in').length;
		var nonDismissibleModals = app.$('.dialog.modal-in').length;
		if (nonDismissibleModals) {
			return false;
		}
		else if (dismissibleModals) {
			app.actions.close();
			app.loginScreen.close();
			app.notification.close();
			app.panel.close();
			app.popover.close();
			app.popup.close();
			app.sheet.close();
			app.swipeout.close(app.swipeout.el);
			app.$('.td-wrap').removeClass('td-show');
			app.toast.close();
			app.$('.tooltip').remove();
		}
		else {
			var currentRoute = app.views.current.router.currentRoute.url;
			if (currentRoute == '/home' || currentRoute == '/screens/home') {
				app.dialog.confirm(
					'<div class="text-align-center"><img src="assets/custom/img/exit.svg" width="80" alt="" /><div>Do you want to exit the app?</div></div>',
					'',
					function() {
						navigator.app.exitApp();
					}
				);
			}
			else if (app.data.config.theme.navigation == 'tabbar' && (currentRoute == '/components' || currentRoute == '/screens' || currentRoute == '/more')) {
				app.tab.show('#tab-home');
			}
			else {
				if (app.$('.page.page-current .navbar .back').length) {
					app.views.current.router.back();
				}
				else {
					return false;
				}
			}
		}
	});
}

/*
|------------------------------------------------------------------------------
| Get Internet Connection Status
|------------------------------------------------------------------------------
*/

function getInternetConnectionStatus() {
	window.addEventListener('online', function() {
		app.toast.show({
			text: 'Connected to Internet',
			position: 'bottom',
			cssClass: 'bg-color-green'
		});
	});
	window.addEventListener('offline', function() {
		app.toast.show({
			text: 'No Internet Connection',
			position: 'bottom',
			cssClass: 'bg-color-red'
		});
	});
}

/*
|------------------------------------------------------------------------------
| Set AJAX Defaults
|------------------------------------------------------------------------------
*/

function setAJAXDefaults() {
	app.request.setup({
		beforeSend: function() {
			app.preloader.show();
		},
		complete: function() {
			app.preloader.hide();
		}
	});
}

/*
|------------------------------------------------------------------------------
| Set Form Validator Defaults
|------------------------------------------------------------------------------
*/

function setFormValidatorDefaults() {
	jQuery.validator.setDefaults({
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.siblings('.input-error-message'));
		}
	});
}

/*
|------------------------------------------------------------------------------
| Initialize Facebook JavaScript SDK
|------------------------------------------------------------------------------
*/

function initializeFacebookJsSdk() {
	LazyLoad.js(['https://connect.facebook.net/en_US/sdk.js'], function() {
		window.fbAsyncInit = function() {
			FB.init({
				appId: window.config.facebook.appId,
				autoLogAppEvents: true,
				xfbml: true,
				version: 'v3.3'
			});
		};
		app.on('pageInit', function() {
			FB.XFBML.parse();
		});
		app.on('pageReInit', function() {
			FB.XFBML.parse();
		});
	});
}