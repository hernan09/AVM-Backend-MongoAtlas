const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
const User = require('./model');
const uri = "mongodb+srv://herno09:herno09@cluster0-4tgm0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
const app = express();

const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader('Content-Type', 'application/json')
  
    next()
  })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
/*
mongoose.connect(uri, { useNewUrlParser: true ,useUnifiedTopology: true},(err)=>{
     if(err){
         console.log(err)
     }else{
        console.log('db conected')
        app.listen(port,(err)=>{
            if(err)console.log(err);
            console.log(`http://localhost:${port}`)
        })
     }
  
})
*/

var database, collection;

app.listen(port, () => {
    MongoClient.connect(uri, { useNewUrlParser: true,useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db('test');
        collection = database.collection("import");      
        console.log(`http://localhost:${port}`);
        
    });
});

app.get('/cuentas',(req,res)=>{
 
  collection.find({}).toArray((err,result)=>{
    if(err){
      return res.status(500).send(err)
    }else{
      res.status(200).send(result);
    }
  })
 
})

app.get(`/cuentas/:id`, (request, response) => {
  let id = request.params.id
  collection.findOne({ "_id": new ObjectId(id) }, (error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});

app.post("/add", (request, response) => {
  collection.insertOne(request.body, (error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result.result);
  });
});

app.delete('/cuentas/:id',(req,res) => {
  let id = req.params.id
  collection.deleteOne({ "_id": new ObjectId(id)},(error, result) => {
    if (error) {
      res.status(500).send(error)
    }else{
      res.status(200).send(result)
    }
   
      
});
})

app.put("/cuentas/:id", (req, res) => {
  const itemId = req.params.id;
  const item = req.body;
  console.log("Editing item: ", itemId, " to be ", item);
  //es clave incorporar el objeto new object id
  collection.updateOne({ "_id": new ObjectId(itemId) }, { $set: item }, (error, result) => {
      if (error) throw error;
      console.log(result)
      // send back entire updated list, to make sure frontend data is up-to-date
      collection.find().toArray((_error, _result) => {
          if (_error) throw _error;
          res.json(_result);
      });
  });
});