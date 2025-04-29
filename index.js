require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

let persons = [
  // { 
  //   "id": "3",
  //   "name": "Dan Abramov", 
  //   "number": "12-43-234345"
  // },
  // { 
  //   "id": "4",
  //   "name": "Mary Poppendieck", 
  //   "number": "39-23-6423122"
  // },
  // {
  //   "id": "5",
  //   "name": "Barack Obama",
  //   "number": "160-01-160016"
  // },
  // {
  //   "id": "6",
  //   "name": "Beyonce Knowles",
  //   "number": "008-08-008008"
  // }
]

const password = process.argv[2]

app.use(express.static('dist'))
app.use(express.json())

let info = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
`

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content=length] :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    person 
      ? response.json(person) 
      : response.status(404).end()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.deleteOne({ _id: id }).then(person => {
    response.json(person)
  })

  // response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // const submittedName = body.name
  // const currentNames = [...persons.filter(person => person.name === submittedName)]
  // if (currentNames.length > 0 && submittedName === currentNames[0].name) {
  //   return response.status(409).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(person)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})