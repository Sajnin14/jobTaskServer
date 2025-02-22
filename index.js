require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// midleWare

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4adud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4adud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    
    
    const database = client.db("jobTask");
    const userCollection = database.collection("job-users");
    const tasksCollection = database.collection("tasks");
    
    app.get('/users', async(req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
    })
    app.post('/users', async(req, res) => {
        const user = req.body;
        const query = {email : user.email};
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
            return res.send({message: 'user already exist'})
        }

        const result = await userCollection.insertOne(user);
        res.send(result);

    })
    
    app.get('/GET/tasks', async(req, res) => {
        const result = await tasksCollection.find().toArray();
        res.send(result);
    })

    app.get('/GET/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await tasksCollection.findOne(query);
      res.send(result);
      // const query
    })

    app.get('/GET/tasks/:category', async(req, res) => {
      const taskCategory = req.params.category;
      console.log(taskCategory);
      const query = {category: taskCategory};
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/POST/tasks', async(req, res) => {
        const body = req.body;
        const result = await tasksCollection.insertOne(body);
        res.send(result);
    })

    app.patch('/PUT/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const body = req.body;
      const updateDoc = {};

      if(body.title){updateDoc.title = body.title};
      if(body.description){updateDoc.description = body.description};
      if(body.category){updateDoc.category = body.category};
      
      const result = await tasksCollection.updateOne(filter, { $set: updateDoc});
      res.send(result);
    
    })

    app.delete('/DELETE/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job tasks server is running');
})

app.listen(port, () =>{
    console.log('server is running at port: ', port);
})