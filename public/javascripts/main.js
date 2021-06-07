var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false
    }
});

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

