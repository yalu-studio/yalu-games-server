const { setupDB } = require('../setup');
const request = require('supertest')
const app = require('../../app')
const User = require('../../models/User')

setupDB('test-auth');

describe('Signup', () => {
  it("Should save user to database", async done => {
    // User 1
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    let user = await User.findOne({ email: "test@gmail.com" });
    expect(user.email).toBe('test@gmail.com')
    expect(user.username).toBe('test')
    expect(user.role).toBe('user')
    expect(user.isActive).toBe(true)
    expect(user.userNum).toBe(0)

    // User 2
    res = await request(app).post("/signup").send({
      email: "user@gmail.com",
      password: "123",
      username: "user"
    });
    expect(res.status).toBe(200)

    user = await User.findOne({ email: "user@gmail.com" });
    expect(user.email).toBe('user@gmail.com')
    expect(user.username).toBe('user')
    expect(user.userNum).toBe(1)

    done();
  });

  it("Should fail when email is duplicate", async done => {
    // User 1
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    let user = await User.findOne({ email: "test@gmail.com" });
    expect(user.email).toBe('test@gmail.com')
    expect(user.username).toBe('test')
    expect(user.role).toBe('user')
    expect(user.isActive).toBe(true)
    expect(user.userNum).toBe(0)

    // User 2
    res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "user"
    });
    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Email already exists.")

    done();
  });

  it("Should fail when username is duplicate", async done => {
    // User 1
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    let user = await User.findOne({ email: "test@gmail.com" });
    expect(user.email).toBe('test@gmail.com')
    expect(user.username).toBe('test')
    expect(user.role).toBe('user')
    expect(user.isActive).toBe(true)
    expect(user.userNum).toBe(0)

    // User 2
    res = await request(app).post("/signup").send({
      email: "user@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Username already exists.")

    done();
  });
})

describe('Login', () => {
  it("Should login with correct credential", async done => {
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    res = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "123"
    });
    expect(res.status).toBe(200)

    done();
  });

  it("Should fail login with incorrect password", async done => {
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    res = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "abc"
    });
    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Incorrect email/ password.")

    done();
  });

  it("Should fail login with invalid user", async done => {
    let res = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "123",
      username: "test"
    });
    expect(res.status).toBe(200)

    res = await request(app).post("/login").send({
      email: "user@gmail.com",
      password: "abc"
    });
    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Incorrect email/ password.")

    done();
  });
})
