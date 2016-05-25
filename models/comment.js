var mongodb = require('./db');

function Comment(name, day, title, comment) {
  this.name = name;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = Comment;

//儲存一條留言信息
Comment.prototype.save = function(callback) {
  var name = this.name,
      day = this.day,
      title = this.title,
      comment = this.comment;
  //打開資料庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //讀取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //透過用戶名、時間及標題尋找檔案，並把一條留言對象添加到該檔案的 comments 數組裡
      collection.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $push: {"comments": comment}
      } , function (err) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null);
      });   
    });
  });
};
