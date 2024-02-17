import { Button, SearchSelect, SearchSelectItem, TextInput } from '@tremor/react/dist'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { IoCreateSharp, IoSearch } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProcessorOptions } from '../../redux/slices/ProcessorSlice'

function TableHeader({
  restartCurrentPage,
  showModal,
  setSearch,
  setSelectedUserId,
  setSelectedProcessorId,
  setSelectedStatusId,
  showProcessorFilter,
  showStatusFilter,
}) {
  const dispatch = useDispatch()
  const [userID, setUserID] = useState('')
  const [statusID, setStatusID] = useState('')
  const [processorID, setProcessorID] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const { usersArray } = useSelector((store) => store.users)
  const { processorOptions } = useSelector((store) => store.processor)
  const { statusOriginal } = useSelector((store) => store.shared)
  const { activeToken } = useSelector((store) => store.authentication)

  const debouncedSearch = useCallback(
    debounce((input) => {
      setSearch(input)
      restartCurrentPage()
    }, 500),
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

  const handleProcessorInputChange = useCallback(
    debounce((inputValue) => {
      const trimmedValue = inputValue.trim()
      setSearchValue(trimmedValue)
      if (trimmedValue === '') {
        dispatch(fetchProcessorOptions({ activeToken, query: '' }))
      } else {
        dispatch(fetchProcessorOptions({ activeToken, query: inputValue }))
      }
    }, 500),
    [dispatch, activeToken],
  )

  useEffect(() => {
    handleProcessorInputChange('')
  }, [])

  return (
    <article className="p-4 sm:px-4 bg-[var(--CL-primary)] rounded-t-lg">
      <fieldset className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row">
        <div className="flex flex-col w-full gap-2 md:w-max md:items-center md:flex-row">
          <SearchSelect
            value={userID}
            onValueChange={handleSelectChange}
            className="z-50 w-full md:w-48"
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
              className="z-40 w-full md:w-48"
              placeholder="Trámitador"
              searchValue={searchValue}
              onSearchValueChange={handleProcessorInputChange}
            >
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
              className="z-30 w-full md:w-48"
              placeholder="Estado"
            >
              {statusOriginal.map((status) => (
                <SearchSelectItem className="text-xs" key={status.id} value={status.id}>
                  {status.name}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          )}
        </div>
        <div className="flex flex-col items-center justify-end w-full sm:max-w-[20rem] gap-2 sm:flex-row">
          <TextInput
            id="search"
            type="text"
            icon={IoSearch}
            placeholder="Buscar..."
            onChange={handleSearchData}
            color="purple"
            allowClear
            required
          />
          <div className="flex items-center justify-end w-full gap-1 sm:max-w-max">
            <Button color="green" onClick={showModal} className="flex items-center">
              Crear
              <IoCreateSharp className="inline-block ml-1" />
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
  setSearch: PropTypes.func.isRequired,
  setSelectedUserId: PropTypes.func.isRequired,
  setSelectedProcessorId: PropTypes.func.isRequired,
  setSelectedStatusId: PropTypes.func.isRequired,
  showProcessorFilter: PropTypes.bool.isRequired,
  showStatusFilter: PropTypes.bool.isRequired,
}

export default TableHeader
