import express, { Application } from 'express'
import { connectToDatabase } from './services/database'
import { movies } from './routes/movies'

const app: Application = express()
const port = 8080

connectToDatabase()
  .then(() => {
    app.use('/movies', movies)

    app.listen(port, () => {
      console.log(`Server started at port ${port}`)
    })
  })
  .catch((error: Error) => {
    console.log('Database connection failed', error)
    process.exit()
  })
