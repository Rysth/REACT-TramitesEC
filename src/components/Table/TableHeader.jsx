import { SearchSelect, SearchSelectItem, TextInput, Button } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { IoPerson, IoCreateSharp, IoSearch, IoDownload } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'
import debounce from 'lodash/debounce'
import { useCallback } from 'react'

function TableHeader({ restartCurrentPage, showModal, originalItems, fileName, setSearch, setSelectedUserId }) {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const { usersArray } = useSelector((store) => store.users)

  const debouncedSearch = useCallback(
    debounce((input) => {
      setSearch(input)
    }, 500),
    [dispatch, value], // Dependencias
  )

  const handleSearchData = (event) => {
    const input = event.target.value.toLowerCase().trim()
    restartCurrentPage()
    debouncedSearch(input)
  }

  const handleSelectChange = (selectedValue) => {
    setValue(selectedValue)
    setSelectedUserId(selectedValue)
    restartCurrentPage()
  }

  return (
    <article className="p-2 sm:px-4 py-4 bg-[var(--CL-primary)] rounded-t-lg">
      <fieldset className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row">
        <SearchSelect
          value={value}
          onValueChange={handleSelectChange}
          className="z-50 max-w-md sm:max-w-sm"
          placeholder="Usuario"
        >
          {usersArray.map((user) => (
            <SearchSelectItem key={user.id} value={user.id} icon={IoPerson}>
              {user.username}
            </SearchSelectItem>
          ))}
        </SearchSelect>
        <div className="flex flex-col items-center justify-end w-full max-w-md gap-2 sm:flex-row">
          <TextInput
            id="search"
            type="text"
            icon={IoSearch}
            placeholder="Buscar..."
            onChange={handleSearchData}
            color="purple"
            required
          />
          <div className="flex items-center justify-end w-full gap-1 max-w-max">
            <Button color="blue" onClick={showModal} className="flex items-center">
              Crear
              <IoCreateSharp className="inline-block ml-1" />
            </Button>
            <Button color="green">
              <CSVLink data={originalItems} filename={`${fileName}.csv`} className="flex items-center">
                Excel
                <IoDownload className="ml-1" />
              </CSVLink>
            </Button>
          </div>
        </div>
      </fieldset>
    </article>
  )
}

TableHeader.propTypes = {
  restartCurrentPage: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  originalItems: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  setSelectedUserId: PropTypes.func.isRequired,
}

export default TableHeader
