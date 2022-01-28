import express, { Request, Response, Router } from 'express'
import { collections } from '../services/database'
import {ObjectId} from 'mongodb'

export const movies: Router  = express.Router()

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
        res.status(404).send({
            message: `unable to find matching document with id: ${req.params.id}`
        })
    }
})

movies.post('/', async (req: Request, res: Response) => {
    try {
        const newMovie = req.body
        const result = await collections.movies.insertOne(newMovie)
        result
            ? res.status(201).send({
                message: `successfully inserted a new movie with id ${result.insertedId}`
            })
            : res.status(500).send({
                message: 'failed to insert new movie'
            })
    } catch (error) {
        console.error(error.message)
        res.status(400).send({
            message: error.message
        })
    }
})
