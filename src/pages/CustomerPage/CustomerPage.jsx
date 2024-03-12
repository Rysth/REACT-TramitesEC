import { Card, DatePicker, Button } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { customerActions, generateExcelFile, getCustomers } from '../../redux/slices/CustomerSlice'
import CustomerForm from './components/CustomerForm'
import CustomerTable from './components/CustomerTable'
import { useDispatch, useSelector } from 'react-redux'
import { FaFileExcel } from 'react-icons/fa'

function CustomerPage() {
  const {
    entitiesArray: customersArray,
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
    handleDelete,
  } = useEntityManagement(getCustomers, 'customer', 'customersArray')

  const dispatch = useDispatch()
  const startDate = useSelector((state) => state.customer.startDate)
  const endDate = useSelector((state) => state.customer.endDate)
  const { activeToken, activeUser } = useSelector((state) => state.authentication)

  const handleStartDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const startDateString = date ? date.toISOString() : null
    dispatch(customerActions.setStartDate(startDateString))
  }

  const handleEndDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const endDateString = date ? date.toISOString() : null
    dispatch(customerActions.setEndDate(endDateString))
  }

  // Function to check if startDate and endDate are set
  const isDateSet = () => startDate && endDate
  const isAdmin = activeUser.is_admin

  // Function to reset dates
  const resetDates = () => {
    dispatch(customerActions.setStartDate(null))
    dispatch(customerActions.setEndDate(null))
  }

  return (
    <SectionLayout title="Clientes" subtitle="Información General de los Clientes">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={CustomerForm}
        refetchFunction={resetToFirstPage}
        slice="customer"
        title="Cliente"
        setEntitySelected={customerActions.setCustomerSelected}
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
              dispatch(generateExcelFile({ activeToken, startDate, endDate, isAdmin }))
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
            title="Listado de Clientes"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            showProcessorFilter
          />
          <TableLayout>
            {Array.isArray(customersArray) ? (
              <CustomerTable
                currentItems={customersArray}
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

export default CustomerPage
