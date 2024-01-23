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
    handleDelete,
  } = useEntityManagement(getProcedures, 'procedure', 'proceduresArray')

  return (
    <SectionLayout title="Trámites" subtitle="Información General de los Trámites">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcedureForm}
        refetchFunction={resetToFirstPage}
        slice="procedure"
        title="Trámite"
        modalSize="2xl"
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
          />
          <TableLayout>
            {Array.isArray(proceduresArray) ? (
              <ProcedureTable
                currentItems={proceduresArray}
                currentPage={currentPage}
                itemsPerPage={25}
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
