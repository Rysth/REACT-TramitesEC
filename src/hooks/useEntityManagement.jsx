import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function useEntityManagement(getEntitiesAction, entitySlice, arraysName) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const entitiesArray = useSelector((store) => store[entitySlice][arraysName])
  const totalPages = useSelector((store) => store[entitySlice].totalPages)

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedProcessorId, setSelectedProcessorId] = useState(null)
  const [selectedStatusId, setSelectedStatusId] = useState(null)
  const [selectedProcedureTypeId, setSelectedProcedureTypeId] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [hasLicenses, setHasLicenses] = useState(false)
  const [startDate, setStartDate] = useState(null) // Add startDate state
  const [endDate, setEndDate] = useState(null)

  const refetchEntities = () => {
    dispatch(
      getEntitiesAction({
        activeToken,
        page: currentPage,
        search,
        userId: selectedUserId,
        processorId: selectedProcessorId,
        statusId: selectedStatusId,
        procedureTypeId: selectedProcedureTypeId,
        hasLicenses,
        startDate, // Include selected start date
        endDate,
      }),
    )
  }

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1)
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  const handleDelete = () => {
    if (entitiesArray.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
    refetchEntities()
  }

  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    refetchEntities()
  }, [
    dispatch,
    activeToken,
    search,
    selectedUserId,
    currentPage,
    selectedProcessorId,
    selectedStatusId,
    selectedProcedureTypeId,
    hasLicenses,
    startDate, // Include startDate in dependencies
    endDate,
  ]) // Include currentPage in dependencies

  useEffect(() => {
    if (
      selectedUserId ||
      selectedProcessorId ||
      selectedStatusId ||
      selectedProcedureTypeId ||
      hasLicenses ||
      startDate ||
      endDate
    ) {
      setCurrentPage(1)
    }
  }, [selectedUserId, selectedProcessorId, selectedStatusId, selectedProcedureTypeId, hasLicenses, startDate, endDate])

  return {
    entitiesArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    setSearch,
    setSelectedUserId,
    setSelectedProcessorId,
    setSelectedStatusId,
    setSelectedProcedureTypeId,
    setHasLicenses,
    refetchEntities,
    handleDelete,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  }
}

export default useEntityManagement
