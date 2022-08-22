# Dev-Connector
A full Mern Stack application for developers that includes authentication, profiles and a forum.


## Website
https://devconnapp.herokuapp.com/

## Usage

### JSON Variables
Add a default.json inside the 'config' folder with the following code:

~~~
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "your secret",
  "githubToken": "<your_access_token>"
}
~~~

### Install Dependencies
~~~
npm i
cd client
npm i
~~~

### Run
~~~
npm run dev
~~~

### Build & Deploy
~~~
cd client
npm run build
~~~

