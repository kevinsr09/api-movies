import { Router } from 'express'
import { readJson } from '../utils.js'
import { validateDataMovie, validatePartialDataMovie } from '../schemas/movieSchema.js'
import { MovieModel } from '../models/local-file-system/movie.js'

const movies = readJson('./movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const result = await MovieModel.getAll({ genre })

  if (!result.success) return res.status(404).json(result.error)
  res.json(result.data)
})

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  const result = await MovieModel.getById({ id })

  if (!result.success) return res.status(404).json(result.error)

  res.json(result.data)
})

moviesRouter.post('/', async (req, res) => {
  const movieData = req.body

  const aceptedMovie = validateDataMovie(movieData)

  if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

  const result = await MovieModel.create({ input: aceptedMovie.data })

  res.status(201).json(result.data)
})

moviesRouter.put('/', (req, res) => {
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

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params

  const indexMovie = movies.findIndex(movie => movie.id === id)
  if (indexMovie < 0) return res.status(404).json({ error: 'Movie not fount' })

  movies.splice(indexMovie, 1)

  res.json({ message: 'movie deleted' })
})
