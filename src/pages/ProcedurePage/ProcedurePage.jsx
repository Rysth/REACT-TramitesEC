import { Button, Card, DatePicker } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { generateProcedureExcelFile, getProcedures, procedureActions } from '../../redux/slices/ProcedureSlice'
import ProcedureForm from './components/ProcedureForm'
import ProcedureTable from './components/ProcedureTable'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { FaFileExcel } from 'react-icons/fa'

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
  const dispatch = useDispatch()
  const startDate = useSelector((state) => state.procedure.startDate)
  const endDate = useSelector((state) => state.procedure.endDate)
  const { activeToken, activeUser } = useSelector((state) => state.authentication)

  const handleStartDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const startDateString = date ? date.toISOString() : null
    dispatch(procedureActions.setStartDate(startDateString))
  }

  const handleEndDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const endDateString = date ? date.toISOString() : null
    dispatch(procedureActions.setEndDate(endDateString))
  }

  // Function to check if startDate and endDate are set
  const isDateSet = () => startDate && endDate
  const isAdmin = activeUser.is_admin

  // Function to reset dates
  const resetDates = () => {
    dispatch(procedureActions.setStartDate(null))
    dispatch(procedureActions.setEndDate(null))
  }

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
        <div className="flex items-center justify-between py-2">
          <fieldset className="flex flex-col items-center gap-2 md:flex-row">
            <DatePicker
              className="z-[60] w-40"
              defaultValue={startDate}
              onValueChange={handleStartDateChange}
              placeholder="Fecha Inicial"
            />
            <DatePicker
              className="z-[60] w-40"
              defaultValue={endDate}
              onValueChange={handleEndDateChange}
              placeholder="Fecha Final"
            />
          </fieldset>
          <Button
            onClick={() => {
              dispatch(generateProcedureExcelFile({ activeToken, startDate, endDate, isAdmin }))
              resetDates() // Reset dates after clicking the button
            }}
            color="green"
            className="flex items-center"
            disabled={!isDateSet()}
          >
            <span className="inline-block">Generar Excel</span>
            <FaFileExcel className="inline-block ml-1" />
          </Button>
        </div>
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
