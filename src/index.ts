import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config'
import { errorHandler } from './middlewares/error-handler';

// Import Routes
import RequestsRoutes from './routes/RequestsRoutes'

const app: Express = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use(errorHandler)

// Routes
app.use('/requests', RequestsRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})