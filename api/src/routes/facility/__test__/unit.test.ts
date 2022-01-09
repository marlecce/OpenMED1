import facilitiesData from './facilities.json'
import { Facility } from '../../../models/facility'

import { getCoordinatesByAddress, findNearest, orderByDistance } from '../index'

describe('Facility test suite', function () {
  beforeEach(async () => {
    // create and populate facility collection
    await Facility.insertMany(facilitiesData)
  })

  it('should return the param errors trying to retrieve the coordinates from an address', async () => {
    await expect(getCoordinatesByAddress('')).rejects.toThrow(
      'The input params are invalid: address unavailable'
    )
  })

  it('should return a pair of coordinates, along with the full resolved address', async () => {
    const address = 'via Paolo Fabbri 43, Bologna'

    const response = await getCoordinatesByAddress(address)
    expect(response.latitude).toStrictEqual(44.4949473)
    expect(response.longitude).toStrictEqual(11.3630593)
    expect(response.address).toStrictEqual(
      '43, Via Paolo Fabbri, Cirenaica, San Donato-San Vitale, Bologna, Emilia-Romagna, 40138, Italia'
    )

    // TODO test more addresses --> via fabbri 43 Bologna / via fabbri 43 Bologna 40138
  })

  it('should get the nearest facilities', async () => {
    // get the nearest facilities
    const latitude = 37.7196529
    const longitude = 15.1579192

    const allFacilities = await Facility.find()
    const nearestFacilities = await findNearest(latitude, longitude, allFacilities)

    // check data
    expect(nearestFacilities).toBeDefined()
    expect(nearestFacilities.id).toBeDefined()
    expect(nearestFacilities.name).toStrictEqual('Ospedale Civile')
    expect(nearestFacilities.street).toStrictEqual('Tre Conche')
    expect(nearestFacilities.town).toStrictEqual('Avezzano')
    expect(nearestFacilities.state).toStrictEqual('Abruzzo')
    expect(nearestFacilities.county).toStrictEqual('Aq')
    expect(nearestFacilities.postalcode).toStrictEqual(67051)
  })

  it.only('should order the facilities from the nearest', async () => {
    const latitude = 51.503333
    const longitude = -0.119722
    const allFacilities = await Facility.find()
    const facilities = orderByDistance(latitude, longitude, allFacilities)

    // check data

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
