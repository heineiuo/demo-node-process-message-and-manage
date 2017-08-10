const express = require('express')
const morgan = require('morgan')
const path = require('path')

const getChildMsg = require('./manage')

const app = express()

app.use(morgan('dev'))

app.use(async (req, res, next) => {
  try {
    const result = await getChildMsg(path.resolve('./service.js'), {
      body: req.body,
      query: req.query
    })
    res.json(result)
  } catch(e){
    next(e)
  }
})

app.use((err, req, res, next) => {
  console.log(err)
  res.json({error: err.name})
})

app.use((req, res) => {
  res.json({error: 'NotFoundError'})
})

app.listen(8080, () => console.log('listening on port 8080'))

