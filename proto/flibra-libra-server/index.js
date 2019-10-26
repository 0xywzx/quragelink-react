require('dotenv').config()

const PORT = 3005
const HOST = 'localhost'

const app = require('./app')

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST} PORT: ${PORT}`)
})
