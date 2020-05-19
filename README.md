# Media Sharing - Run Locally
Memestagram is built for everyone who is media-sharing enthusiast. Memestagram where everyone 
is in a family and share to save every moment of each’s daily basics. 

## [Link](https://www.figma.com/file/87f37pvp4HzDI5FEvyj5I3/Memestagram?node-id=46%3A0) to our mock ups. After getting to the website, there is a play button on the upper right hand side to actually view how our web works.

## Requirement list before run this application:
* Node server
* Amazon web service (AWS) S3. Instruction of setup S3 at [here](https://medium.com/@imranhsayed/how-to-create-a-user-and-bucket-amazon-web-services-aws-40631416e65) 

## Instruction feature
* Anonymous mode:
    * View post by search user name 
* Subcription mode:
    * Normal user 
        * Normal social media activities: View public post, Like, comment, post video/image privately or publicly.
    * Administer user:
        * Same as normal user but view all post, delete post. 

### Database
* Using a database using mySQL on AWS RDS 

### Run the app
* Clone the repo
* Install packages: `npm install`
* Edit variable `s3bucketURL` in `personal.js`, `homepage.js`, `visit.js` in folder `public_html/js` by your endpoint s3 bucket which is normally `https:{your-bucket-name}.s3.{your-region-bucket}.amazonaws.com/`
* Edit the file .env as following instruction:

```
//Set up MySQL database

DB_HOST=dbmysql.c9hidhjqcaip.eu-central-1.rds.amazonaws.com
DB_USER=admin
DB_PASS=adminadmin
DB_NAME=project
DB_PORT=3306

//Set up S3 bucket

accessKeyId= Your own access key ID 
secretAccessKey= Your own secret access key
region= Region of your S3
bucketName= Name of your S3 bucket

```

* Launch: `npm start`
* Visit in your browser: (http://localhost:3000)
* Administer account:
    * Email: nhan@metropolia.fi
    * Password: 1234


