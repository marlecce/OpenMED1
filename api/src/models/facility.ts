import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a new Facility
interface FacilityAttrs {
  name: string
  email: string
  street: string
  town: string
  state: string
  county: string
  postalCode: number
}

// An interface that describes the properties
// that a Facility Model has
interface FacilityModel extends mongoose.Model<FacilityDoc> {
  build(attrs: FacilityAttrs): FacilityDoc
  getAllFacilities(): Promise<FacilityDoc[] | null>
}

// An interface that describes the properties
// that a Facility Document has
interface FacilityDoc extends mongoose.Document {
  name: string
  email: string
  street: string
  town: string
  state: string
  county: string
  postalCode: number
  domain_identifier: string
  latitude: number
  longitude: number
}

const FacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    domain_identifier: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

FacilitySchema.statics.build = (attrs: FacilityAttrs) => {
  return new Facility(attrs)
}
/**
 * Get all the available facilities in the Facility collection
 * @returns
 */
FacilitySchema.statics.getAllFacilities = async function () {
  return this.find()
}

const Facility = mongoose.model<FacilityDoc, FacilityModel>('Facility', FacilitySchema)

export { Facility, FacilityDoc }
