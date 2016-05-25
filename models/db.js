var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});

//MongoClient.connect('mongodb://'+settings.host+'/'+settings.db,function(err,db){
//    if(!err){
//        console.log("MongoDB connected");
//    }
//})