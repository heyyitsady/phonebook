import Person from "./Person"

const People = ({ people, handleDelete }) => {
  return (
    <div>
      {people.map((person) => <Person key={person.id} person={person} handleDelete={() => handleDelete(person.id)} />)}
    </div>
  )
}

export default People
