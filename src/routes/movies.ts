import express, { Request, Response } from 'express'
import { collections } from '../services/database'

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
