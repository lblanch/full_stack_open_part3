const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people
            <p>${new Date().toString()}</p>
        </div>
    `)
})

app.post('/api/persons', (request, response) => {
    if(!request.body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if(!request.body.number) {
        return response.status(400).json({error: 'number missing'})
    }
    if(persons.find((p) => p.name === request.body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: request.body.name,
        number: request.body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find((p) => p.id === Number(request.params.id))
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter((p) => p.id !== Number(request.params.id))
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)  
})