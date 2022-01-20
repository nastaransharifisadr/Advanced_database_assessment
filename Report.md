# Analysis 

There are two Actor in this project:
* Admin
* User

A user Must be abled to :
* viewing price lists 
* Sending Request for any bookings
* sending any enqueries 
* adding reviews

An admin must be abled to:
* Login
* add/delete price lists
* update services information
* viewing emails
* view/delete reviews
* add/remove Admin

There is one No-relational Database for this project: Salon database
salon database includes 5 collections:
* services
* bookings
* enqueries
* reviews
* admins

# collection's details
Services collection includes all information about services:
|feild name      | Type
|----------------|--------
|Service_name    | Text
|price           | number

Bookings collection includes everything related to a booking request:
|feild name      | Type
|----------------|--------
|name            | Array
|Email           | Text
|Address         | Array
|contact_num     | Text
|Type_service    | text
|date_request    | date

 

Enqueries collection includes all client's questions:
|feild name      | Type
|----------------|--------
|name            |Array
|Email           |Text
|Enquery         |Text

Review collection includes:
|feild name      | Type
|----------------|--------
|name            |Array
|Review          |Text

Admin collection includes all admin's username and password:
|feild name      | Type
|----------------|--------
|user_name       |Text
|Pasword         |Text


# Envirenment
VS-CODE has been used to developing the project. Also, Mongo DB has been used for implementing the database. 

# Installing independecies










