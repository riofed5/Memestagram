# Media Sharing - Run Locally
Memestagram is built for everyone who is media-sharing enthusiast. Memestagram where everyone
is in a family and share to save every moment of each’s daily basics. 

This project is using centos7 as server. 

## [Link](https://www.figma.com/file/87f37pvp4HzDI5FEvyj5I3/Memestagram?node-id=46%3A0) to our mock ups. After getting to the website, there is a play button on the upper right hand side to actually view how our web works.

## [Link](https://10.114.32.137/app/) to our app.
## Requirement list before run this application:
* Node server
* Relational database on MariaDB server.

## Instruction

### Database
* Create a database using mySQL
* Copy the code inside [this](https://raw.githubusercontent.com/riofed5/projectBSWC/master/project.sql) and paste in SQL database command

### Run the app
* Clone the respo: `git clone git@github.com:riofed5/projectBSWC.git`
* Install packages: `npm install`
* Edit the file .env as following instruction:

```
DB_HOST=localhost
DB_USER= your username on database server
DB_PASS= your database password
DB_NAME= database name
SERVER=production
IP= your server ip
```

* Go to file `database/db.js` and uncomment the line with `password: process.env.DB_PASS`
* Go to file `homepage.js`, `personal.js` and `visit.js` and change the url to `https://localhost:8000`
* Go to file `homepage.js`, `personal.js` and `visit.js` and remove any `/app`

* Launch: `npm start`
* Visit in your browser: [Link](https://localhost:8000)
