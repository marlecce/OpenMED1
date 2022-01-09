import { geoServer } from '../geoServer'

/**
 *
 * @param {string} rawName
 * @returns
 */
function trasformFacilityName(rawName: string) {
  return rawName
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Transform data provided from CSV to be compliance to the openmed-app
 * @param {*} rawData
 */
async function transformData(rawData: any) {
  // coordinates from address
  const transformedData = await Promise.all(
    rawData.map(async (raw: any) => {
      const state = trasformFacilityName(raw.state)
      const town = trasformFacilityName(raw.town)
      const postalcode = raw.postalcode
      const county = trasformFacilityName(raw.county)
      const name = trasformFacilityName(raw.name)
      const street = raw.street
      const email = raw.email
      const domainIdentifier = raw.domainIdentifier
      let latitude = raw.latitude
      let longitude = raw.longitude

      const country = !raw.country ? 'IT' : raw.country
      const addressToSearch = `${street}, ${postalcode}, ${town}, ${country}`

      const results = await geoServer.search({ q: addressToSearch })

      if (results && results[0]) {
        latitude = results[0].lat
        longitude = results[0].lon
      } else {
        // trying to broaden the search

        const broadenAddressToSearch = `${town}, ${county}, ${country}`

        console.info(
          `Unable to find geo data for the following address: ${JSON.stringify(
            addressToSearch
          )}, so trying to broaden the search: ${JSON.stringify(broadenAddressToSearch)}`
        )

        const broadenResults = await geoServer.search({ q: broadenAddressToSearch })
        if (broadenResults && broadenResults[0]) {
          latitude = broadenResults[0].lat
          longitude = broadenResults[0].lon
        } else {
          console.error(
            `Unable to find geo data for the following address: ${JSON.stringify(
              broadenAddressToSearch
            )} `
          )
        }
      }

      raw.name = name
      raw.email = email
      raw.street = street
      raw.town = town
      raw.state = state
      raw.county = county
      raw.postalcode = postalcode
      raw.country = country
      raw.domainIdentifier = domainIdentifier
      raw.latitude = latitude
      raw.longitude = longitude

      return raw
    })
  )

  return transformedData
}

export { transformData }
