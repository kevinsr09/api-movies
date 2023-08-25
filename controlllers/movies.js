import { validateDataMovie, validatePartialDataMovie } from '../schemas/movieSchema.js'

import { MovieModel } from '../models/local-file-system/movie.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const result = await MovieModel.getAll({ genre })

    if (!result.success) return res.status(404).json(result.error)
    res.json(result.data)
  }

  static async getById (req, res) {
    const { id } = req.params

    const result = await MovieModel.getById({ id })

    if (!result.success) return res.status(404).json(result.error)

    res.json(result.data)
  }

  static async create (req, res) {
    const movieData = req.body

    const aceptedMovie = validateDataMovie(movieData)

    if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

    const result = await MovieModel.create({ input: aceptedMovie.data })

    res.status(201).json(result.data)
  }

  static async update (req, res) {
    const { id } = req.body

    if (!id) return res.status(404).json({ error: 'id is required' })

    const movieData = req.body

    const aceptedMovie = validateDataMovie(movieData)
    if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

    const newDataMovie = await MovieModel.update({ id, input: aceptedMovie.data })

    if (!newDataMovie.success) return res.status(404).json(newDataMovie.error)

    res.status(201).json(newDataMovie.data)
  }

  static async updatePartial (req, res) {
    const { id } = req.params

    const movieData = req.body

    const aceptedMovie = validatePartialDataMovie(movieData)
    if (!aceptedMovie.success) return res.status(404).json(JSON.parse(aceptedMovie.error.message))

    const newDataMovie = await MovieModel.update({ id, input: aceptedMovie.data })

    if (!newDataMovie.success) return res.status(404).json(newDataMovie.error)

    res.status(201).json(newDataMovie.data)
  }

  static async delete (req, res) {
    const { id } = req.params

    const movie = await MovieModel.delete({ id })

    if (!movie.success) return res.status(404).json(movie.error)

    res.json({ message: movie.message })
  }
}
