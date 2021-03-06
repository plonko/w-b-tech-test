import React, { useReducer } from "react"
import { useMutation } from "@apollo/client"
import { v4 as uuidv4 } from "uuid"
import PropTypes from "prop-types"

import Select from "./form/select"
import TextInput from "./form/text"
import Checkbox from "./form/checkbox"

import { ADD_ANIMAL, UPDATE_ANIMAL } from "../utils/queries"

import { $ButtonGroup } from "../styles"

const AddAnimal = ({
  id = uuidv4(),
  type,
  name,
  diet,
  isExtinct,
  isEditing,
  setIsEditing,
}) => {
  // Connect the useMutation hooks with queries
  const [addAnimal] = useMutation(ADD_ANIMAL)
  const [updateAnimal] = useMutation(UPDATE_ANIMAL)

  // Set up initial state so we can use it to clear state later
  const initialState = {
    id,
    type,
    name,
    diet,
    isExtinct,
  }

  // useReducer to keep state for all form fields in one place
  const [formData, setFormData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { ...initialState }
  )

  const handleUpdate = () => {
    updateAnimal({
      variables: { ...formData },
      onCompleted: setIsEditing(false),
    })
  }

  const handleAdd = () => {
    addAnimal({ variables: { ...formData } })
  }

  const handleSubmit = event => {
    event.preventDefault()

    // Call the mutations
    isEditing ? handleUpdate() : handleAdd()

    // Clear the form data
    return setFormData({ ...initialState })
  }

  const handleChange = event => {
    const { name, value, type, checked } = event.target

    // Set the form fields state
    setFormData({ [name]: type === "checkbox" ? checked : value }) // If it's a checkbox use checked, otherwise value
  }

  const typeOptions = [
    { value: "mammal", label: "Mammal" },
    { value: "reptile", label: "Reptile" },
    { value: "fish", label: "Fish" },
    { value: "amphibious", label: "Amphibious" },
  ]

  const dietOptions = [
    { value: "herbivore", label: "Herbivore" },
    { value: "carnivore", label: "Carnivore" },
  ]

  return (
    <form onSubmit={handleSubmit} data-cy="add-animal-form">
      {!isEditing ? <h4 className="title">Add a new animal</h4> : null}
      <TextInput
        label="Name"
        name="name"
        placeholder=""
        value={formData.name}
        onChange={event => handleChange(event)}
      />
      <Select
        label="Type"
        name="type"
        value={formData.type}
        onChange={event => handleChange(event)}
        defaultValue=""
        options={typeOptions}
      />
      <Select
        label="Diet"
        name="diet"
        value={formData.diet}
        onChange={event => handleChange(event)}
        defaultValue=""
        options={dietOptions}
      />
      <Checkbox
        label="Extinct"
        name="isExtinct"
        checked={formData.isExtinct}
        onChange={event => handleChange(event)}
      />
      <$ButtonGroup>
        <button type="submit">{isEditing ? "Save" : "Add animal"}</button>

        {isEditing ? (
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        ) : null}
      </$ButtonGroup>
    </form>
  )
}

AddAnimal.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  diet: PropTypes.string,
  isExtinct: PropTypes.bool,
  setIsEditing: PropTypes.func,
}

AddAnimal.defaultProps = {
  name: "",
  type: "",
  diet: "",
  isExtinct: false,
  setIsEditing: () => {},
}

export default AddAnimal
