const express = require('express')
const app = express()
const session = require('express-session') // session管理
const cors = require('cors') // 解决跨域
const bodyParser = require('body-parser') // 解析POST请求数据
const cookieParser = require('cookie-parser') // 第三方cookie操作模块，方便操作客户端中的cookie值
const path = require('path')
const blog = require('./api/blog.js')
const test2 = require('./api/test2.js')


var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCors);//使用跨域中间件


app.use(session({
  secret: '8023',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../dist'))) // 部署上线时读取静态文件
app.use('/api/blog', blog);
app.use('/api/test2', test2);

app.listen(3000)
console.log('success listen at port:3000......')
