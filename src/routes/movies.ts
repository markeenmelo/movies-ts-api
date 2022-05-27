import express, { Request, Response, Router } from 'express'
import { collections } from '../services/database'
import { ObjectId } from 'mongodb'
import moviesJson from '../utils/seed.json'

export const movies: Router = express.Router()

movies.use(express.json())

movies.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await collections.movies.find({}).toArray()
    res.status(200).send(movies)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

movies.get('/seed', async (_req: Request, res: Response) => {
  try {
    await collections.movies.insertMany(moviesJson)
    res.status(200).send('Seeded')
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

movies.put('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const updatedMovie = req.body
    const query = { _id: new ObjectId(id) }
    const result = await collections.movies.updateOne(query, { $set: updatedMovie })
    result
      ? res.status(200).send({
        message: `successfully updated movie with id: ${id}`
      })
      : res.status(304).send({
        message: `movie with id ${id} not updated`
      })
  } catch (error) {
    console.error(error.message)
    res.status(400).send({
      message: error.message
    })
  }
})

movies.delete('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const query = { _id: new ObjectId(id) }
    const result = await collections.movies.deleteOne(query)

    if (result && result.deletedCount) {
      res.status(202).send({
        message: `movie with id ${id} removed`
      })
    }
    if (!result) {
      res.status(400).send({
        message: `movie with id ${id} failed to be removed`
      })
    }
    if (!result.deletedCount) {
      res.status(404).send({
        message: `movie with id ${id} not found`
      })
    }
  } catch (error) {
    console.error(error.message)
    res.status(400).send({
      message: error.message
    })
  }
})
