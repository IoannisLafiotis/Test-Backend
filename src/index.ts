const { User } = require('./models/user');
const express = require('express');
const { json } = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors')


const app = express();
app.use(json());
app.use(cors())

app.get('/users', async (req: any, res: any) => {
  const users = await User.find({});
  return res.status(200).send({users});
});

app.post('/users', async (req: any, res: any) => {
  const user = req.body;
  const propArray: string[] = ['name', 'adresse', 'email', 'birthDate'];
  if (propArray.some((o) => user[o] === undefined || user[o] === '')) {
    return res.status(400).send({ message: 'All of the fields must be present! Try again!' });
  } 
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email adress already exists!' });
  }
    const newUser = new User(user);
    newUser.save();
    return res.status(201).send(newUser);
  
});

if (process.env.CONDITION === 'dev') {
  mongoose.connect(
    process.env.MONGO_DEV_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('connected to database');
    }
  );
}
app.listen(3000, () => {
  console.log('server is listening to port 3000!');
});

module.exports = app;
