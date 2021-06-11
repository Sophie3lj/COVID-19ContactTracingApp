var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false,
        loggedin: false
    }
});


function loggedIn(){
    vueinst.loggedin = true;
}

function loginCheck(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 && this.responseText == 'true') {
			vueinst.loggedin = true;
		}
		else if ( this.readyState == 4 && this.status == 200 && this.responseText == 'false') {
			vueinst.loggedin = false;
		}
	};

	xhttp.open('GET', '/users/publicLoginCheck', true) ;
    xhttp.send();
}

function change_signin_options(){
	var i;
	var user_type = document.getElementsByClassName("user");
	var venue_type = document.getElementsByClassName("venue");
	if(document.getElementById("user_type").value === "User"){
		for(i = 0; i<user_type.length; i++){
			user_type[i].style = "display: all;";
		}
		for(i = 0; i<venue_type.length; i++){
			venue_type[i].style = "display: none;";
		}
	}else if(document.getElementById("user_type").value === "Venue Owner"){
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

    xhttp.open("POST", "GoogleLogin.html", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("first_name=" + profile.getGivenName() + "&last_name=" + profile.getFamilyName() + "&email=" + profile.getEmail());

    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}


function login(){
	let login_details = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			loggedIn();
			window.location.pathname="/";
		}
		else if ( this.readyState == 4 && this.status == 401 ) {
			alert("unsuccessful");
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