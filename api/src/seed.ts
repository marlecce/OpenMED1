require('dotenv').config()

import mongoose from 'mongoose';

import { Facility } from './models/facility'
import facilitiesData from './routes/facility/__test__/facilities.json'

/**
 * 
 */
 const populateFacilities = async function () {
    console.log(`Inserting facilities....`)
    await Facility.insertMany(facilitiesData)
    console.log(`Facilities inserted!`)
}

/**
 * 
 */
const runSeed = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDb');

        // facilities
        populateFacilities()

        await mongoose.disconnect()

      } catch (err) {
        console.error(err);
      }

      process.exit(1)
}

runSeed()
