var loggedin =  "NO";

/* AccountDetails.html variables */
var accountDetails = [];

var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false,
        user_log: "",
        user_name: "",
        loggedin: false,
        AccountDetails_firstName: 'first_name',
        AccountDetails_lastName: 'last_name',
        AccountDetails_email: 'email',
        AccountDetails_phoneNumber: 'phone_number',
		AccountDetails_venueName: 'venue_name',
		AccountDetails_streetAddress: 'street_address',
		AccountDetails_suburb: 'suburb',
		AccountDetails_postcode: 'postcode',
		AccountDetails_state: 'state'
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
			window.location.pathname="/";
		}
		else if ( this.readyState == 4 && this.status == 401 ) {
			//window.location.pathname="/Login#login_failed";
			console.log("/Login#login_failed")
		}else if ( this.readyState == 4 && this.status == 402 ) {
			//window.location.pathname="/Login#login_failed";
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

/* AccountDetails.html AJAX script */
function GetAccountDetails() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
        	var accountDetails=JSON.parse(this.responseText);
        	console.log('amongus');
        	for (let key of accountDetails) {
        		console.log('logging element');
		    	console.log(`${key} : ${accountDetails[key]}`);
			}

	        vueinst.AccountDetails_firstName = accountDetails[0].first_name;
	        //console.log(accountDetails[0].first_name);
	        vueinst.AccountDetails_lastName = accountDetails[0].last_name;
	        //console.log('past last name');
	        vueinst.AccountDetails_email = accountDetails[0].email;
	        //console.log('past email');
	        vueinst.AccountDetails_phoneNumber = accountDetails[0].phone_number;
			vueinst.AccountDetails_venueName = accountDetails[0].venue_name;
			vueinst.AccountDetails_streetAddress = accountDetails[0].street_number + accountDetails[0].street_name;
			vueinst.AccountDetails_suburb = accountDetails[0].suburb_name;
			vueinst.AccountDetails_postcode = accountDetails[0].postcode;
			vueinst.AccountDetails_state = accountDetails[0].state;
    	}
    };
    xhttp.open("GET", "/users/getAccountDetails");
	xhttp.send();

}


function GetCheckinHistory(){

	var xhttp = new XMLHttpRequest() ;
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			var checkins = JSON.parse(this.responseText) ;
			var date ;

			for ( let row of checkins){
				date = new Date(row.date_time);

				if ( 'ADMIN' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"></td>
						</tr>`;

					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
				else if ( 'USER' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"></td>
						</tr>`;
					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
				else if ( 'VENUE' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border"></td>
						</tr>`;

					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
			}
		}
	};

	xhttp.open('GET', '/users/getCheckinHistory', true) ;
	xhttp.send() ;
}

function GetCheckinSearchHistory(){

	let Search = {
		search: document.getElementById('checkinSearch').value,
	};

	var xhttp = new XMLHttpRequest() ;
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			var checkins = JSON.parse(this.responseText) ;
			var date ;

			document.getElementById('addCheckinHistory').innerHTML = " ";

			for ( let row of checkins){
				date = new Date(row.date_time);

				if ( 'ADMIN' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"></td>
						</tr>`;

					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
				else if ( 'USER' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"></td>
						</tr>`;
					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.venue_name} (${row.suburb_name})</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
				else if ( 'VENUE' in row ){
					if (row.hotspot == null){
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border"></td>
						</tr>`;

					}
					else{
						document.getElementById('addCheckinHistory').innerHTML = document.getElementById('addCheckinHistory').innerHTML +	`
						<tr>
							<td id="table-no-border">${date.toLocaleDateString()}</td>
							<td id="table-no-border">${date.toLocaleTimeString()}</td>
							<td id="table-no-border">${row.user_id}</td>
							<td id="table-no-border"><i class="fas fa-exclamation-triangle"></i></td>
						</tr>`;
					}
				}
			}
		}
	};

	xhttp.open('POST', '/users/getCheckinSearchHistory', true) ;
	xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(Search));
}
