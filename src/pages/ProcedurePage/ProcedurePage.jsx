import { Card } from '@tremor/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TablePaginate from '../../components/Table/TablePaginate'
import TableStats from '../../components/Table/TableStats'
import usePagination from '../../hooks/usePagination'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { procedureActions } from '../../redux/slices/ProcedureSlice'
import ProcedureTable from './components/ProcedureTable'
import TableModal from '../../components/Table/TableModal'
import CustomerForm from '../CustomerPage/components/CustomerForm'

function ProcedurePage() {
  const { proceduresArray, procedureStats, procedureOriginal } = useSelector((store) => store.procedure)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(proceduresArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  return (
    <SectionLayout title="Trámites" subtitle="Información General de los Trámites">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={CustomerForm}
        slice="procedure"
        title="Trámite"
        setEntitySelected={procedureActions.setProcedureSelected}
      />
      <MainLayout>
        <TableStats categories={procedureStats} />
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámites"
            searchMethod={procedureActions.searchProcedure}
            restartCurrentPage={restartCurrentPage}
            showModal={showModal}
            originalItems={procedureOriginal}
            fileName="TRAMITESEC-Trámites"
          />
          <TableLayout>
            <ProcedureTable currentItems={currentItems} showModal={showModal} />
          </TableLayout>
          <TablePaginate
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            customArray={proceduresArray}
          />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcedurePage
