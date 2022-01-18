const Users = require("../models/User");


exports.list = async(req,res) => {

    try 
    {
    const users = Users.find({});
    res.render("users",{users:users});

    }catch(e){
    res.status(404).send ({ message: "could not list users" });
    } 
};


exports.delete = async(req,res)=>{
    const id = req.params.id;
  try {
    await users.findByIdAndRemove(id);
    res.redirect("/users");
  } catch (e) {
    res.status(404).send({
      message: `could not delete users ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

    try {
      const users = new Users({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        typeofuser:req.body.typeofuser
      });
      await users.save();
      res.redirect('/users/?message=user has been created')
    } catch (e) {
      if (e.errors) {
        console.log(e.errors);
        res.render('create-user', { errors: e.errors })
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
      const users = await Users.findById(id);
      res.render('update-user', { users: users, id: id });
    } catch (e) {
      res.status(404).send({
        message: `could find user ${id}.`,
      });
    }
  };
  
  exports.update = async (req, res) => {
    const id = req.params.id;
    try {
      const users = await Users.updateOne({ _id: id }, req.body);
      res.redirect('/user/?message=user has been updated');
    } catch (e) {
      res.status(404).send({
        message: `could find user ${id}.`,
      });
    }
  };