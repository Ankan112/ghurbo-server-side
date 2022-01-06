const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjdqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    try {
        await client.connect();
        const database = client.db("ghurbo");
        const packageCollection = database.collection("packageInfo");
        const orderCollection = database.collection("orders")
        // create POST api
        app.post('/package', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage)
            res.json(result)
        })
        // POST api and create order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder)
            res.json(result)
        })
        // get my orders
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = orderCollection.find({ email: email })
            const orders = await cursor.toArray();
            res.send(orders)
        })
        // get all orders
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.send(orders)
        })
        // Get api
        app.get('/package', async (req, res) => {
            const cursor = packageCollection.find({})
            const packages = await cursor.toArray();
            res.send(packages)
        })
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const result = await packageCollection.find({ _id: ObjectId(id) }).toArray()
            res.send(result)
        })
        // delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result);
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('howw node ')
})
app.listen(port, () => {
    console.log('Lintening to port', port)
})