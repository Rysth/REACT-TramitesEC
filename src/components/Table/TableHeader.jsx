import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { IoSearch } from 'react-icons/io5'
import { TextInput } from 'flowbite-react'

function TableHeader({ title, searchMethod, restartCurrentPage }) {
  const dispatch = useDispatch()

  const handleSearchData = (event) => {
    setTimeout(() => {
      const input = event.target.value.toLowerCase().trim()
      restartCurrentPage()
      dispatch(searchMethod(input))
    }, 400)
  }

  return (
    <article className="flex flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row bg-purple rounded-t-2xl">
      <header className="flex items-center gap-1.5 text-white text-xl">
        <h3>{title}</h3>
      </header>
      <TextInput
        id="search"
        type="text"
        className="w-full sm:w-max"
        icon={IoSearch}
        placeholder="Buscar..."
        onChange={handleSearchData}
        color="purple"
        required
      />
    </article>
  )
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  searchMethod: PropTypes.func.isRequired,
  restartCurrentPage: PropTypes.func.isRequired,
}

export default TableHeader
