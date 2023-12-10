import { useState } from 'react'
import PropTypes from 'prop-types'

function TableSearch({ title }) {
  const [searchData, setSearchData] = useState('')

  const onChangeSearchData = (event) => {
    setTimeout(() => {
      const inputData = event.target.value.toLowerCase()
      if (!inputData) {
        setSearchData('')
        return
      }

      setSearchData(inputData)
    }, 500)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-2 p-4 sm:flex-row">
      <header>
        <h3 className="text-xl">{title}</h3>
      </header>
      <label htmlFor="search" className="flex items-center justify-end gap-3">
        <span className="sr-only">Buscar: </span>
        <input
          type="text"
          id="table-search"
          defaultValue={searchData}
          onChange={onChangeSearchData}
          className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Buscar..."
        />
      </label>
    </div>
  )
}

TableSearch.propTypes = {
  title: PropTypes.string.isRequired,
}

export default TableSearch
