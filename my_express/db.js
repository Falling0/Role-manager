// 引入数据库模块
var mysql = require('mysql');

// 构建数据库对象
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'role',
});

// 连接数据库
connection.connect();


// 封装链式操作的数据库处理模块
module.exports = {
    
    where:function(wh) {
        this.wh = wh
        return this;
    },

    select:function(callback) {
        if(this.wh == undefined) {
            var sql = "SELECT * FROM users"
        } else {
            var sql = "SELECT * FROM users WHERE " + this.wh;
        }
        connection.query(sql, function(error, sql_datas) {
            if (error) {
                callback(error);
                return;
            }
            callback(sql_datas);
        });
        this.wh = undefined;
    },

    update:function(data, callback) {
        if(this.wh == undefined) {
            console.log("请加条件！");
            return;
        } else {
            var set = '';
            for(i in data) {
                set += i + "='" + data[i] + "',";
            }
            set = set.slice(0, set.length-1);
            var sql = "UPDATE users SET " + set + " WHERE " + this.wh;
            connection.query(sql, function(error, sql_datas) {
                if(error) {
                    callback(error);
                    return;
                }
                callback(sql_datas.changedRows);
            });
        }
        this.wh = undefined;
    },

    delete:function(callback) {
        if(this.wh == undefined) {
            callback("请添加条件！");
        } else {
            var sql = "DELETE FROM users WHERE " + this.wh;
            connection.query(sql, function(error, sql_datas) {
                if(error) {
                    callback(error);
                    return;
                }
                callback(sql_datas.affectedRows);
            });
        }
        this.wh = undefined;
    },

    insert:function(data_obj, callback) {
        var key = '';
        var value = '';
        for(i in data_obj) {
            key += i + ",";
            value += "'" + data_obj[i] + "',";
        }
        key = key.slice(0, key.length-1);
        value = value.slice(0, value.length-1);
        var sql = "INSERT INTO users(" + key + ") VALUES(" + value + ")";
        connection.query(sql, function(error, sql_datas) {
            if(error) {
                callback(error);
                return;
            }
            callback(sql_datas.affectedRows);
        });
    },

}