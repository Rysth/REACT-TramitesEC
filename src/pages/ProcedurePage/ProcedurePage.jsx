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
import { useEffect } from 'react'

function ProcedurePage({ routeName }) {
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
    setSelectedProcedureTypeId,
    setHasLicenses,
    handleDelete,
  } = useEntityManagement(getProcedures, 'procedure', 'proceduresArray')
  const { procedureSelected } = useSelector((store) => store.procedure)

  useEffect(() => {
    setHasLicenses(routeName === 'licencias')
  }, [routeName])

  return (
    <SectionLayout title="Trámites" subtitle="Información General de los Trámites">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcedureForm}
        refetchFunction={resetToFirstPage}
        slice="procedure"
        title="Trámite"
        modalSize={`${procedureSelected ? '6xl' : '2xl'}`}
        setEntitySelected={procedureActions.setProcedureSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámites"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            setSelectedStatusId={setSelectedStatusId}
            setSelectedProcedureTypeId={setSelectedProcedureTypeId}
            showProcessorFilter
            showStatusFilter
            showProcedureTypeFilter
          />
          <TableLayout>
            {Array.isArray(proceduresArray) ? (
              <ProcedureTable
                currentItems={proceduresArray}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModal}
                handleDelete={handleDelete}
              />
            ) : (
              <Loading />
            )}
          </TableLayout>
          <TablePaginate
            currentPage={currentPage - 1}
            pageCount={totalPages}
            handlePageChange={handlePageChange}
            showModal={showModal}
          />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcedurePage
