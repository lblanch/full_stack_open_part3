const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(response => console.log("Connection to MongoDB successful"))
    .catch(error => console.log("Error connecting to MongoDB: ", error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Must have at least 3 characters.'],
        unique: true,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: value => value.match(/\d/g).length > 7,
            message: props => "Must have at least 8 digits."
        },
        required: true
    }
})

personSchema.set('toJSON', { transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)
