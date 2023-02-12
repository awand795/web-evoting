const db = require('../models')
const Kandidat = db.kandidat;

exports.createKandidat = (req, res) => {
    const kandidat = new Kandidat({
        nourut:req.body.nourut,
        nama:req.body.nama,
        visi:req.body.visi,
        misi:req.body.misi
    })

    kandidat.save((err,data=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "successfully!" });
    }))
}

exports.getAllKandidat = (req,res) =>{
    Kandidat.find({},(err,data)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({data:data})
    })
}

exports.getFindKandidat = (req,res) =>{
    const id = req.body.id;
    Kandidat.find({_id:id},(err,data)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({data:data})
    })
}

exports.editKandidat = (req,res) => {
    const id = req.body.id;
    Kandidat.findByIdAndUpdate(id,req.body,(err,data) => {
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"Success",data:data})
    })
}

exports.deleteKandidat = (req,res) => {
    const id = req.body.id;
    Kandidat.findByIdAndDelete(id,(err) => {
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"Success"})
    })
}