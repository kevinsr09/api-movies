import express from 'express'
import { createRequire } from 'node:module'
import cors from 'cors'
import z from 'zod'
import crypto from 'node:crypto'

const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()

app.use(cors())
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

  if (!movie) return
  res.json(movie)
})

app.post('/movies', (req, res) => {
  const movieData = req.body
  console.log(movieData)
  const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'Movie title must be a string',
      required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
      message: 'Poster must be a valid URL'
    }),
    genre: z.array(
      z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
      {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of enum Genre'
      }
    )
  })

  const aceptedMovie = movieSchema.safeParse(movieData)
  if (!aceptedMovie.success) return res.status(404).json(aceptedMovie.error.message)

  movies.push({
    ...movieData,
    id: crypto.randomUUID
  })
  res.status(201).json(movieData)
})

app.put('/movies', (req, res) => {

})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log('R', PORT)
})
