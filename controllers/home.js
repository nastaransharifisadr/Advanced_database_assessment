const services = require('../models/Services');

exports.list = async(req,res) => {
    console.log(req.session);
  
      try 
      {
      const services =await services.find({});
      console.log(services);
      res.render("services",{services:services});
  
      }catch(e){
      res.status(404).send ({ message: "could not list Services" });
      console.log(e);
      } 
  };
  