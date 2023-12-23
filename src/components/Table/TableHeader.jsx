import { SearchSelect, SearchSelectItem, TextInput } from '@tremor/react'
import { Button } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { IoPerson, IoCreateSharp, IoSearch } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

function TableHeader({ title, searchMethod, restartCurrentPage, showModal }) {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')

  const handleSearchData = (event) => {
    setTimeout(() => {
      const input = event.target.value.toLowerCase().trim()
      restartCurrentPage()
      dispatch(searchMethod(input))
    }, 500)
  }

  return (
    <article className="flex flex-col items-center justify-between gap-2 px-4 py-3 bg-[var(--CL-primary)] sm:flex-row rounded-t-2xl">
      <header className="flex items-center gap-1.5 text-white text-xl sm:text-2xl truncate">
        <h3>{title}</h3>
      </header>
      <fieldset className="flex items-center gap-1">
        <SearchSelect value={value} onValueChange={setValue} className="z-50 w-48" placeholder="Usuario">
          <SearchSelectItem value="1" icon={IoPerson}>
            Kilometers
          </SearchSelectItem>
          <SearchSelectItem value="2" icon={IoPerson}>
            Meters
          </SearchSelectItem>
          <SearchSelectItem value="3" icon={IoPerson}>
            Miles
          </SearchSelectItem>
        </SearchSelect>
        <TextInput
          id="search"
          type="text"
          className="w-full sm:w-max !p-0"
          icon={IoSearch}
          placeholder="Buscar..."
          onChange={handleSearchData}
          color="purple"
          sizing="md"
          required
        />
        <Button size="md" gradientDuoTone="greenToBlue" onClick={showModal}>
          Crear
          <IoCreateSharp className="ml-1" />
        </Button>
      </fieldset>
    </article>
  )
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  searchMethod: PropTypes.func.isRequired,
  restartCurrentPage: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default TableHeader
