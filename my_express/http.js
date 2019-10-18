const express = require('express');     // 导入框架模块
const route = require('./route');       // 导入路由模块
const cookieSession = require('cookie-session');   // 导入cookie、session模块


// 框架对象
const app = express();

// 引入cookie-session
app.use(cookieSession({
    name:'cookie',
    keys:['value'],
}));

// 引入模板模块
app.engine('html', require('express-art-template'));

// 引入静态文件
app.use(express.static('public'));

// 引用外置路由
app.use(route);

// 监听端口
app.listen(8888, function() {
    console.log('please open localhost:8888');
});
