import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'
import Movie from '../models/movie'

export const collections: { movies?: mongoDB.Collection<Movie> } = {}

export const connectToDatabase: () => Promise<void> = async () => {
  dotenv.config()

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING)
  await client.connect()

  const db: mongoDB.Db = client.db(process.env.DB_NAME)
  await applySchemaValidation(db)
  const moviesCollection = db.collection<Movie>(process.env.COLLECTION_NAME)
  collections.movies = moviesCollection

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${moviesCollection.collectionName}`)
}

const applySchemaValidation = async (db: mongoDB.Db) => {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'overview', 'release_date', 'rate', 'poster_path'],
      additionalProperties: false,
      properties: {
        _id: {},
        title: {
          bsonType: 'string',
          description: '\'title\' is required and is a string'
        },
        overview: {
          bsonType: 'string',
          description: '\'overview\' is required and is a string'
        },
        releaseDate: {
          bsonType: 'number',
          description: '\'releaseDate\' is required and is a number'
        },
        rate: {
          bsonType: 'number',
          description: '\'rate\' is required and is a number'
        },
        poster: {
          bsonType: 'string',
          description: '\'poster\' is required and is a string'
        }
      }
    }
  }

  await db.command({
    collMod: process.env.COLLECTION_NAME,
    validator: jsonSchema
  }).catch(async (error: mongoDB.MongoServerError) => {
    if (error.codeName === 'NamespaceNotFound') {
      await db.createCollection(process.env.COLLECTION_NAME, { validator: jsonSchema })
    }
  })
}
