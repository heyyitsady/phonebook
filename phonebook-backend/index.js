require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// render frontend
app.use(express.static('dist'))

// allow cross origin requests
app.use(cors())

// parse incoming json data
app.use(express.json())

// log request information to the console
// eslint-disable-next-line no-unused-vars
morgan.token('data', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

// Get all phonebook entries
app.get('/api/people', (req, res) => {
	Person.find({}).then(result => {
		res.json(result)
	})
})

// Info page
app.get('/info', (req, res, next) => {
	const time = new Date()[Symbol.toPrimitive]('string')

	Person.countDocuments({})
		.then(count => {
			res.send(`
				<p>Phonebook has info for ${count} people<p>
				<p>${time}</p>
			`)
		})
		.catch(error => next(error))
})

// Get indidual phonebook entry
app.get('/api/people/:id', (req, res, next) => {
	const id = req.params.id

	Person.findById(id)
		.then((person) => {
			res.json(person)
		})
		.catch((error) => next(error))
})

// Delete phonebook entry
app.delete('/api/people/:id', (req, res, next) => {
	const id = req.params.id
	// find the object by its id in parameters and remove it from the database
	Person.findByIdAndRemove(id)
		// eslint-disable-next-line no-unused-vars
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

// Add entry to the phonebook
app.post('/api/people', (req, res, next) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'Name and number are required'
		})
	}

	const person = new Person({
		number: body.number,
		name: body.name,
	})

	person.save().then(savedPerson => {
		res.json(savedPerson)
	})
		.catch(error => next(error))
})

// Update an entry in the phonebook
app.put('/api/people/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	const id = req.params.id

	Person.findByIdAndUpdate(
		id,
		person,
		{ new: true, runValidators: true, context: 'query' },
	)
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`)
})
