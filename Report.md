# Title and Cover Page

    Git Repository: https://github.com/nastaransharifisadr/Advanced_database_assessment.git



# Introduction

In this project, I am going to design a data-driven full stack web-application for my beauty salon. There are a few problems at the moment without having a website:
1. For each client is needed to send the price list indivitually. Whenever any price changes, is needed to update all leaflets and paper price lists. 
1. all bookings are through a phone call or message which is realy slow procedure and takes at least 2 hours a day for the salon owner to answer all their messages to booking an appoinment.

So, the main goals for this assessment are:
1. Having a booking system
1. Showing all the prices
1. Updating price list


# System overview
There are two Actor in this project:

1. Admin
1. client

A client should be abled to :

1. Viewing price list
1. Booking appoinment

An admin must be abled to:
1. Login
1. add/delete/edit price lists(services)    
1. add/remove Admin
1. view

There are three collections in the No-relational database has been considered:
1. User collection which keeps Admin's email/password
1. Bookings collection which keeps's bookings' service name/first name/ last name/ customer's email/ date. 
1. Services which keeps all services' names/ prices
After opening the web-application, clients can see 3 Tabs services' information/ booke an appoinment/ Admin's Login Tab. In bookings page, clinet can see all bookings before they book any appoinment, in order to not having a few appoinment in the same time.


![services](.\pic\1.JPG)

![customer's bookings](.\pic\2.JPG)

![Alt Admin's login](.\pic\3.JPG)

After Admin's Login (Admin's email is nastaransharifisadr2018@gmail.com), a few more pages will be visibled for the admin. In services page, Admin is able to Add a new service using "Create a new service" button, Delete or edit any of services using "Edit/Del" button for each service. 

![Admin's services page](.\pic\4..JPG)

Admin also can see all Bookings with having Edit/Del button for each booking in Check bookings page. Unfortunately, In this page i couldn't find the reason for not showing all bookings here. 

Admin also, can Add another admin or logout.
![Admin's services page](.\pic\5.JPG)


# Key Design Decisions
Mongodb has been used for the project's database as it is easy and quick to use( Actually I didn't have another choice! :D). In order to intracyting with Mongodb, Mongoos has been used.
The application sepereted to three logical components  Using MVC architecture.
In Model folder, all design for collections has been placed. There are 3 collections, then i have 3 models too.
In User.js 2 fields added for the collection.

```JavaScript 
const userSchema = new Schema(
    {
        email: { type: String, required: [true, 'email is required'], unique: true },
        password: { type: String, required: [true, 'password is required'] }
    },
    { timestamps: true }
); 

```
In Bookings.js 5 fields has been places for the bookings collection. 
```Java
const bookingsSchema = new Schema(
  {
    service_name:{type:String, required:[true,'Service Name is required']},
    firstname: { type: String, required:[true,'firstname is required']},
    lastname:{type:String,required:[true,'lastname is required']},
    email: { type: String, required: [true, 'email is required'], unique: true },
    daterequest: {type:Date},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingsSchema);
```
In Services.js 2 fields for the services collections has been placed. 
```Java 
const servicesSchema = new Schema(
    {
        service_name: { type: String, required: [true, 'Service Name is required'] },
        price: { type: Number, required: [true, 'price is required'] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);
```

Controllers in MVC architecture, handles HTTP rquests. for example, in bookings.js, all the operations for handling requests between the users and database has been placed. one of bookings operations is edit. to editing Bookings collection this function can be used. This function renders to update-bookings.ejs.
```Java 
exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const bookings = await Bookings.findById(id);
    res.render('update-bookings', { bookings: bookings, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find booking ${id}.`,
    });
  }
};
```

In Views folder we present data with ejs. for example, in services.ejs, There is there are Html tags. " if (user)" means, if the admin logs in then show the create new service botton.
```
<% if(user) { %>
    <div class="col-md-12 col-md-offset-2  justify-content-center">
      <a role="button" class="btn btn-primary btn-xs" href="/create-services">Create a new service</a> 
    
    </div><%
   }%> 
   ```
In header.ejs to makeing navbar, bellow structure has been used:
```
<div class="navbar-nav">
        <a class="nav-link active" href="/">
         Services<span class="sr-only">(current)</span>
        </a>
        <a class="nav-link" href="bookings"> Create Bookings </a>
      
        <% if(user) { %>
        <a class="nav-link" href="bookings"> Check Bookings</a>
        <a class="nav-link" href="join"> Add Admin </a>
        <a class="nav-link" href="logout"> <%= user.email %> (Logout) </a> <%
        }%> <% if(!user) { %>
        <a class="nav-link" href="login"> Admin </a>
        <% } %>
</div>   
```
This means at the first, only 2 tabs will shown to the user and after admin's login, 4 more pages will be shown to admin.

There are 3 json files in this project "services.json bookings.json and user.json". in these three files, a few documents has been defined. The database in the first loading use this information to filling the database. In the first run is needed to run "node seeder.js" through terminal. "seeder.js" reads json files and fills the database with those json files.
App.js connects the application to Database and applys for the middlewares. All needed routs for all pages in the project made into app.js. each route connects to one ejs page and use on of controllers' functionalities. 
```
app.get("/",homeController.list);
```
For example, above line, defines a root folder for the project that use list functionality in home.js controller. for all of the ejs files is needed to define a path that use a functionality from controller.

# Security
For the security of page, paswords stores in the database using Hash algorithm instead of plain text. for this reason bcrypt used. with pre Schema we hash password before it stores to the database.
```JAVA
userSchema.pre('save', async function (next) {
    console.log(this.password);
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
})
```

# Concolution
In my Data driven full stack web-application, i tried to solve those problems that i have in my workplace. Designing a web application that clients can see all services and prices and also, able to book an appoinment. Admin can login/logout, changing all prices, add service, see all bookings and adding another admin. 
It was a good experience for me to collect all my knowledge that i learnt in this course and make a real worls application. However, there is a few problem in this web-application that I couldn't solve it:
1. After adding new service, my mongo database updates, but it does not apear in my services page.
1. My services page does not shw all prices. 
1. also my bookings page does not show bookings and booking form. 

