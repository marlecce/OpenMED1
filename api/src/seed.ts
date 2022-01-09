require('dotenv').config()

import mongoose from 'mongoose'
import fs from 'fs-extra'

import { Facility } from './models/facility'
import { User } from './models/user'
import { transformData } from './routes/facility/utils/etl-json'
import facilitiesData from './routes/facility/__test__/facilities.json'

/**
 *
 */
const populateUsers = async function () {
  console.log(`Droping users....`)
  await User.deleteMany({})

  console.log(`Inserting user....`)
  const userEmail = 'user@openmed.test'
  const userPassword = 'password'
  const user = User.build({ email: userEmail, password: userPassword })
  await user.save()
  console.log(`User inserted!`)
}

/**
 *
 */
const populateFacilities = async function () {
  console.log(`Droping facilities....`)
  await Facility.deleteMany({})

  const transformedData = await transformData(facilitiesData)

  console.log(`Inserting facilities....`)
  await Facility.insertMany(transformedData)

  console.log(`Facilities inserted!`)
}

/**
 *
 */
const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    const openmedMongo = await mongoose.connect(process.env.MONGO_URI)
    const databaseName = openmedMongo.connection.db.databaseName
    console.log(`Connected to MongoDb database: ${databaseName}`)

    // users
    await populateUsers()

    // facilities
    await populateFacilities()

    await mongoose.disconnect()
  } catch (err) {
    console.error(err)
  }

  process.exit(1)
}

runSeed()
