# contact-tracing-app
A Website used to log and view venue and location based check-ins to track the spread of COVID-19.
Able to display check-in and hotspot information based on login type.
The avaliable user types and corresponding capabilities are:

USER:
- Manage their user information.
- Check-in to locations by entering a check-in code or using location services.
- View their check-in history and current hotspots on the map page.
- See if they've been to a hotspot (warning next to items in check-in history).

VENUE:
- Manage their venue information.
- View the check-in history for their venue.

ADMIN:
- Manage their user information.
- Create and manage hotspot areas/venues & timeframes.
- View the check-in history for users and venues.
- See current hotspots on a map.
- Manage Users/Venues.
- Sign-up other ADMIN users.

The default admin login is:

username: `admin@example.com`

pasword: `admin`

# Install
This app requires the following:
- node.js
- npm
- express
- MySQL

# Run
Run the app using:

`sql_start`


`npm start`

It is recomended to run this app using the CS50 web IDE.
