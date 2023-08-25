import { readJson } from '../../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJson('./movies.json')

function unsuccessfully ({ message }) {
  return { success: false, error: { error: message } }
}

function successfully ({ data }) {
  return { success: true, data }
}

export class MovieModel {
  static async getAll ({ genre }) {
    if (!genre) return successfully({ data: movies })

    const filteredMovies = movies.filter(mov => {
      return mov.genre.some(movSome => movSome.toLowerCase() === genre.toLowerCase())
    })

    if (filteredMovies.length < 1) return unsuccessfully({ message: 'No movies related to the category were found' })
    return successfully({ data: filteredMovies })
  }

  static async getById ({ id }) {
    const movie = movies.find(mov => mov.id === id)

    if (!movie) return unsuccessfully({ message: 'the movie related to the id does not exist' })

    return successfully({ data: movie })
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    movies.push(newMovie)
    console.log(newMovie)
    return successfully({ data: newMovie })
  }
}
