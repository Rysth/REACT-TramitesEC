import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcedures, procedureActions } from '../../redux/slices/ProcedureSlice'
import ProcedureForm from './components/ProcedureForm'
import ProcedureTable from './components/ProcedureTable'
import { useSelector } from 'react-redux'

function ProcedurePage() {
  const {
    entitiesArray: proceduresArray,
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
    setSelectedStatusId,
    handleDelete,
  } = useEntityManagement(getProcedures, 'procedure', 'proceduresArray')
  const { procedureSelected } = useSelector((store) => store.procedure)

  return (
    <SectionLayout title="Trámites" subtitle="Información General de los Trámites">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcedureForm}
        refetchFunction={resetToFirstPage}
        slice="procedure"
        title="Trámite"
        modalSize={`${procedureSelected ? '7xl' : '2xl'}`}
        setEntitySelected={procedureActions.setProcedureSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámites"
            restartCurrentPage={resetToFirstPage}
            showModal={showModal}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            setSelectedStatusId={setSelectedStatusId}
            showProcessorFilter
            showStatusFilter
          />
          <TableLayout>
            {Array.isArray(proceduresArray) ? (
              <ProcedureTable
                currentItems={proceduresArray}
                currentPage={currentPage}
                itemsPerPage={20}
                showModal={showModal}
                handleDelete={handleDelete}
              />
            ) : (
              <Loading />
            )}
          </TableLayout>
          <TablePaginate currentPage={currentPage - 1} pageCount={totalPages} handlePageChange={handlePageChange} />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcedurePage
