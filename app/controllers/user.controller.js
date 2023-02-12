const db = require('../models')
const User = db.user;

exports.getAllUser = (req,res) =>{
    User.find({},(err,data)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({data:data})
    })
}

exports.getFindUser = (req,res) =>{
    const id = req.body.id;
    User.find({_id:id},(err,data)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({data:data})
    })
}

exports.editUser = (req,res) => {
    const id = req.body.id;
    User.findByIdAndUpdate(id,req.body,(err,data) => {
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"Success",data:data})
    })
}

exports.deleteUser = (req,res) => {
    const id = req.body.id;
    User.findByIdAndDelete(id,(err) => {
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"Success"})
    })
}