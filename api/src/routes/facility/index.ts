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
function getAllFacilitiesCoordinates() {
  return Facility.find().select('-_id latitude longitude')
}

/**
 * GET /v1/facilities?id=
 * @returns
 */
async function getFacilityById(facilityId: string) {
  // TODO check mongo ID
  if (facilityId.match(/^[0-9a-fA-F]{32}$/)) {
    return Facility.findById(facilityId)
  } else {
    throw Error(`The param value ${facilityId} is not a valid id value`)
  }
}

/**
 * Finds the single one nearest point to a reference coordinate.
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} facilities
 */
async function findNearest(latitude: number, longitude: number, facilities: any) {
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
}

/**
 *
 * @param {*} latitude
 * @param {*} longitude
 * @returns
 */
async function getNearestFacilities(latitude: number, longitude: number) {
  if (!longitude || !latitude) {
    throw Error('The input params are invalid: longitude or latitude unavailable')
  }

  // get facilities
  const facilities = await getAllFacilities()

  // get nearest facilities
  const nearestFacility = findNearest(latitude, longitude, facilities)

  // return closest facility
  return nearestFacility
}

/**
 *
 * @param {*} params
 * @returns
 */
// async function getFacilities({ id: string, latitude: number, longitude: number }) {
//   let facilities = null
//   if (id) {
//     // get facility
//     facilities = await getFacilityById(id)
//   } else if (latitude && longitude) {
//     // get nearest facilities
//     facilities = await getNearestFacilities(latitude, longitude)
//   } else {
//     // get all the facilities
//     facilities = await getAllFacilities()
//   }

//   return {
//     payload: facilities,
//   }
// }

/**
 *
 * @param {*} params
 */
async function getCoordinatesByAddress(params: any) {
  // check params
  if (!params) {
    throw Error('The input params are undefined')
  }
  if (!params.address) {
    throw Error('The input params are invalid: address unavailable')
  }

  const addressToSearch = params.address
  const results = await geoServer.search({ q: addressToSearch })

  // for now we get the place with the greatest value in "importance" attribute
  const firstResult = results[0]

  // return coordinates
  return {
    status: 'OK',
    payload: {
      latitude: firstResult.lat,
      longitude: firstResult.lon,
      address: firstResult.display_name,
    },
  }
}

// webpack
// global.main = getCoordinatesByAddress

// webpack
// global.main = getFacilities

// jest

export { getCoordinatesByAddress, getNearestFacilities, orderByDistance, router as facilityRouter }
