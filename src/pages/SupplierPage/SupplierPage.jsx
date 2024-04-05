import { Button, Card, DatePicker } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getSuppliers, supplierActions, generateExcelFile } from '../../redux/slices/SupplierSlice'
import SupplierForm from './components/SupplierForm'
import SupplierTable from './components/SupplierTable'
import { FaFileExcel } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

function SupplierPage() {
  const {
    entitiesArray: suppliersArray,
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
  } = useEntityManagement(getSuppliers, 'supplier', 'suppliersArray')

  const dispatch = useDispatch()
  const startDate = useSelector((state) => state.supplier.startDate)
  const endDate = useSelector((state) => state.supplier.endDate)
  const { activeToken, activeUser } = useSelector((state) => state.authentication)

  const handleStartDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const startDateString = date ? date.toISOString() : null
    dispatch(supplierActions.setStartDate(startDateString))
  }

  const handleEndDateChange = (date) => {
    // Convert Date object to ISO string format before dispatching
    const endDateString = date ? date.toISOString() : null
    dispatch(supplierActions.setEndDate(endDateString))
  }

  // Function to check if startDate and endDate are set
  const isDateSet = () => startDate && endDate
  const isAdmin = activeUser.is_admin

  // Function to reset dates
  const resetDates = () => {
    dispatch(supplierActions.setStartDate(null))
    dispatch(supplierActions.setEndDate(null))
  }

  return (
    <SectionLayout title="Proveedores" subtitle="Información General de los Proveedores">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={SupplierForm}
        refetchFunction={resetToFirstPage}
        slice="supplier"
        title="Proveedor"
        setEntitySelected={supplierActions.setSupplierSelected}
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
            title="Listado de Proveedores"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
          />
          <TableLayout>
            {Array.isArray(suppliersArray) ? (
              <SupplierTable
                currentItems={suppliersArray}
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

export default SupplierPage
