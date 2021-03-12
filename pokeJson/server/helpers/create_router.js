const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

    const router = express.Router();

    //INDEX
    router.get('/', (req, res) => {
        collection
        .find()
        .toArray()
        .then((docs) => res.json(docs))
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({status:500, error: err});
        });
    });

    //SHOW
    router.get('/:id', (req, res) => {
        const id = req.params.id;
        collection
        .findOne({ _id: ObjectID(id)})
        .then((doc) =>res.json(doc))
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err});
        });
    });

    //CREATE
    router.post('/', (req, res) => {
        const newData = req.body;
        collection
        .insertOne(newData)
        .then((result) => {
            res.json(result.ops[0])
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err});
        });
    });

    //DESTROY 
    router.delete('/:id', (req, res) =>{
        const id = req.params.id;
        collection.deleteOne({ _id:ObjectID(id)})
        .then((result) =>{
            res.json(result)
        })
        .catch((err) =>{
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err });
        });
    });

    //UPDATE WINS
    router.put('/updatewins', (req, res) =>{
        const name = req.body.name;
        const updatedData = req.body;
        console.log(updatedData);
        collection
        .findOneAndUpdate(
            {name: name},
            {$inc: {wins: 1, played: 1}},
            {returnOriginal: false}
        )
        .then((result) => {
            res.json(result.value)
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err});
        });
    });

    //UPDATE LOSSES 
    router.put('/updatelosses', (req, res) =>{
        const name = req.body.name;
        const updatedData = req.body;
        console.log(updatedData);
        collection
        .findOneAndUpdate(
            {name: name},
            {$inc: {losses: 1, played: 1}},
            {returnOriginal: false}
        )
        .then((result) => {
            res.json(result.value)
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err});
        });
    });
    return router;
};

module.exports = createRouter;

