const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// meddle ware 
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2amfc4s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    // taskCollection 
    const taskCollection = client.db("TO-DO-App").collection("tasks");



    // get all task 
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    // get task by id 
    app.get("/taskById/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    // post task in Database 
    app.post("/tasks", async (req, res) => {
      const taskData = req.body;
      const result = await taskCollection.insertOne(taskData);
      res.send(result);
    });

    // update mark as completed
    app.patch("/isCompleted/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body 
      console.log(data);
      const query = { _id: new ObjectId(id) };

      if(data.agreement === false){
        const updateDoc={
          $set:{
            isCompleted : 'Completed'
          }
        }
        const result = await taskCollection.updateOne(query,updateDoc)
        res.send(result)
      }
    });

    // update task by id 
    app.patch("/taskEdit/:id", async (req, res) => {
      const id = req.params.id;
      
      const taskData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: taskData.title,
          des: taskData.des,
          isPrority: taskData.isPrority,
        },
      };
      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Delete task by id 
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running... ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
