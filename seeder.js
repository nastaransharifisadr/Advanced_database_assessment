
const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI } = process.env;



const uri = "mongodb://localhost:27017/salon";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const users = await db.collection("Users").find({}).count();
    const services = await db.collection("Services").find({}).count();
    const bookings = await db.collection("Bookings").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (users) {
      db.dropDatabase();
    }
    if (services) {
        db.dropDatabase();
    }
    if (bookings) {
        db.dropDatabase();
    }


    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your Database 🍷!!").start();

    /**
     * Import the JSON data into the database
     */

    const usersdata = await fs.readFile(path.join(__dirname, "users.json"), "utf8");
    const servicessdata = await fs.readFile(path.join(__dirname, "services.json"), "utf8");
    const bookingssdata = await fs.readFile(path.join(__dirname, "bookings.json"), "utf8");
    await db.collection("Users").insertMany(JSON.parse(usersdata));
    await db.collection("Services").insertMany(JSON.parse(servicessdata));
    await db.collection("Bookings").insertMany(JSON.parse(bookingssdata));

    /**
     * This perhaps appears a little more complex than it is. Below, we are
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */

    const salonCusmersRef = await db.collection("customers").aggregate([
      { $match: { customer_name: { $ne: null } } },
      {
        $group: {
          _id: "$customer_name",
          twitter: { $first: "$taster_twitter_handle" },
          tastings: { $sum: 1 },
        },

      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          twitter: '$twitter',
          tastings: '$tastings'
        },
      },
    ]);
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const wineTasters = await wineTastersRef.toArray();
    await db.collection("tasters").insertMany(wineTasters);

    /** This data manipulation is to reference each document in the
     * tastings collection to a taster id. Further to this we also take the opportunity to
     * tidy up points (converting it to a int) and regions, adding them to a an array
     */

    const updatedWineTastersRef = db.collection("tasters").find({});
    const updatedWineTasters = await updatedWineTastersRef.toArray();
    updatedWineTasters.forEach(async ({ _id, name }) => {
      await db.collection("tastings").updateMany({ taster_name: name }, [
        {
          $set: {
            taster_id: _id,
            regions: ["$region_1", "$region_2"],
            points: { $toInt: "$points" },
          },
        },
      ]);
    });


    /**
     * we can get rid of region_1/2 off our root document, since we've
     * placed them in an array
     */
    await db
      .collection("tastings")
      .updateMany({}, { $unset: { region_1: "", region_2: " " } });

    /**
     * Finally, we remove nulls regions from our collection of arrays
     * */
    await db
      .collection("tastings")
      .updateMany({ regions: { $all: [null] } }, [
        { $set: { regions: [{ $arrayElemAt: ["$regions", 0] }] } },
      ])


    db.collection("tastings").aggregate([
      { $group: { _id: "$variety" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "varieties" }
    ]).toArray();

    db.collection("tastings").aggregate([
      { $group: { _id: "$country" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "countries" }
    ]).toArray()



    await db.collection("tastings").aggregate([
      { $group: { _id: "$province" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "provinces" }
    ]).toArray()

    await db.collection("tastings").aggregate([
      { $unwind: "$regions" },
      { $group: { _id: "$regions" } },
      { $project: { name: '$_id', _id: 0 } },
      { $out: "regions" }
    ]).toArray();


    await db.collection("tastings").aggregate([
      { $unwind: "$regions" },
      { $group: { _id: "$regions" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "regions" }
    ]).toArray()



    load.stop();
    console.info(
      `Wine collection set up! 🍷🍷🍷🍷🍷🍷🍷 \n I've also created a tasters collection for you 🥴 🥴 🥴`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
