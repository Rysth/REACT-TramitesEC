import { Card } from '@tremor/react'
import { useDispatch } from 'react-redux'
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

  return (
    <SectionLayout title="Clientes" subtitle="Información General de los Clientes" excelMethod={generateExcelFile}>
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
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Clientes"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            showProcessorFilter
            showUserFilter={false}
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
