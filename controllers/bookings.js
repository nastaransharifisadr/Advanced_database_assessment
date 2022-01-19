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


exports.create = async (req, res) => {

    try {
      await Bookings.create({ 
        service_name:req.body.service_name,
        email:req.body.email,
        daterequest: req.body.daterequest
      })
      res.redirect('/bookings/?message=bookings record has been created')
    } catch (e) {
      if (e.errors) {
        console.log(e.errors);
        res.render('create-bookings', { errors: e.errors })
        return;
      }
      return res.status(400).send({
        message: JSON.parse(e),
      });
    }
  }
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