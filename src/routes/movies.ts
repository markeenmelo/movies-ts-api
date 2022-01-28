import express, { Request, Response } from 'express'
import { collections } from '../services/database'
import {ObjectId} from 'mongodb'

export const movies = express.Router()

movies.use(express.json())

movies.get('/', async (_req: Request, res: Response) => {
    try {
        const movies = await collections.movies.find({}).toArray()

        res.status(200).send(movies)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

movies.get('/:id', async (req: Request, res: Response) => {
    const id = req?.params?.id
    try {
        const query = { _id: new ObjectId(id) }
        const movie = await collections.movies.findOne(query)

        if (movie) res.status(200).send(movie)

    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`)
    }
})
