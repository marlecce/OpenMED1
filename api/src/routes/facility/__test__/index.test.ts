import {
  getCoordinatesByAddress,
  getNearestFacilities,
  orderByDistance,
  getAllFacilities,
} from '../index'

describe('Facility test suite', function () {
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

  it('should get the nearest facilities', () => {
    // get the nearest facilities
    const latitude = 38.6111
    const longitude = -90.3225
    const nearestFacilities = getNearestFacilities(latitude, longitude)

    // check data
    expect(nearestFacilities).toBeDefined()
    console.log(nearestFacilities)
    // expect(nearestFacilities.id).toStrictEqual(10)
    // expect(nearestFacilities.name).toStrictEqual('Alcon Laboratories, Inc.')
    // expect(nearestFacilities.address.street).toStrictEqual('7 Di Loreto Park')
    // expect(nearestFacilities.address.town).toStrictEqual('Saint Louis')
    // expect(nearestFacilities.address.state).toStrictEqual('Missouri')
    // expect(nearestFacilities.address.county).toStrictEqual('MO')
    // expect(nearestFacilities.address.postalCode).toStrictEqual('63143')
  })

  it.skip('should order the facilities from the nearest', () => {
    const latitude = 38.6111
    const longitude = -90.3225
    const facilities = orderByDistance(latitude, longitude, getAllFacilities)

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
