import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function useEntityManagement(getEntitiesAction, entitySlice, arraysName) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const entitiesArray = useSelector((store) => store[entitySlice][arraysName])
  const totalPages = useSelector((store) => store[entitySlice].totalPages)
  const selectedYear = useSelector((store) => store.procedure.selectedYear)

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedProcessorId, setSelectedProcessorId] = useState(null)
  const [selectedStatusId, setSelectedStatusId] = useState(null)
  const [selectedProcedureTypeId, setSelectedProcedureTypeId] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [hasLicenses, setHasLicenses] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showUnpaid, setShowUnpaid] = useState(false)
  const [showPrimeraVez, setShowPrimeraVez] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

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
        startDate,
        endDate,
        selectedYear,
        showUnpaid,
        showPrimeraVez,
        showArchived,
      }),
    )
  }

  useEffect(() => {
    refetchEntities()
  }, [
    dispatch,
    activeToken,
    currentPage,
    search,
    selectedUserId,
    selectedProcessorId,
    selectedStatusId,
    selectedProcedureTypeId,
    hasLicenses,
    startDate,
    endDate,
    selectedYear,
    showUnpaid,
    showPrimeraVez,
    showArchived,
  ])

  useEffect(() => {
    if (
      selectedUserId ||
      selectedProcessorId ||
      selectedStatusId ||
      selectedProcedureTypeId ||
      hasLicenses ||
      startDate ||
      endDate ||
      selectedYear ||
      showUnpaid ||
      showArchived
    ) {
      setCurrentPage(1)
    }
  }, [
    selectedUserId,
    selectedProcessorId,
    selectedStatusId,
    selectedProcedureTypeId,
    hasLicenses,
    startDate,
    endDate,
    selectedYear,
    showUnpaid,
    showArchived,
  ])

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1)
  }

  const handleDelete = () => {
    if (entitiesArray.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
    refetchEntities()
  }

  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

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
    hasLicenses,
    refetchEntities,
    handleDelete,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedYear,
    showUnpaid,
    setShowUnpaid,
    showPrimeraVez,
    setShowPrimeraVez,
    showArchived,
    setShowArchived,
  }
}

export default useEntityManagement
