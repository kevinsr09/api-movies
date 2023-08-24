import express from 'express'
import { createRequire } from 'node:module'
import cors from 'cors'
import crypto from 'node:crypto'
import { validateDataMovie, validatePartialDataMovie } from './schemas/movieSchema.js'

const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>hello word</h1>')
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(mov => {
      return mov.genre.some(movSome => movSome.toLowerCase() === genre.toLowerCase())
    })
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(mov => mov.id === id)

  if (!movie) return res.status(404).json({ error: 'Movie not fount' })
  res.json(movie)
})

app.post('/movies', (req, res) => {
  const movieData = req.body

  const aceptedMovie = validateDataMovie(movieData)

  if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

  const newMovie = {
    id: crypto.randomUUID(),
    ...aceptedMovie.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.put('/movies', (req, res) => {
  const { id } = req.body

  if (!id) return res.status(404).json({ error: 'id is required' })

  const movie = movies.findIndex(movie => movie.id === id)
  if (movie < 0) return res.status(404).json({ error: 'Movie not fount' })

  const movieData = req.body

  const aceptedMovie = validateDataMovie(movieData)
  if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

  const newDataMovie = {
    id,
    ...aceptedMovie.data
  }

  movies[movie] = newDataMovie

  res.status(201).json(newDataMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params

  const indexMovie = movies.findIndex(movie => movie.id === id)
  if (indexMovie < 0) return res.status(404).json({ error: 'Movie not fount' })

  const movieData = req.body

  const aceptedMovie = validatePartialDataMovie(movieData)
  if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

  const newDataMovie = {
    ...movies[indexMovie],
    ...aceptedMovie.data
  }

  movies[indexMovie] = newDataMovie
  res.status(201).json(newDataMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params

  const indexMovie = movies.findIndex(movie => movie.id === id)
  if (indexMovie < 0) return res.status(404).json({ error: 'Movie not fount' })

  movies.splice(indexMovie, 1)

  res.json({ message: 'movie deleted' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'page no fount' })
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log('R', PORT)
})
