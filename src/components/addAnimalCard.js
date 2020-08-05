import React, { useReducer } from "react"
import { gql, useMutation } from "@apollo/client"
import { v4 as uuidv4 } from "uuid"

const ADD_ANIMAL = gql`
  mutation createAnimal(
    $id: ID!
    $name: String!
    $type: String!
    $diet: String!
    $isExtinct: Boolean!
  ) {
    createAnimal(
      id: $id
      name: $name
      type: $type
      diet: $diet
      isExtinct: $isExtinct
    ) {
      id
      type
      name
      diet
      isExtinct
    }
  }
`

const AddAnimalCard = () => {
  // Connect the useMutation hook with query
  const [addAnimal, { data }] = useMutation(ADD_ANIMAL)
  // Set up initial state so we can use it to clear state later
  const initialState = {
    id: uuidv4(),
    type: "",
    name: "",
    diet: "",
    isExtinct: false,
  }
  // useReducer to keep state for all form fields in one place
  const [formData, setFormData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { ...initialState }
  )

  const handleSubmit = event => {
    event.preventDefault()

    // Clear the form data
    setFormData({ ...initialState })

    // Call the mutation
    return addAnimal({
      variables: { ...formData },
    })
  }

  const handleChange = event => {
    const { name, value, type, checked } = event.target

    // Set the form fields state
    setFormData({ [name]: type === "checkbox" ? checked : value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={event => handleChange(event)}
        />
      </label>
      <label>
        Type:
        <select
          name="type"
          value={formData.type}
          onChange={event => handleChange(event)}
        >
          <option defaultValue></option>
          <option value="Mammal">Mammal</option>
          <option value="Reptile">Reptile</option>
          <option value="Fish">Fish</option>
          <option value="Amphibious">Amphibious</option>
        </select>
      </label>
      <label>
        Diet:
        <select
          name="diet"
          value={formData.diet}
          onChange={event => handleChange(event)}
        >
          <option defaultValue></option>
          <option value="Herbivore">Herbivore</option>
          <option value="Carnivore">Carnivore</option>
        </select>
      </label>
      <label>
        Is Extinct:
        <input
          name="isExtinct"
          type="checkbox"
          checked={formData.isExtinct}
          onChange={event => handleChange(event)}
        />
      </label>

      <button type="submit">Add animal</button>
    </form>
  )
}

export default AddAnimalCard
