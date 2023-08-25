import { Router } from 'express'
import { MovieController } from '../controlllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)

moviesRouter.get('/:id', MovieController.getById)

moviesRouter.post('/', MovieController.create)

moviesRouter.put('/', MovieController.update)

moviesRouter.patch('/:id', MovieController.updatePartial)

moviesRouter.delete('/:id', MovieController.delete)
