
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
    const user = await db.collection("user").find({}).count();
    const services = await db.collection("services").find({}).count();
    const bookings = await db.collection("bookings").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (user) {
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
    const load = loading("importing your Database !!").start();

    /**
     * Import the JSON data into the database
     */

    const userdata = await fs.readFile(path.join(__dirname, "user.json"), "utf8");
    const servicessdata = await fs.readFile(path.join(__dirname, "services.json"), "utf8");
    const bookingssdata = await fs.readFile(path.join(__dirname, "bookings.json"), "utf8");
    await db.collection("user").insertMany(JSON.parse(userdata));
    await db.collection("services").insertMany(JSON.parse(servicessdata));
    await db.collection("bookings").insertMany(JSON.parse(bookingssdata));

    /**
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */

   
 

     const updateduserRef = db.collection("User").find({});
     const updateduser = await updateduserRef.toArray();
     updateduser.forEach(async ({ _id, name }) => {
       await db.collection("bookings").updateMany({}, [
         {
           $set: {
             user_id: _id,
           },
         },
       ]);
     });


   
    await db
      .collection("user")
      .updateMany({}, { $unset: { email: "", password: " " } });

    



    load.stop();
    console.info(
      `Data updated!`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
    console.log(e);
  }
  
}

main();
