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
  const [openModal, setOpenModal] = useState(false)

  const refetchEntities = () => {
    console.log(`processorID: ${selectedProcessorId}`)
    dispatch(
      getEntitiesAction({
        activeToken,
        page: currentPage,
        search,
        userId: selectedUserId,
        processorId: selectedProcessorId,
      }),
    )
  }

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1)
    refetchEntities()
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
    refetchEntities()
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
  }, [dispatch, activeToken, search, selectedUserId, currentPage, selectedProcessorId]) // Include currentPage in dependencies

  useEffect(() => {
    if (selectedUserId || selectedProcessorId) {
      setCurrentPage(1)
    }
  }, [selectedUserId, selectedProcessorId])

  return {
    entitiesArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    resetToFirstPage,
    setSearch,
    setSelectedUserId,
    setSelectedProcessorId,
    handleDelete,
  }
}

export default useEntityManagement
