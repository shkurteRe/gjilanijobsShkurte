Version - v16.14.2 (Latest version recommended)

## Project setup
`````
npm install
`````

## Set your sensitive information in your .env file (use the .env.example as an example);
`````
PORT=3000
HOST_URL=http://localhost:3000/
APP_TITLE=

#mongoDB database config - Required
DB_URL=

#sendgrid details for sending email - Optional
SENDGRID_API_KEY=
SENDGRID_SENDER=

#google details for google login - Optional
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

#Optional
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
`````

## Run
`````
npm start
`````

## Usage
`````
Open http://localhost:3000/
`````