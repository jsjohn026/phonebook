const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  person 
    ? response.json(person) 
    : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0 
    ? Math.max(...persons.map(n => Number(n.id))) 
    : 0
  
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const submittedName = body.name
  const currentNames = [...persons.filter(person => person.name === submittedName)]
  if (currentNames.length > 0 && submittedName === currentNames[0].name) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
