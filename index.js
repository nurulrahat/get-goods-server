const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT||5000
const cors= require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
app.use(bodyParser.json())
app.use(cors())
console.log(process.env.DB_Name)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hi7wk.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
client.connect(err => {
  const productCollection = client.db("getGoods").collection("products");
 const orderCollection= client.db("getGoods").collection("orders");
 
  app.post("/admin",(req, res)=>{
    const product =req.body;
    productCollection.insertOne(product)
    .then(result=>{
      res.send(result.insertedCount>0)
      console.log("inserted count",result)
    })

    console.log('adding new product: ',product)
  })
  
  app.get("/products",(req, res) =>{
    productCollection.find()
    .toArray((err, items) =>{
      console.log(items)
      res.send(items)
    })
  })

  app.get("/checkout/:id",(req, res) =>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, items) =>{
      //console.log(items[0])
      res.send(items[0])
    })
  })

  app.delete('/delete/:id',(req, res)=>{
    // console.log(req.params.id);
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      console.log(result)
      res.send(result.deletedCount>0)
    })
  })

//orders database 

  app.post("/insertOrder",(req, res)=>{
    const product =req.body;
    orderCollection.insertOne(product)
    .then(result=>{
      res.send(result.insertedCount>0)
      console.log("inserted count",result)
    })
  // client.close();
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})