var mongodb = require('./db');
var crypto = require('crypto');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//儲存用户信息
User.prototype.save = function(callback) {
  var md5 = crypto.createHash('md5'),
      email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
      head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
  //要存入資料庫的用戶信息檔案
  var user = {
      name: this.name,
      password: this.password,
      email: this.email,
      head: head
  };
  //打開資料庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//錯誤，返回 err 信息
    }
    //讀取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//錯誤，返回 err 信息
      }
      //將用戶數據插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]);//成功！err 為 null，並返回儲存後的戶檔案
      });
    });
  });
};

//讀取用戶信息
User.get = function(name, callback) {
  //打開資料庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//錯誤，返回 err 信息
    }
    //讀取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//錯誤，返回 err 信息
      }
      //查找用戶名（name键）值為 name 的檔案
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失敗！返回 err
        }
        callback(null, user);//成功！返回查詢的用戶信息
      });
    });
  });
};
