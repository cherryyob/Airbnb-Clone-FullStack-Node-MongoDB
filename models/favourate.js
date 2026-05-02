const { deleteFavourateById } = require("./home");
const { getDB } = require("../utils/databaseUtil");
const { ObjectId } = require("mongodb");

module.exports = class Favourate {
  constructor(houseId) {
    this.homeId = houseId;
  }

  static removeFaourate(id) {
    const db = getDB();
    return db
      .collection("favourate")
      .deleteOne({ homeId: id })
      .then((rst) => console.log(rst));
  }
  save() {
    const db = getDB();
    return db
      .collection("favourate")
      .findOne({ homeId: this.homeId })
      .then((exist) => {
        if (exist) {
          console.log("exist ", exist);
        } else {
          db.collection("favourate").insertOne({ homeId: this.homeId });
          console.log("note: ", exist, this.homeId);
        }
      });
  }

  static getFavoraties = () => {
    const db = getDB();
    return db.collection("favourate").find().toArray();
  };
  static deleteFavourateById(id) {}
};
