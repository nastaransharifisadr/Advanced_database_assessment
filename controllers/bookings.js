const Bookings = require("../models/Bookings");
const bodyParser = require("body-parser");
const { findById } = require("../models/Bookings");

exports.list = async(req,res) => {

    try 
    {
    const bookings = await Bookings.find({});
    res.render("bookings",{bookings:bookings});

    }catch(e){
    res.status(404).send ({ message: "could not list Bookings" });
    } 
};


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

exports.create = async (req, res) => {
  try {

    const bookings = await Bookings.findById(req.body.bookings_id);
    await Bookings.create({
      service_name: req.body.service_name,
      firstname: bookings.firstname,
      lastname: bookings.lastname,
      email: bookings.email,
      daterequest: bookings.daterequest,
      bookings_id: req.body.bookings_id,
    })
    console.log(bookings)

    res.redirect('/bookings/?message=bookings has been created')
  } catch (e) {
    if (e.errors) {
      res.render('create-bookings', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}



exports.delete = async(req,res)=>{
    const id = req.params.id;
  try {
    await Bookings.findByIdAndRemove(id);
    res.redirect("/bookings");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};



  
  
  exports.update = async (req, res) => {
    const id = req.params.id;
    try {
      const bookings = await Bookings.updateOne({ _id: id }, req.body);
      res.redirect('/bookings/?message=bookings has been updated');
    } catch (e) {
      res.status(404).send({
        message: `could find booking ${id}.`,
      });
    }
  };