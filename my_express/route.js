const express = require('express');         // 导入框架模块
const business = require('./business');     // 导入业务模块（控制器）


// 创建路由对象
const route = express.Router();


// 处理请求
route
.get('/', business.getall)
.get('/get', business.getOne)
.get('/edit', business.getEditData)
.get('/delete', business.delete)
.get('/add', business.showAdd)
.post('/insert', business.insert)
.post('/update', business.getUpdate)
.get('/login', business.showLogin)
.post('/check_login', business.check_login)

// 封装路由模块
module.exports = route;