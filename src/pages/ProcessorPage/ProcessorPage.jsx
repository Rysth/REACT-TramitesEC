import { Button, Card, DatePicker } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcessors, processorActions, generateExcelFile } from '../../redux/slices/ProcessorSlice'
import ProcessorForm from './components/ProcessorForm'
import ProcessorTable from './components/ProcessorTable'
import { FaFileExcel } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

function ProcessorPage() {
  const {
    entitiesArray: processorsArray,
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
  } = useEntityManagement(getProcessors, 'processor', 'processorsArray')

  const dispatch = useDispatch()
  const startDate = useSelector((state) => state.processor.startDate)
  const endDate = useSelector((state) => state.processor.endDate)
  const { activeToken } = useSelector((state) => state.authentication)

  const handleStartDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const startDateString = date ? date.toISOString() : null
    console.log(startDateString)
    dispatch(processorActions.setStartDate(startDateString))
  }

  const handleEndDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const endDateString = date ? date.toISOString() : null
    console.log(endDateString)
    dispatch(processorActions.setEndDate(endDateString))
  }

  // Function to check if startDate and endDate are set
  const isDateSet = () => startDate && endDate

  // Function to reset dates
  const resetDates = () => {
    dispatch(processorActions.setStartDate(null))
    dispatch(processorActions.setEndDate(null))
  }

  return (
    <SectionLayout title="Trámitadores" subtitle="Información General de los Trámitadores">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcessorForm}
        refetchFunction={resetToFirstPage}
        slice="processor"
        title="Trámitador"
        setEntitySelected={processorActions.setProcessorSelected}
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
              dispatch(generateExcelFile({ activeToken, startDate, endDate }))
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
            title="Listado de Trámitadores"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
          />
          <TableLayout>
            {Array.isArray(processorsArray) ? (
              <ProcessorTable
                currentItems={processorsArray}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModal}
                handleDelete={handleDelete}
              />
            ) : (
              <Loading /> // Placeholder for loading or empty state
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

export default ProcessorPage
