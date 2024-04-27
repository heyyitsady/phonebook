import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'
import personService from './services/people'

function App() {
  const [people, setPeople] = useState([])
  const [filteredPeople, setFilteredPeople] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({
    type: '',
    message: ''
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPeople(initialPeople);
        setFilteredPeople(initialPeople);
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  // Check if the people array contains new person
  const containsPerson = (people, person) => {
    for (let i = 0; i < people.length; i++) {
      // If any person's name in the array matches new person's name,
      // but the number doesn't match
      // update the person's number and return
      if (people[i].name.toLowerCase() === person.name.toLowerCase()) {
        if (people[i].number !== person.number) {
          const updateTheNumber = updateNumber(person, people[i].id)
          if (updateTheNumber) return true
        }
        // If the user doesn't want to update the number, clear input values and return
        window.alert(`${person.name} is already added to the phonebook`)
        setNewName('')
        setNewNumber('')
        return true
      }
    }
    // return false if none of the conditions match
    return false
  }

  const addPhonebookEntry = (event) => {
    event.preventDefault();

    // check if the input is valid
    if (newName === '' || newNumber === '') {
      window.alert("Name and number cannot be empty.")
      return
    }

    const newPerson = { name: newName, number: newNumber }

    // check if the person is already in the people array + update the number
    if (containsPerson(people, newPerson)) return;

    // Create a new person if one isn't already present
    personService
      .create(newPerson)
      .then(returnedPerson => {
        // update people array
        setPeople(people.concat(returnedPerson));
        setFilteredPeople(filteredPeople.concat(returnedPerson));
      })
      .catch(error => {
        setNotification({
          type: 'error',
          message: error.response.data.error
        })
      })

    setNotification({
      type: 'success',
      message: `Added ${newName}`
    })

    setTimeout(() => {
      setNotification({
        type: '',
        message: ''
      })
    }, 5000)

    // clear input values
    setNewName('');
    setNewNumber('');
  }

  const Notification = ({ type, message }) => {
    if (message == null) null

    return (
      <div className={`notification ${type}`} style={message == null ? { display: 'none' } : { display: 'block' }} >
        {message}
      </div>
    )
  }

  const deletePhonebookEntry = (id) => {
    if (!window.confirm(`Delete ${people.find(person => person.id === id).name}?`)) return;

    // delete person with given id
    personService.deleteEntry(id)

    // update people array
    setPeople(people.filter(person => person.id !== id))
    setFilteredPeople(people.filter(person => person.id !== id))
  }

  const updateNumber = (obj, id) => {
    if (!window.confirm(`${obj.name} is already added to the phonebook, replace the old number with a new number?`)) return

    // update person with given id
    personService
      .update(id, obj)
      .then(returnedPerson => {
        // update people array
        setPeople(people.filter(person => person.id !== id ? person : returnedPerson))
        setFilteredPeople(people.filter(person => person.id !== id ? person : returnedPerson))
      })
      .catch(error => {
        setNotification({
          type: 'error',
          message: error.response.data.error
        })
      })

    setTimeout(() => {
      setNotification({
        type: '',
        message: ''
      })
    }, 5000)

    setNotification({
      type: 'success',
      message: `Updated ${obj.name}`
    })

    // clear input values
    setNewName('')
    setNewNumber('')
    return true
  }

  const handleSearchChange = (event) => {
    // filter the person array so that it contains people with names matching the input value
    const filtered = people.filter(
      person => person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPeople(filtered);
  }

  return (
    <div>
      <h1>Phonebook</h1>

      {notification.message !== '' &&
        <Notification message={notification.message} type={notification.type} />
      }

      <Filter handleChange={handleSearchChange} />

      <h3>Add a new number</h3>
      <PersonForm handleSubmit={addPhonebookEntry} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} />

      <h3>Numbers</h3>
      <People handleDelete={deletePhonebookEntry} people={filteredPeople} />
    </div>
  )
}

export default App
