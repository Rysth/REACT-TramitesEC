import { useState } from 'react'
import { useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import TableStats from '../../components/Table/TableStats'
import usePagination from '../../hooks/usePagination'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { customerActions } from '../../redux/slices/CustomerSlice'
import CustomerForm from './components/CustomerForm'
import CustomerTable from './components/CustomerTable'

function CustomerPage() {
  const { customersArray, customerStats, customersOriginal } = useSelector((store) => store.customer)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(customersArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  return (
    <SectionLayout>
      <TableStats categories={customerStats} />
      <MainLayout>
        <TableModal
          openModal={openModal}
          closeModal={closeModal}
          formComponent={CustomerForm}
          slice="customer"
          title="Cliente"
          setEntitySelected={customerActions.setCustomerSelected}
        />
        <TableHeader
          title="Listado de Clientes"
          searchMethod={customerActions.searchCustomer}
          restartCurrentPage={restartCurrentPage}
          showModal={showModal}
        />
        <TableLayout>
          <CustomerTable currentItems={currentItems} showModal={showModal} originalItems={customersOriginal} />
        </TableLayout>
        <TablePaginate
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          customArray={customersArray}
        />
      </MainLayout>
    </SectionLayout>
  )
}

export default CustomerPage
