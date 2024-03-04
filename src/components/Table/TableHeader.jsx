import { SearchSelect, SearchSelectItem, TextInput } from '@tremor/react/dist'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProcessorOptions } from '../../redux/slices/ProcessorSlice'
import { useLocation } from 'react-router-dom'

function TableHeader({
  restartCurrentPage,
  setSearch,
  setSelectedUserId,
  setSelectedProcessorId,
  setSelectedStatusId,
  setSelectedProcedureTypeId,
  showProcessorFilter,
  showStatusFilter,
  showProcedureTypeFilter,
}) {
  const dispatch = useDispatch()
  const [userID, setUserID] = useState('')
  const [statusID, setStatusID] = useState('')
  const [procedureTypeId, setProcedureTypeId] = useState('')
  const [processorID, setProcessorID] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const { usersArray } = useSelector((store) => store.users)
  const { processorOptions } = useSelector((store) => store.processor)
  const { statusOriginal, typesOriginal } = useSelector((store) => store.shared)
  const { activeToken } = useSelector((store) => store.authentication)

  const debouncedSearch = useCallback(
    debounce((input) => {
      setSearch(input)
      restartCurrentPage()
    }, 700),
    [dispatch, userID, processorID], // Dependencias
  )

  const handleSearchData = (event) => {
    const input = event.target.value.toLowerCase().trim()
    debouncedSearch(input)
  }

  const handleSelectChange = (selectedValue) => {
    setUserID(selectedValue)
    setSelectedUserId(selectedValue)
    restartCurrentPage()
  }

  const handleProcessorSelectChange = (selectedValue) => {
    setProcessorID(selectedValue)
    setSelectedProcessorId(selectedValue)
    restartCurrentPage()
  }

  const handleStatusSelectChange = (selectedValue) => {
    setStatusID(selectedValue)
    setSelectedStatusId(selectedValue)
    restartCurrentPage()
  }

  const handleProcedureTypeSelectChange = (selectedValue) => {
    setProcedureTypeId(selectedValue)
    setSelectedProcedureTypeId(selectedValue)
    restartCurrentPage()
  }

  const handleProcessorInputChange = useCallback(
    debounce((inputValue) => {
      const trimmedValue = inputValue.trim()
      setSearchValue(trimmedValue)
      if (trimmedValue === '') {
        dispatch(fetchProcessorOptions({ activeToken, query: '' }))
      } else {
        dispatch(fetchProcessorOptions({ activeToken, query: inputValue }))
      }
    }, 700),
    [dispatch, activeToken],
  )

  useEffect(() => {
    handleProcessorInputChange('')
  }, [])

  const routeName = useLocation().pathname
  const isRouteLicenses = routeName.includes('licencias')

  const newFilterArray = isRouteLicenses
    ? typesOriginal.filter((item) => item.has_licenses)
    : typesOriginal.filter((item) => !item.has_licenses)

  return (
    <article className="p-2 md:p-4 bg-[var(--CL-primary)] rounded-t-lg space-y-2">
      <header className="flex flex-col items-center justify-between gap-2 ml-auto sm:flex-row ">
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-max md:items-center">
          <SearchSelect
            value={userID}
            onValueChange={handleSelectChange}
            className="z-50 w-20 md:w-40"
            placeholder="Usuario"
          >
            {usersArray.map((user) => (
              <SearchSelectItem className="!text-xs" key={user.id} value={user.id}>
                {user.username}
              </SearchSelectItem>
            ))}
          </SearchSelect>
          {showProcessorFilter && (
            <SearchSelect
              value={processorID}
              onValueChange={handleProcessorSelectChange}
              className="z-40 w-20 md:w-40"
              placeholder="Trámitador"
              searchValue={searchValue}
              onSearchValueChange={handleProcessorInputChange}
            >
              <SearchSelectItem className="text-xs" value={0}>
                Cliente Directos
              </SearchSelectItem>
              {processorOptions.map((processor) => (
                <SearchSelectItem className="text-xs" key={processor.id} value={processor.id}>
                  {`${processor.code} - ${processor.first_name} ${processor.last_name}`}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          )}
          {showStatusFilter && (
            <SearchSelect
              value={statusID}
              onValueChange={handleStatusSelectChange}
              className="z-30 w-full col-span-full md:w-40"
              placeholder="Estado"
            >
              {statusOriginal.map((status) => (
                <SearchSelectItem className="text-xs" key={status.id} value={status.id}>
                  {status.name}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          )}
          {showProcedureTypeFilter && (
            <SearchSelect
              value={procedureTypeId}
              onValueChange={handleProcedureTypeSelectChange}
              className="z-30 w-full col-span-full md:w-40"
              placeholder="Trámite"
            >
              {newFilterArray.map((type) => (
                <SearchSelectItem className="text-xs" key={type.id} value={type.id}>
                  {type.name}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          )}
        </div>
        <TextInput
          id="search"
          type="text"
          icon={IoSearch}
          placeholder="Buscar..."
          onChange={handleSearchData}
          color="purple"
          className="md:max-w-xs"
          required
        />
      </header>
    </article>
  )
}

TableHeader.propTypes = {
  restartCurrentPage: PropTypes.func.isRequired,

  setSearch: PropTypes.func.isRequired,
  setSelectedUserId: PropTypes.func.isRequired,
  setSelectedProcessorId: PropTypes.func,
  setSelectedStatusId: PropTypes.func,
  setSelectedProcedureTypeId: PropTypes.func,
  showProcessorFilter: PropTypes.bool,
  showStatusFilter: PropTypes.bool,
  showProcedureTypeFilter: PropTypes.bool,
}

export default TableHeader
