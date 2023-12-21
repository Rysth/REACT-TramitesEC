// usePagination.js
import { useState } from 'react'

function usePagination(dataArray, itemsPerPage = 30) {
  const [currentPage, setCurrentPage] = useState(0)
  const pageCount = Math.ceil(dataArray.length / itemsPerPage)

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = dataArray.slice(startIndex, endIndex)

  const restartCurrentPage = () => setCurrentPage(0)

  return {
    currentPage,
    pageCount,
    handlePageChange,
    currentItems,
    restartCurrentPage,
  }
}

export default usePagination
