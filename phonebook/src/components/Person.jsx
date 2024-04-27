const Person = ({ person, handleDelete }) => (
  <div>
    <span>{person.name} {person.number}</span>
    <button onClick={handleDelete}>Delete</button>
  </div>
)

export default Person
