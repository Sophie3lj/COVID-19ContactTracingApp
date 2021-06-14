var loggedin =  "NO";

var vueinst = new Vue({
	el: '#app',
	data: {
		checkins: false,
		hotspots: false,
		user_log: "",
		user_name: ""
	}
});


// when i tried to do it using normal stuff
function updateMenu(){
	vueinst.user_log = loggedin;
	/*
	if(loggedin == "USER"){
		document.getElementById("user_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else if(loggedin == "VENUE"){
		document.getElementById("venue_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else if(loggedin == "ADMIN"){
		document.getElementById("venue_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else {
		if (!document.getElementById("user_menu").classList.contains("hide-menu")){
			document.getElementById("user_menu").classList.add("hide-menu");
		} else if(!document.getElementById("venue_menu").classList.contains("hide-menu")) {
			document.getElementById("venue_menu").classList.add("hide-menu");
		} else if(!document.getElementById("admin_menu").classList.contains("hide-menu")){
			document.getElementById("admin_menu").classList.add("hide-menu");
		} else {
			document.getElementById("default_menu").classList.remove("hide-menu");
		}
	}*/
}

function loginCheck(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			var login_info = JSON.parse(this.responseText) ;
			vueinst.user_log = login_info.user_type;
			vueinst.user_name = login_info.user_name;
		}
	};

	xhttp.open('GET', '/users/LoginCheck', true) ;
	xhttp.send();
}

function change_signin_options(){
	var i;
	var user_type = document.getElementsByClassName("user");
	var venue_type = document.getElementsByClassName("venue");
	if(document.getElementById("user_type").value === "USER"){
		for(i = 0; i<user_type.length; i++){
			user_type[i].style = "display: all;";
		}
		for(i = 0; i<venue_type.length; i++){
			venue_type[i].style = "display: none;";
		}
	}else if(document.getElementById("user_type").value === "VENUE"){
		for(i = 0; i<user_type.length; i++){
			user_type[i].style = "display: none;";
		}
		for(i = 0; i<venue_type.length; i++){
			venue_type[i].style = "display: all;";
		}
	}else{
		for(i = 0; i<user_type.length; i++){
			user_type[i].style = "display: none;";
		}
		for(i = 0; i<venue_type.length; i++){
			venue_type[i].style = "display: none;";
		}
	}
}

function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	var profile = googleUser.getBasicProfile();
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			window.location.pathname="/";
		}
	};
    xhttp.open("POST", "users/GoogleLogin", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("first_name=" + profile.getGivenName() + "&last_name=" + profile.getFamilyName() + "&email=" + profile.getEmail());




	// The ID token you need to pass to your backend:
	//var id_token = googleUser.getAuthResponse().id_token;

}

function signUp() {
	let signup_details = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value,
		first_name: document.getElementById('first_name').value,
		user_type: document.getElementById('user_type').value,
		last_name: document.getElementById('last_name').value,
		phone_number: document.getElementById('phone_number').value,
		venue_name: document.getElementById('venue_name').value,
		street_number: document.getElementById('street_number').value,
		street_address: document.getElementById('street_address').value,
		suburb: document.getElementById('suburb').value,
		post_code: document.getElementById('post_code').value,
		state: document.getElementById('state').value
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			window.location.pathname="/";
		}
		else if ( this.readyState == 4 && this.status == 401 ) {
			window.location.hash="#preexisting-user";
			window.location.pathname="/SignUp";
		}else if(this.status == 500){
			window.location.hash="#signup_failed";
			window.location.pathname="/SignUp";
		} else if(this.readyState == 4 && this.status == 400){
			window.location.hash="#value-error";
			window.location.pathname="/SignUp";
		}
	};

	xhttp.open('POST', '/signup', true) ;
	xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(signup_details));
}

function login(){
	let login_details = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			window.location.pathname="/";
		}
		else if ( this.readyState == 4 && this.status == 401 ) {

			window.location.hash="#login_failed";
			window.location.pathname="/Login";
		}else if(this.status == 500){
			//window.location.pathname="/Login.html#login_failed";
		}
	};

	xhttp.open('POST', '/users/login', true) ;
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(login_details));
}

function logout(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			window.location.pathname="/";
		}
	};

	xhttp.open('POST', '/users/logout', true) ;
	xhttp.send();
}

/*
function signup(){
	let user_details = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			// filler
			let a = 1 ;
		}
	};

	xhttp.open('POST', '/signup', true) ;
	xmlhttp.setRequestHeader("Content-type", "application/json");
	xmlhttp.send(JSON.stringify(login_details));
}*/