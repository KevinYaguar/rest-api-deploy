import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
const PORT = process.env.PORT ?? 1234
const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/movies', moviesRouter)

app.use(json())

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
