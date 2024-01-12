import { Card } from '@tremor/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import usePagination from '../../hooks/usePagination'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { processorActions } from '../../redux/slices/ProcessorSlice'
import ProcessorForm from './components/ProcessorForm'
import ProcessorTable from './components/ProcessorTable'

function ProcessorPage() {
  const { processorsArray, processorOriginal } = useSelector((store) => store.processor)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(processorsArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  return (
    <SectionLayout title="Trámitadores" subtitle="Información General de los Trámitadores">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcessorForm}
        slice="processor"
        title="Trámitador"
        setEntitySelected={processorActions.setProcessorSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámitadores"
            searchMethod={processorActions.searchProcessor}
            restartCurrentPage={restartCurrentPage}
            showModal={showModal}
            originalItems={processorOriginal}
            fileName="TRAMITESEC-Tramitadores"
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
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcessorPage
