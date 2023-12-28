import { SearchSelect, SearchSelectItem, TextInput } from '@tremor/react'
import { Button } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { IoPerson, IoCreateSharp, IoSearch, IoDownload } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'

function TableHeader({ title, searchMethod, restartCurrentPage, showModal, originalItems, fileName }) {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const { usersArray } = useSelector((store) => store.users)

  const handleSearchData = (event) => {
    setTimeout(() => {
      const input = event.target.value.toLowerCase().trim()
      restartCurrentPage()
      dispatch(searchMethod({ searchData: input, selectedUserId: value }))
    }, 500)
  }

  const handleSelectChange = (selectedValue) => {
    setValue(selectedValue)
    dispatch(searchMethod({ searchData: '', selectedUserId: selectedValue }))
    restartCurrentPage()
  }

  return (
    <article className="flex flex-col items-center justify-between gap-2 p-2 sm:px-4 py-3 bg-[var(--CL-primary)] lg:flex-row rounded-t-lg">
      <header className="flex items-center gap-1.5 text-white text-2xl sm:text-2xl truncate">
        <h3>{title}</h3>
      </header>
      <fieldset className="grid items-center grid-cols-2 gap-1 sm:flex">
        <SearchSelect value={value} onValueChange={handleSelectChange} className="z-50" placeholder="Usuario">
          {usersArray.map((user) => (
            <SearchSelectItem key={user.id} value={user.id} icon={IoPerson}>
              {user.username}
            </SearchSelectItem>
          ))}
        </SearchSelect>
        <TextInput
          id="search"
          type="text"
          icon={IoSearch}
          placeholder="Buscar..."
          onChange={handleSearchData}
          color="purple"
          sizing="md"
          required
        />
        <Button color="blue" onClick={showModal}>
          Crear
          <IoCreateSharp className="ml-1" />
        </Button>
        <Button color="success">
          <CSVLink data={originalItems} filename={`${fileName}.csv`} className="flex items-center">
            Excel
            <IoDownload className="ml-1" />
          </CSVLink>
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
  originalItems: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
}

export default TableHeader
