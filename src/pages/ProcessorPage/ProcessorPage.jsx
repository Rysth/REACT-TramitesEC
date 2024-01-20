import { Card } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcessors, processorActions } from '../../redux/slices/ProcessorSlice'
import ProcessorForm from './components/ProcessorForm'
import ProcessorTable from './components/ProcessorTable'

function ProcessorPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorsArray, processorOriginal, totalPages } = useSelector((store) => store.processor)
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1)
    dispatch(getProcessors({ activeToken, page: selectedItem.selected + 1 }))
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
    dispatch(getProcessors({ activeToken, page: 1 }))
  }

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    dispatch(getProcessors({ activeToken, page: 1 }))
  }, [dispatchEvent])

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
            restartCurrentPage={resetToFirstPage}
            showModal={showModal}
            originalItems={processorOriginal}
            fileName="TRAMITESEC-Tramitadores"
          />
          <TableLayout>
            <ProcessorTable currentItems={processorsArray} showModal={showModal} />
          </TableLayout>
          <TablePaginate currentPage={currentPage - 1} pageCount={totalPages} handlePageChange={handlePageChange} />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcessorPage
