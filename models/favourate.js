const { default: mongoose } = require("mongoose");

const favourateSchema = mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "homeModel",
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("Favourate", favourateSchema);
/*
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
*/
