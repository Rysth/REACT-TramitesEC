import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcedureTypes, procedureTypeActions, generateExcelFile, toggleArchiveProcedureType } from '../../redux/slices/ProcedureTypeSlice'
import ProcedureTypeForm from './components/ProcedureTypeForm'
import ProcedureTypeTable from './components/ProcedureTypeTable'
import { useSelector, useDispatch } from 'react-redux'

function ProcedureTypePage() {
  const dispatch = useDispatch()
  const { activeUser, activeToken } = useSelector((store) => store.authentication)
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
    showArchived,
    setShowArchived,
  } = useEntityManagement(getProcedureTypes, 'procedureType', 'procedureTypesArray')

  const showModalIfAdmin = () => {
    if (isAdmin) showModal()
  }

  const handleToggleArchive = (procedureTypeID) => {
    dispatch(toggleArchiveProcedureType({ activeToken, procedureTypeID }))
      .then(() => refetchEntities())
  }

  return (
    <SectionLayout
      title="Tipos de Trámites"
      subtitle="Información General de los Tipos de Trámites"
      excelMethod={generateExcelFile}
      showArchived={showArchived}
      setShowArchived={isAdmin ? setShowArchived : undefined}
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
                handleToggleArchive={handleToggleArchive}
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
