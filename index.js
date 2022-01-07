const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 8000;

//midalware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhafc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

  try {
    await client.connect();
    const database = client.db("educalCourses");
    const coursesCollection = database.collection("all-courses");
    const eventsCollection = database.collection("all-events");
    const blogsCollection = database.collection("all-blogs");
    const usersColletion = database.collection("users");


    // GET API ALL courses
    app.get('/all-courses', async (req, res) => {
      const cursor = coursesCollection.find({})
      const courses = await cursor.toArray();
      res.send(courses);

    });

    //courses post api here 
    app.post('/all-courses', async (req, res) => {
      const cursor = await coursesCollection.insertOne(req.body);
      res.json(cursor)
    })

    // GET API ALL events
    app.get('/all-events', async (req, res) => {
      const cursor = eventsCollection.find({})
      const events = await cursor.toArray();
      res.send(events);

    });

    // GET API ALL events
    app.get('/all-blogs', async (req, res) => {
      const cursor = blogsCollection.find({})
      const blogs = await cursor.toArray();
      res.send(blogs);
    });


    // GET SINGLE COURSES DATA HERE
    app.get('/courses/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await coursesCollection.findOne(query)
      res.json(booking);
    });

    // GETTING SINGLE EVENT DATA HERE 
    app.get('/events/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await eventsCollection.findOne(query)
      res.json(result)
    })

    // user api
    app.post('/users', async (req, res) => {
      const cursor = await usersColletion.insertOne(req.body);
      res.json(cursor)
    })

    // users put api here 
    app.put('/users', async (req, res) => {
      const query = { email: req.body.email }
      const options = { upsert: true }
      const updateDocs = { $set: req.body }
      const result = await usersColletion.updateOne(query, updateDocs, options)
    })

    // admin api
    app.put('/user/admin', async (req, res) => {
      const query = { email: req.body.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersColletion.updateOne(query, updateDoc);
      res.json(result)
    })

    // users get api 
    app.get('/user/:email', async (req, res) => {
      const user = await usersColletion.findOne({ email: req.params.email });
      let isAdmin = false;
      if (user?.role === 'admin') { isAdmin = true }
      res.json({ admin: isAdmin })
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running the server on educal projects');
})
app.listen(port, () => {
  console.log('Example app listening at', port)
})