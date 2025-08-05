/* jshint esversion: 8 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pinoLogger = require('./logger')
const path = require('path')

const connectToDatabase = require('./models/db')
const {loadData} = require("./util/import-mongo/index");
const secondChanceRoutes = require('./routes/secondChanceItemsRoutes')
const authRoutes = require('./routes/authRoutes')
const searchRoutes = require('./routes/searchRoutes')
const pinoHttp = require('pino-http')
const logger = require('./logger')
const app = express()
// app.use('*', cors())

const corsOptions = {
  origin: [
    'https://dongxiaoli94-9000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai',
    'https://dongxiaoli94-3000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai',
    'http://localhost:3000',
  ],
  credentials: true,
};

app.use(cors(corsOptions)); // ✅ 不要加 "*"
  
const port = 3060

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
  pinoLogger.info('Connected to DB')
})
  .catch((e) => console.error('Failed to connect to DB', e))

app.use(express.json())

// Route files


app.use(pinoHttp({ logger }))
app.use(express.static(path.join(__dirname, 'public')))

// Use Routes
app.use('/api/secondchance/items', secondChanceRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/secondchance/search', searchRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

app.get('/', (req, res) => {
  res.send('Inside the server')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})