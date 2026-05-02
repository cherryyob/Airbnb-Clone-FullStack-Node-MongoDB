const { ObjectId } = require("mongodb");
const favourateModel = require("../models/favourate");
const { getDB } = require("../utils/databaseUtil");

////////////////////////////////////////////////////////////////

module.exports = class homeModel {
  constructor(_id, homeName, price, location, rating, photo, description) {
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }
  save() {
    const db = getDB();
    if (!this._id) {
      return db
        .collection("homes")
        .insertOne(this)
        .then((results) => {
          console.log(results);
        });
    } else {
      console.log("this is magic", this);
      const updateFields = {
        homeName: this.homeName,
        price: this.price,
        location: this.location,
        rating: this.rating,
        photo: this.photo,
        description: this.description,
      };
      return db
        .collection("homes")
        .updateOne(
          { _id: new ObjectId(String(this._id)) },
          { $set: updateFields },
        );
    }
  }

  static fatchAll(callback) {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static deletePost(homeId, callback) {
    const db = getDB();
    db.collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) })
      .then((result) => result);
  }

  static findById(id, callback) {
    console.log("homeId from findById : ", id);
    const db = getDB();
    db.collection("homes")
      .findOne({ _id: new ObjectId(String(id)) })

      .then((home) => {
        console.log(home, "home from findById");
        callback(home);
      })
      .catch((err) => {
        console.log("error while finding home by id", err);
      });
  }
};
