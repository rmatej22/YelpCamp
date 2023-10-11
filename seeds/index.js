const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "64fc5f75bde7c642d428c2af",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem incidunt sapiente, sequi quia soluta cum. Itaque molestias odio delectus cumque.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202],
      },
      images: [
        {
          url: "https://res.cloudinary.com/drtnaw44y/image/upload/v1697011442/YelpCamp/fz8egixuu3pvv0j4xbdy.jpg",
          filename: "YelpCamp/fz8egixuu3pvv0j4xbdy",
        },
        {
          url: "https://res.cloudinary.com/drtnaw44y/image/upload/v1697011445/YelpCamp/rtaajg8ot2qkxcvol8os.jpg",
          filename: "YelpCamp/rtaajg8ot2qkxcvol8os",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
