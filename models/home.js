const { default: mongoose } = require("mongoose");
const User = require("./User");

const homeSchema = mongoose.Schema({
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: { type: String, required: true },
  description: { type: String },
});

homeSchema.pre("findOneAndDelete", async function () {
  try {
    const homeId = this.getQuery()._id;
    console.log("homeId from pre hook : ", homeId);

    await User.updateMany(
      { favourate: homeId },
      {
        $pull: { favourate: homeId },
      },
    );
  } catch (err) {
    console.error(
      "Error while deleting favourate documents related to the home:",
      err,
    );
    next(err);
  }
});

module.exports = mongoose.model("homeModel", homeSchema);

/* 
    

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

  static find(callback) {
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
*/
