const { testUsers } =  require("./testUsers");
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/index');
const { User } = require('../src/models/user');
const request = supertest(app);


describe('User API endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(
      'mongodb+srv://IoannisLafiotis:h74t0lSzfeHkYML5@cluster0.hpq7s.mongodb.net/testingphase?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    await User.deleteMany({});
  });
  beforeEach(async () => {
    await User.deleteMany({});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('GET | get all users from database', async () => {
    for (const testUser of testUsers) {
      const newUser = {
        name: testUser.name,
        adresse: testUser.adresse,
        email: testUser.email,
        birthDate: testUser.birthDate,
      };
      await request.post('/users').send({...newUser});
    }
    const res = await request.get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBe(testUsers.length);
    expect(res.body.users[0].name).toBe(testUsers[0].name);
  });
  test('POST | fail the user because the name property is empty', async () => {
    const res = await request
      .post('/users')
      .send({ name: '', email: 'testmail@mail.com', birthDate: '2001-07-25T14:10:26.113Z', adresse: 'adrese3' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All of the fields must be present! Try again!');
  });
  test('POST | fail the user because the email is empty', async () => {
    const res = await request
      .post('/users')
      .send({ name: 'Author', email: '', birthDate: '2001-07-25T14:10:26.113Z', adresse: 'adrese3' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All of the fields must be present! Try again!');
  });

  test('POST | save user to database with user data', async () => {
    const res = await request
      .post('/users')
      .send({ name: 'AUTHOR', email: 'testmail@mail.com', birthDate: '2000-01-24T14:10:26.113Z', adresse: 'adrese3' });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('testmail@mail.com');
    expect(res.body.name).toBe('AUTHOR');

    const savedUser = await User.findById(res.body._id);
    expect(savedUser.email).toBe(res.body.email);
    expect(savedUser.name).toBe(res.body.name);
    const resFromGet = await User.find({});
    expect(resFromGet.length).toBe(1);
  });
});
