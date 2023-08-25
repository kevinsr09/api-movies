import express from 'express'

import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(corsMiddleware())
app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send('<h1>hello word</h1>')
})

app.use('/movies', moviesRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'page no fount' })
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log('R', PORT)
})
