const mongo = require("mongodb");
const pass = "cherRy78";
const URL = `mongodb://cherryyob:cherRy78@ac-ejfildg-shard-00-00.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-01.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-02.gftiffm.mongodb.net:27017/?ssl=true&replicaSet=atlas-inztl9-shard-0&authSource=admin&appName=compliteCoding`;
let _db;
const mongoConnect = (callback) => {
  mongo.MongoClient.connect(URL)
    .then((client) => {
      callback();

      _db = client.db("airbnb");
    })
    .catch((err) => {
      console.log("error while connecting mongo", err);
    });
};
const getDB = () => {
  if (_db) {
    return _db;
  } else {
    console.log("connection not succed");
  }
};
exports.getDB = getDB;
exports.mongoConnect = mongoConnect;
