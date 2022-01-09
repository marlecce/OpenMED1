import express, { Request, Response } from 'express'
import * as geolib from 'geolib'

import { requireAuth } from '../../common'
import { Facility } from './../../models/facility'
import { geoServer } from './geoServer'

// create the express router
const router = express.Router()

/**
 *
 */
router.get('/v1/facilities/findnearest', requireAuth, async (req: Request, res: Response) => {
  // get the params
  const queryParams = req.query
  if (!queryParams.longitude || !queryParams.latitude)
    throw new Error('The input params are invalid: longitude or latitude unavailable')

  // filter facilities by latitude and logitude
  const latitude = queryParams.latitude as string
  const longitude = queryParams.longitude as string

  // get all facilities
  const facilities = await getAllFacilities()

  // get the nearest facility
  const nearestFacility = await findNearest(parseFloat(latitude), parseFloat(longitude), facilities)

  res.send(nearestFacility)
})

/**
 *
 */
router.get(
  '/v1/facilities/coordinatesByAddress',
  requireAuth,
  async (req: Request, res: Response) => {
    if (!req.query.address) throw new Error('No address to search provided!')

    const addressToSearch = req.query.address as string
    const coordinates = await getCoordinatesByAddress(addressToSearch)
    res.send(coordinates)
  }
)

/**
 *
 */
router.get('/v1/facilities/:facilityId', requireAuth, async (req: Request, res: Response) => {
  const facility = await getFacilityById(req.params.facilityId)
  res.send(facility)
})

/**
 *
 */
router.get('/v1/facilities', requireAuth, async (req: Request, res: Response) => {
  const facilities = await getAllFacilities()
  res.send(facilities)
})

/**
 *
 * @returns
 */
async function getAllFacilities() {
  return Facility.find()
}

/**
 *
 * @returns
 */
async function getFacilityById(facilityId: string) {
  // TODO check mongo ID
  if (true) {
    return Facility.findById(facilityId)
  } else {
    throw Error(`The param value ${facilityId} is not a valid id value`)
  }
}

/**
 *
 * @param {*} params
 */
async function getCoordinatesByAddress(addressToSearch: string) {
  // check params
  if (!addressToSearch) {
    throw Error('The input params are invalid: address unavailable')
  }

  const results = await geoServer.search({ q: addressToSearch })

  // return an empty object if no results are available
  if (results.length === 0) return {}

  // for now we get the place with the greatest value in "importance" attribute
  const firstResult = results[0]

  // return coordinates
  return {
    latitude: parseFloat(firstResult.lat),
    longitude: parseFloat(firstResult.lon),
    address: firstResult.display_name,
  }
}

/**
 * Finds the single one nearest point to a reference coordinate.
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} facilities
 */
async function findNearest(latitude: number, longitude: number, facilities: any) {
  if (!longitude || !latitude) {
    throw Error('The input params are invalid: longitude or latitude unavailable')
  }

  const data: any = geolib.findNearest({ latitude, longitude }, facilities)
  return data
}

/**
 * Sorts an array of coords by distance to a reference coordinate
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} facilities
 */
function orderByDistance(latitude: number, longitude: number, facilities: any) {
  return geolib.orderByDistance({ latitude, longitude }, facilities)
  // return geolib.orderByDistance({ latitude: 51.515, longitude: -0.119722 }, [
  //   { latitude: 52.516272, longitude: 13.377722 },
  //   { latitude: 51.518, longitude: 7.45425 },
  //   { latitude: 51.503333, longitude: -0.119722 },
  // ])
}

// webpack
// global.main = getCoordinatesByAddress

// webpack
// global.main = getFacilities

// jest

export { getCoordinatesByAddress, orderByDistance, findNearest, router as facilityRouter }
