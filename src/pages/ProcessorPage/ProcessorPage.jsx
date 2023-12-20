import { useEffect, useState } from 'react'
import TableHeader from '../../components/Table/TableHeader'
import TablePaginate from '../../components/Table/TablePaginate'
import HeaderLayout from '../../layouts/HeaderLayout'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import { processorActions } from '../../redux/slices/ProcessorSlice'
import { getProcessors } from '../../redux/slices/ProcessorSlice'
import { useDispatch, useSelector } from 'react-redux'
import ProcessorTable from './components/ProcessorTable'
import usePagination from '../../hooks/usePagination'
import TableLayout from '../../layouts/TableLayout'
import ProcessorModal from './components/ProcessorModal'

function ProcessorPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorsArray } = useSelector((store) => store.processor)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(processorsArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    dispatch(getProcessors(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <HeaderLayout />
      <MainLayout>
        <ProcessorModal openModal={openModal} closeModal={closeModal} />
        <TableHeader
          title="Listado de Trámitadores"
          searchMethod={processorActions.searchProcessor}
          restartCurrentPage={restartCurrentPage}
          showModal={showModal}
        />
        <TableLayout>
          <ProcessorTable currentItems={currentItems} showModal={showModal} />
        </TableLayout>
        <TablePaginate
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          customArray={processorsArray}
        />
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcessorPage
