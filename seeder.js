
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
    const users = await db.collection("users").find({}).count();
    const services = await db.collection("services").find({}).count();
    const bookings = await db.collection("bookings").find({}).count();

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
    const load = loading("importing your Database !!").start();

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
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */

   
 

     const updatedusersRef = db.collection("Users").find({});
     const updatedusers = await updatedusersRef.toArray();
     updatedusers.forEach(async ({ _id, name }) => {
       await db.collection("Bookings").updateMany({ user_name: name }, [
         {
           $set: {
             user_id: _id,
             user_name: ["$firstname", "$lastname"],
           },
         },
       ]);
     });


   
    await db
      .collection("Users")
      .updateMany({}, { $unset: { firstname: "", lastname: " " } });

    



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
