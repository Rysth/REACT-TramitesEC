import { SearchSelect, SearchSelectItem, TextInput } from '@tremor/react'
import { Button } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { IoPerson, IoCreateSharp, IoSearch } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../../redux/slices/UserSlice'

function TableHeader({ title, searchMethod, restartCurrentPage, showModal }) {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const { usersArray } = useSelector((store) => store.users)
  const { activeToken } = useSelector((store) => store.authentication)

  const handleSearchData = (event) => {
    setTimeout(() => {
      const input = event.target.value.toLowerCase().trim()
      restartCurrentPage()
      dispatch(searchMethod({ searchData: input, selectedUserId: value }))
    }, 500)
  }

  const handleSelectChange = (selectedValue) => {
    const value = selectedValue
    console.log(value)
    setValue(selectedValue)
    dispatch(searchMethod({ searchData: '', selectedUserId: value }))
  }

  useEffect(() => {
    dispatch(getUsers(activeToken))
  }, [])

  return (
    <article className="flex flex-col items-center justify-between gap-2 px-4 py-3 bg-[var(--CL-primary)] sm:flex-row rounded-t-2xl">
      <header className="flex items-center gap-1.5 text-white text-xl sm:text-2xl truncate">
        <h3>{title}</h3>
      </header>
      <fieldset className="flex items-center gap-1">
        <SearchSelect value={value} onValueChange={handleSelectChange} className="z-50 w-48" placeholder="Usuario">
          {usersArray.map((user) => (
            <SearchSelectItem value={user.id} icon={IoPerson}>
              {user.username}
            </SearchSelectItem>
          ))}
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
