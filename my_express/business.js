var db = require('./db');                   // 导入数据模块
var url = require('url');                   // 导入url模块
var querystring = require('querystring');
const formidable = require('formidable');   // POST数据处理
const fs = require('fs');                   // 文件系统


// 封装业务
module.exports = {

    // 显示登陆页
    showLogin:function(request, response) {
        response.render('./login.html', {});
    },

    // 登录请求处理
    check_login:(request, response)=>{
        var form = new formidable.IncomingForm();
        form.parse(request, (error, fields)=>{
            if(fields.username == 'admin' && fields.password == 'admin') {
                 request.session.data = fields;
                 var backstr = "<script>alert('登录成功。');window.location.href='./'</script>";
                 response.setHeader('Content-Type', 'text/html;charset=utf-8');
                 response.end(backstr);   
            }
        });
    },
    
    // 获取全部数据
    getall:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }

        db.select(function(datas) {
            // 构建渲染视图的模块
            response.render('./index.html', {data:datas});
        });
    },

    // 获取指定数据
    getOne:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }

        var urlObj = url.parse(request.url, true);
        db.where('id='+urlObj.query.id).select(function(datas) {
            response.render('./detailed.html', {data:datas});
        });
    },

    // 显示修改页面
    getEditData:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }

        var urlObj = url.parse(request.url, true);
        db.where('id='+urlObj.query.id).select(function(datas) {
            response.render('./edit.html', {data:datas});
        });
    },

    // 更新数据
    getUpdate:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }
        
        // 创建formidable对象        
        var form = new formidable.IncomingForm();

        form.parse(request, (error, fields, files)=>{
            // 时间戳
            var times = new Date().getTime();
            // 组装上传路径
            var file_path = "./public/img/" + times + files.img.name;
            // 将缓存文件移动至指定的public目录
            fs.rename(files.img.path, file_path, (error)=>{
                var urlObj = url.parse(request.url, true);
                if(!error) {
                    // 数组添加图片
                    fields.img = "./img/" + times + files.img.name;
                    db.where('id='+urlObj.query.id).update(fields, (datas)=>{
                        if(datas >= 1) {
                            var backstr = "<script>alert('修改成功');window.location.href='./'</script>";
                            response.setHeader('Content-Type', 'text/html;charset=utf-8');
                            response.end(backstr);
                        } else {
                            var backstr = "<script>alert('没有改变或者出现错误');window.location.href='./'</script>";
                            response.setHeader('Content-Type', 'text/html;charset=utf-8');
                            response.end(backstr);                    
                        }                     
                    });
                } else {
                    var backstr = "<script>alert('出现错误');window.location.href='./'</script>";
                    response.setHeader('Content-Type', 'text/html;charset=utf-8');
                    response.end(backstr);                       
                }
            });
        });


        // var data_post = '';
        // request.on('data', function(che) {
        //     data_post += che;
        // });
        // request.on('end', function() {
        //     var urlObj = url.parse(request.url, true);
        //     // 将获取到的post数据序列化
        //     var data_obj = querystring.parse(data_post);
        //     db.where('id='+urlObj.query.id).update(data_obj, function(datas) {
        //         if(datas >= 1) {
        //             var backstr = "<script>alert('修改成功');window.location.href='./'</script>";
        //             response.setHeader('Content-Type', 'text/html;charset=utf-8');
        //             response.end(backstr);
        //         } else {
        //             var backstr = "<script>alert('没有改变或者出现错误');window.location.href='./'</script>";
        //             response.setHeader('Content-Type', 'text/html;charset=utf-8');
        //             response.end(backstr);                    
        //         }
        //     });
        // });
        
    },

    // 删除指定数据
    delete:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }

        var urlObj = url.parse(request.url, true);

        db.where('id='+urlObj.query.id).select((datas)=>{
            // 构建需要删除的文件路径
            var img_path = "public" + datas[0].img.slice(1, datas[0].img.length);
            fs.unlink(img_path, (error)=>{
                if(error) {
                    var backstr = "<script>alert(\"" + error + "\");window.location.href='./'</script>";
                    console.log(backstr);
                    response.setHeader('Content-Type', 'text/html;charset=utf-8');
                    response.end(backstr);
                    return;
                } else {
                    db.where('id='+urlObj.query.id).delete(function(datas) {
                        if(datas >= 1) {
                            var backstr = "<script>alert('删除成功。');window.location.href='./'</script>";
                            response.setHeader('Content-Type', 'text/html;charset=utf-8');
                            response.end(backstr);
                        } else {
                            var backstr = "<script>alert('删除失败。');window.location.href='./'</script>";
                            response.setHeader('Content-Type', 'text/html;charset=utf-8');
                            response.end(backstr);                           
                        }            
                    });
                }
            });
        });
    },

    // 显示添加页面
    showAdd:function(request, response) {
        // 登录验证
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }
        response.render('./add.html', {data:0});
    },

    // 插入新数据
    insert:function(request, response) {
        if(!request.session.data) {
            var backstr = "<script>alert('请先登录！');window.location.href='./login'</script>";
            response.setHeader('Content-Type', 'text/html;charset=utf-8');
            response.end(backstr);   
        }
        // 创建formidable对象
        var form = new formidable.IncomingForm();

        form.parse(request, function(error, fields, files) {
            // 时间戳
            var times = new Date().getTime();
            // 组装上传路径
            var file_path = "./public/img/" + times + files.img.name;
            // 将缓存文件移动至指定的public目录
            fs.rename(files.img.path, file_path, (error)=>{
                if(!error) {
                    // 因为设置静态资源时，已经时public文件夹，写入数据库时，不要加public
                    // 数组添加图片
                    fields.img = "./img/" + times + files.img.name;
                    // 写入数据库
                    db.insert(fields, (datas)=>{
                        if(datas >= 1) {
                            var backstr = "<script>alert('添加成功');window.location.href='./'</script>";
                            response.setHeader('Content-Type', 'text/html;charset=utf-8');
                            response.end(backstr);
                        }                        
                    });
                } else {
                    var backstr = "<script>alert('添加失败！');window.location.href='./'</script>";
                    response.setHeader('Content-Type', 'text/html;charset=utf-8');
                    response.end(backstr);                    
                }
            });
        });


        // var data_post = '';
        // request.on('data', function(che) {
        //     data_post += che;
        // });
        // request.on('end', function() {
        //     var data_obj = querystring.parse(data_post);
        //     db.insert(data_obj, function(datas) {
        //         if(datas >= 1) {
        //             var backstr = "<script>alert('添加成功');window.location.href='./'</script>";
        //             response.setHeader('Content-Type', 'text/html;charset=utf-8');
        //             response.end(backstr);
        //         }
        //     });
        // });

    },

}



