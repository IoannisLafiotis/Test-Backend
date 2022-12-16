import express, { Request, Response } from 'express';
import { User } from '../models/user';

const userRouter = express.Router();

userRouter.get('/users', async (req: any, res: any) => {
  const users = await User.find({});
  return res.status(200).send(users);
});

userRouter.post('/users', async (req: any, res: any) => {
  const user = req.body;
  const propArray: string[] = ['name', 'adresse', 'email', 'birthDate'];
  if (propArray.some((o) => user[o] === undefined || user[o] === '')) {
    return res.status(400).send({ message: 'All of the fields must be present! Try again!' });
  }
  const existingUser = User.findOne({ email: user.email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email adress already exists!' });
  }
  const newUser = User.build(user);
  await newUser.save();
  return res.status(201).send(newUser);
});

module.exports = { userRouter };
