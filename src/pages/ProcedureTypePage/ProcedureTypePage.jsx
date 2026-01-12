import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcedureTypes, procedureTypeActions, generateExcelFile } from '../../redux/slices/ProcedureTypeSlice'
import ProcedureTypeForm from './components/ProcedureTypeForm'
import ProcedureTypeTable from './components/ProcedureTypeTable'
import { useSelector } from 'react-redux'

function ProcedureTypePage() {
  const { activeUser } = useSelector((store) => store.authentication)
  const isAdmin = Boolean(activeUser?.is_admin)

  const {
    entitiesArray: procedureTypesArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    setSearch,
    setSelectedUserId,
    handleDelete,
    refetchEntities,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntityManagement(getProcedureTypes, 'procedureType', 'procedureTypesArray')

  const showModalIfAdmin = () => {
    if (isAdmin) showModal()
  }

  return (
    <SectionLayout
      title="Tipos de Trámites"
      subtitle="Información General de los Tipos de Trámites"
      excelMethod={generateExcelFile}
    >
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcedureTypeForm}
        refetchFunction={refetchEntities}
        slice="procedureType"
        title="Tipo de Trámite"
        setEntitySelected={procedureTypeActions.setProcedureTypeSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Tipos de Trámites"
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            showUserFilter={false}
          />
          <TableLayout>
            {Array.isArray(procedureTypesArray) ? (
              <ProcedureTypeTable
                currentItems={procedureTypesArray}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModalIfAdmin}
                handleDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ) : (
              <Loading /> // Placeholder for loading or empty state
            )}
          </TableLayout>

          <TablePaginate
            currentPage={currentPage - 1}
            pageCount={totalPages}
            handlePageChange={handlePageChange}
            showModal={showModalIfAdmin}
          />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcedureTypePage
