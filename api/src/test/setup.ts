import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../app'
import facilitiesData from '../routes/facility/__test__/facilities.json'
import { Facility } from '../models/facility'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri)

  // create and populate facility collection
  await Facility.insertMany(facilitiesData)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  // await mongoose.connection.close()
}, 15000)

global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
