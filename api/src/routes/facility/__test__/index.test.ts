import request from 'supertest';

import { app } from '../../../app';
import facilitiesData from '../../../routes/facility/__test__/facilities.json'
import { Facility } from '../../../models/facility'

import {
  getCoordinatesByAddress,
  getNearestFacilities,
} from '../index'

describe('Facility test suite', function () {
  
  beforeEach(async () => {
    // create and populate facility collection
    await Facility.insertMany(facilitiesData)
  })

  it('should fetch all the facilities', async () => {

    // get the cookie
    const cookie = await global.signin();
   
    // make the request to fetch all the facilities
    const { body: fetchedFacilities } = await request(app)
    .get(`/v1/facilities`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

    expect(fetchedFacilities.length).toBe(10)
  })

  it('should return an unauthorized error fetching all the facility with no login', async () => {
    // make an unauthorized request
    const { body: fetchedFacilities } = await request(app)
    .get(`/v1/facilities`)
    .send()
    .expect(401)
  })

  it('should return the param errors trying to retrieve the coordinates from an address', async () => {
    await expect(getCoordinatesByAddress({ address: '' })).rejects.toThrow(
      'The input params are invalid: address unavailable'
    )

    await expect(getCoordinatesByAddress(null)).rejects.toThrow('The input params are undefined')
  })

  it('should return a pair of coordinates, along with the full resolved address', async () => {
    const params = {
      address: 'via Paolo Fabbri 43, Bologna',
    }
    const response = await getCoordinatesByAddress(params)
    expect(response.status).toStrictEqual('OK')
    expect(response.payload.latitude).toStrictEqual('44.4949473')
    expect(response.payload.longitude).toStrictEqual('11.3630593')
    expect(response.payload.address).toStrictEqual(
      '43, Via Paolo Fabbri, Cirenaica, San Donato-San Vitale, Bologna, Emilia-Romagna, 40138, Italia'
    )
  })

  it.skip('should get the nearest facilities', async () => {
    // get the nearest facilities
    const latitude = 38.6111
    const longitude = -90.3225
    const nearestFacilities = await getNearestFacilities(latitude, longitude)

    // check data
    expect(nearestFacilities).toBeDefined()
    expect(nearestFacilities.id).toBeDefined()
    expect(nearestFacilities.name).toStrictEqual('Alcon Laboratories, Inc.')
    expect(nearestFacilities.street).toStrictEqual('7 Di Loreto Park')
    expect(nearestFacilities.town).toStrictEqual('Saint Louis')
    expect(nearestFacilities.state).toStrictEqual('Missouri')
    expect(nearestFacilities.county).toStrictEqual('MO')
    expect(nearestFacilities.postalCode).toStrictEqual('63143')
  })

  it.skip('should order the facilities from the nearest', () => {
    const latitude = 38.6111
    const longitude = -90.3225
    // const facilities = orderByDistance(latitude, longitude, getAllFacilities)
    const facilities:any = []

    // check data
    expect(facilities).toBeDefined()
    console.log(facilities)
    // expect(Array.isArray(facilities)).toBeTruthy()

    // const firstFacility = facilities[0]
    // expect(firstFacility.id).toStrictEqual(10)
    // expect(firstFacility.name).toStrictEqual('Alcon Laboratories, Inc.')
    // expect(firstFacility.address.street).toStrictEqual('7 Di Loreto Park')
    // expect(firstFacility.address.town).toStrictEqual('Saint Louis')
    // expect(firstFacility.address.state).toStrictEqual('Missouri')
    // expect(firstFacility.address.county).toStrictEqual('MO')
    // expect(firstFacility.address.postalCode).toStrictEqual('63143')

    // expect(facilities[1].id).toStrictEqual(8)
    // expect(facilities[2].id).toStrictEqual(6)
    // expect(facilities[3].id).toStrictEqual(7)
    // expect(facilities[4].id).toStrictEqual(9)
    // expect(facilities[5].id).toStrictEqual(1)
    // expect(facilities[6].id).toStrictEqual(5)
    // expect(facilities[7].id).toStrictEqual(2)
    // expect(facilities[8].id).toStrictEqual(3)
    // expect(facilities[9].id).toStrictEqual(4)
  })
})
