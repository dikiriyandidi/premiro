SERVICE FIXED ASSETS
==============

Setup
------------

1. rename file .env.example menjadi .env
2. edit file .env sesuai setup environtment local
3. untuk install semua package ketik : npm install
4. create folder logs sejajar dengan folder test

Sharp
------------
1. update share for node 14 lts
2. for unix user, make sure g++ and make is installed
    - which g++
    - which make
3. npm install

BRANCH : release/starter_optimization
-------------------------------------
Version :
NPM  => 8.19.2
Node => v18.12.1
NVM  => 1.1.10

1. Change
   - change snake to camel case at controller, cron, libs, queries, and core
   - change regular function to arrow function at route, libs, validator, assets (main.js), core (middlewares.js), general.js

2. Adjust
   - in get article detail (cms - article) add '/' on call url image, video and cover
   - in get event detail (cms - event)  add '/' on call url image
   - in datatable event (cms - event) add '/' on call url image
   - in event manage (cms - event) add '/' on image upload path
   - in datatable image (cms - upload_image) add '/' on call url image
   - in manage image (cms - upload_image) adjust action url
   - remove function get_data_user_by_id in user queries because found double function
   - views (upload_image.js) change url button add

3. Update
   - package.json
     log4js(3.0.5) => log4js(6.7.0)
     pug(2.0.4) => pug(3.0.2)
     sharp(0.23.2) => sharp(0.31.2)
     validator(9.4.0) => validator(13.7.0)
     mocha(5.2.0) => mocha(10.1.0)

4. Install
   - Install on device ImageMagick (ImageMagick-7.1.0-51-Q16-HDRI-x64-dll)
     Url Download : https://drive.google.com/file/d/19TcFLMcUoepFDv9KqqjHRzXDIfxy0KhZ/view?usp=share_link

5. Noted 
   New Install in package.json
   - express-fileupload
   - mv
   - npm #   p r e m i r o - n o d e j s  
 