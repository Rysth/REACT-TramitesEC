import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { TextInput } from '@tremor/react'

function TableSearch({ title, searchElement }) {
  const dispatch = useDispatch()

  const onChangeSearchData = (event) => {
    setTimeout(() => {
      const inputData = event.target.value.toLowerCase()
      dispatch(searchElement(inputData))
    }, 300)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-2 my-5 sm:flex-row">
      <h3 className="text-xl">{title}</h3>
      <TextInput placeholder="Buscar..." onChange={onChangeSearchData} className="sm:w-64" />
    </div>
  )
}

TableSearch.propTypes = {
  title: PropTypes.string.isRequired,
  searchElement: PropTypes.func.isRequired,
}

export default TableSearch
