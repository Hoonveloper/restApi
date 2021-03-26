var express = require('express');
const app = express();
const router = require('./router/main.js');
app.use(express.json());



app.use('/', router);
app.set('views',__dirname);
app.engine('html',require('ejs').renderFile);
app.listen(5000, (req, res) => {
    console.log("서버 실행중..");
});