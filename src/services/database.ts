import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'

export const collections: { movies?: mongoDB.Collection } = {}

export const connectToDatabase = async () => {
    dotenv.config()

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING)
    await client.connect()

    const db: mongoDB.Db = client.db(process.env.DB_NAME)
    await applySchemaValidation(db)
    const moviesCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME)
    collections.movies = moviesCollection

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${moviesCollection.collectionName}`);
}

async function applySchemaValidation(db: mongoDB.Db)  {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'overview', 'release_date', 'rate', 'poster_path'],
            additionalProperties: false,
            properties: {
                _id: {},
                title: {
                    bsonType: 'string',
                    description: `'title' is required and is a string`
                },
                overview: {
                    bsonType: 'string',
                    description: `'overview' is required and is a string`
                },
                release_date: {
                    bsonType: 'number',
                    description: `'release_date' is required and is a number`
                },
                rate: {
                    bsonType: 'number',
                    description: `'rate' is required and is a number`
                },
                poster_path: {
                    bsonType: 'string',
                    description: `'poster_path' is required and is a string`
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

