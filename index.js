const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = "mongodb+srv://DBUSER2:DyGkD57gwktt0etA@cluster0.fshg8yr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const postCollections = client.db('CONNECT').collection('posts')
const usersCollections = client.db('CONNECT').collection('users')
const commentCountCollections = client.db('CONNECT').collection('comment')
async function run() {
  app.post('/posts', async(req, res)=>{
    const data = req.body 
    const result = await postCollections.insertOne(data)
    res.send(result)
  })
  // app.put('/posts/:id', async(req, res)=>{
  //   const id = req.params.id 
  //   const comment = req.body
  //   console.log(comment);
  //   const filter = {_id : ObjectId(id)}
  //   const options = { upsert: true };
  //   const updateDoc = {
  //     $set : {
  //       comment : comment.comment 
  //     }
  //   }
  //   const result = await postCollections.updateOne(filter, updateDoc, options)
  //   res.send(result)
  // })
  app.post('/comment', async(req, res)=>{
    const data = req.body
    const result = await commentCountCollections.insertOne(data)
    res.send(result)
  })
  app.put('/comment/:id', async(req, res)=>{
    const id = req.params.id 
    const userLike = req.body
    console.log(userLike);
    const filter = {postId : id}
    const options = { upsert: true };
    const updateDoc = {
      $set : {
        like : userLike.like + 1
      }
    }
    const result = await commentCountCollections.updateOne(filter, updateDoc, options)
    res.send(result)
  })
  app.get('/comment', async(req, res)=>{
    const id = req.query.id
    const query = {postId : id }
    const result = await commentCountCollections.find(query).toArray()
    res.send(result)
  })
  app.get('/posts', async(req, res)=>{
    const query = {}
    const data = await postCollections.find(query).toArray()
    res.send(data) 
  })
  app.get('/posts/:id', async(req, res)=>{
    const id = req.params.id
    const query = {_id : ObjectId(id)}
    const data = await postCollections.findOne(query)
    res.send(data)
  })
  app.put('/userInfo/:email', async(req, res)=>{
    const user = req.body
    const email = req.params.email 
    const filter = {email : email}
    const options = { upsert: true };
    
    const updateUser = {
      $set : {
        name : user.name ,
        address : user.address,
        email : user.email,
        university : user.university,
        photoURL : user.userPhoto
      }
    }
    const result = await usersCollections.updateOne(filter, updateUser, options)
    res.send(result)
  })
  // app.put('/countLike/:id', async(req, res)=>{
  //   const id = req.params.id 
  //   const count = parseFloat(req.body)
  //   const query = {_id : ObjectId(id)}
  //   const options = { upsert: true };
  //   const upatedDoc = {
  //     $set : {
  //       count : count + 1
  //     }
  //   }
  //   const result = await likeCountCollections.updateOne(query, upatedDoc, options)
  //   res.send(result)
  // })
  app.get('/userInfo', async(req, res)=>{
    const email = req.query.email
    // console.log(email);
    const query = {email : email}
    const result = await usersCollections.findOne(query)
    res.send(result)
  })
}
run().catch(err => console.log(err))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})