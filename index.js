require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
    Person.estimatedDocumentCount()
        .then(personsCount => {
            response.send(`
                <div>
                    <p>Phonebook has info for ${personsCount} people</p>
                    <p>${new Date().toString()}</p>
                </div>
            `)
        })
        .catch(error => {
            console.log("Error when counting amount of people: ", error.message)
            response.send(`
                <div>
                    <p>It was not possible to obtain the amount of persons in the phonebook</p>
                    <p>${new Date().toString()}</p>
                </div>
            `)
        })
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
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => console.log("Error while fetching persons: ", error.message))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => {
            console.log("Error while fetching person: ", error.message)
            response.status(404).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter((p) => p.id !== Number(request.params.id))
    response.status(204).end()
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)  
})