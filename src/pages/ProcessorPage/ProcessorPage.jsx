import { useState } from 'react'
import { useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import TableStats from '../../components/Table/TableStats'
import usePagination from '../../hooks/usePagination'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { processorActions } from '../../redux/slices/ProcessorSlice'
import ProcessorForm from './components/ProcessorForm'
import ProcessorTable from './components/ProcessorTable'

function ProcessorPage() {
  const { processorsArray, processorStats } = useSelector((store) => store.processor)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(processorsArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  return (
    <SectionLayout>
      <TableStats categories={processorStats} />
      <MainLayout>
        <TableModal
          openModal={openModal}
          closeModal={closeModal}
          formComponent={ProcessorForm}
          slice="processor"
          setEntitySelected={processorActions.setProcessorSelected}
        />
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
