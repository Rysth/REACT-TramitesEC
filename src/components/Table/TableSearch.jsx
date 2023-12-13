import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

function TableSearch({ title, searchElement }) {
  const dispatch = useDispatch()

  const onChangeSearchData = (event) => {
    setTimeout(() => {
      const inputData = event.target.value.toLowerCase()
      dispatch(searchElement(inputData))
    }, 500)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-2 my-5 sm:flex-row">
      <h3 className="text-xl">{title}</h3>
      <fieldset>
        <label htmlFor="search">
          <span className="sr-only">Buscar: </span>
          <input
            type="text"
            id="table-search"
            onChange={onChangeSearchData}
            className="p-2 text-sm border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar..."
          />
        </label>
      </fieldset>
    </div>
  )
}

TableSearch.propTypes = {
  title: PropTypes.string.isRequired,
  searchElement: PropTypes.func.isRequired,
}

export default TableSearch
