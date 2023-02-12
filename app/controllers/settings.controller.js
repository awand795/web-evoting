const db = require('../models')
const Settings = db.settings;

exports.getSettingsStatus = (req,res) =>{
    Settings.find({},(err,data)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({data:data})
    })
}

exports.editSettings = (req,res) => {
    const id = req.body.id;
    Settings.findByIdAndUpdate(id,req.body,(err,data) => {
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"Success",data:data})
    })
}