require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())

const errorHandler = (error, request, response, next) => {
    console.log("Error Handler: ", error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: 'malformated id' })
    }

    next(error)
}

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
    Person.estimatedDocumentCount()
        .then(personsCount => {
            response.send(`
                <div>
                    <p>Phonebook has info for ${personsCount} people</p>
                    <p>${new Date().toString()}</p>
                </div>
            `)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    if(!request.body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if(!request.body.number) {
        return response.status(400).json({error: 'number missing'})
    }
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })
    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    if(!request.body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if(!request.body.number) {
        return response.status(400).json({error: 'number missing'})
    }
    const person = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)  
})