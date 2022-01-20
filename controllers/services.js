const Services = require("../models/Services");
const bodyParser = require("body-parser");
const { findById } = require("../models/Services");

exports.list = async(req,res) => {
  console.log(req.session);

    try 
    {
    const services =await Services.find({});
    console.log(services);
    res.render("view-services",{services:services});

    }catch(e){
    res.status(404).send ({ message: "could not list Services" });
    console.log(e);
    } 
};


exports.delete = async(req,res)=>{
    const id = req.params.id;
  try {
    await Services.findByIdAndRemove(id);
    res.redirect("/services");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const services = new Services({ service_name: req.body.service_name, price: req.body.price });
    await services.save();
    res.redirect('/services/?message=taster has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-services', { errors: e.errors })
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
      const services = await Services.findById(id);
      console.log(services);
      res.render('update-services', {services:services, id: id });
    } catch (e) {
      res.status(404).send({
    message: `could find services ${id}.`,
      });
      console.log(e);
    }
  };
  
  exports.update = async (req, res) => {
    const id = req.params.id;
    try {
      const services = await Services.updateOne({ _id: id }, req.body);
      res.redirect('/services/?message=services has been updated');
    } catch (e) {
      res.status(404).send({
        message: `could find services ${id}.`,
      });
    }
  };