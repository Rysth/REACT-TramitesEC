import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomers } from '../../redux/slices/CustomerSlice'
import { customerActions } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import HeaderLayout from '../../layouts/HeaderLayout'
import MainLayout from '../../layouts/MainLayout'
import TableLayout from '../../layouts/TableLayout'
import TableHeader from '../../components/Table/TableHeader'
import TablePaginate from '../../components/Table/TablePaginate'
import CustomerTable from './components/CustomerTable'
import CustomerModal from './components/CustomerModal'
import usePagination from '../../hooks/usePagination'
import TableStats from '../../components/Table/TableStats'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersArray, customerStats } = useSelector((store) => store.customer)
  const { currentPage, pageCount, handlePageChange, currentItems, restartCurrentPage } = usePagination(customersArray)

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    dispatch(getCustomers(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <HeaderLayout />
      <TableStats categories={customerStats} />
      <MainLayout>
        <CustomerModal openModal={openModal} closeModal={closeModal} />
        <TableHeader
          title="Listado de Clientes"
          searchMethod={customerActions.searchCustomer}
          restartCurrentPage={restartCurrentPage}
          showModal={showModal}
        />
        <TableLayout>
          <CustomerTable currentItems={currentItems} showModal={showModal} />
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
