import request from 'supertest'

import { app } from '../../../app'
import facilitiesData from './facilities.json'
import { Facility } from '../../../models/facility'

describe('Facility test suite', function () {
  beforeEach(async () => {
    // create and populate facility collection
    await Facility.insertMany(facilitiesData)
  })

  it('should fetch all the facilities', async () => {
    // get the cookie
    const cookie = await global.signin()

    // make the request to fetch all the facilities
    const { body: fetchedFacilities } = await request(app)
      .get(`/v1/facilities`)
      .set('Cookie', cookie)
      .send()
      .expect(200)

    expect(fetchedFacilities.length).toBe(293)
  })

  it('should return an unauthorized error fetching all the facility with no login', async () => {
    // make an unauthorized request
    await request(app).get(`/v1/facilities`).send().expect(401)
  })

  it('should return the facility coordinates', async () => {
    // get the cookie
    const cookie = await global.signin()

    // get coordinates by town
    const townToSearch = 'Torino'
    const { body: townCoordinates } = await request(app)
      .get(`/v1/facilities/coordinatesByAddress?address=${encodeURIComponent(townToSearch)}`)
      .set('Cookie', cookie)
      .send()
      .expect(200)

    expect(townCoordinates).toBeDefined()
    expect(townCoordinates.latitude).toStrictEqual(45.0677551)
    expect(townCoordinates.longitude).toStrictEqual(7.6824892)
    expect(townCoordinates.address).toStrictEqual('Torino, Piemonte, Italia')

    // get coordinates by address
    const addressToSearch = 'Via Dei Ponderanesi 2, Biella Piemonte'
    const { body: addressCoordinates } = await request(app)
      .get(`/v1/facilities/coordinatesByAddress?address=${encodeURIComponent(addressToSearch)}`)
      .set('Cookie', cookie)
      .send()
      .expect(200)

    expect(addressCoordinates).toBeDefined()
    expect(addressCoordinates.latitude).toStrictEqual(45.5439946)
    expect(addressCoordinates.longitude).toStrictEqual(8.0624296)
    expect(addressCoordinates.address).toStrictEqual(
      '2, Via dei Ponderanesi, Alberetti, Ponderano, Biella, Piemonte, 13875, Italia'
    )
  })

  it('should return the nearest facility', async () => {
    // get the cookie
    const cookie = await global.signin()

    // get the nearest facility
    const { body: nearestFacility } = await request(app)
      .get(`/v1/facilities/findnearest?latitude=41.543924&longitude=12.285448`)
      .set('Cookie', cookie)
      .send()
      .expect(200)

    console.log(nearestFacility)
  })
})
