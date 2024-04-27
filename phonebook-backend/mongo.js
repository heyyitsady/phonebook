const mongoose = require("mongoose")

const password = process.argv[2]

const url =
	`mongodb+srv://sazed:${password}@cluster0.d2qo1it.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model("Person", personSchema)

const savePerson = (name, number) => {
	const person = new Person({
		name: name,
		number: number
	})

	// save the person to database and make a 'successful save' log
	person.save().then(result => {
		console.log(`Added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}

const listPersons = () => {
	Person.find({}).then(result => {
		console.log("Phonebook:")
		// log name and number for each person
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}

if (process.argv.length === 5) {
	// get name and number from command line arguments
	const name = process.argv[3]
	const number = process.argv[4]

	savePerson(name, number)
} else if (process.argv.length === 3) {
	listPersons()
} else {
	throw new Error("incorrect number of arguments")
}

