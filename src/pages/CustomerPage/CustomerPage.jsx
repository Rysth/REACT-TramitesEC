import { Card } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { customerActions, getCustomers } from '../../redux/slices/CustomerSlice'
import CustomerForm from './components/CustomerForm'
import CustomerTable from './components/CustomerTable'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersArray, customersOriginal, totalPages } = useSelector((store) => store.customer)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)

  const refetchCustomers = () => {
    dispatch(getCustomers({ activeToken, page: currentPage, search, userId: selectedUserId }))
  }

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1)
    dispatch(getCustomers({ activeToken, page: selectedItem.selected + 1, search, userId: selectedUserId }))
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
    dispatch(getCustomers({ activeToken, page: 1, search, userId: selectedUserId }))
  }

  const handleDelete = () => {
    if (customersArray.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
    refetchCustomers() // Refetch the processor list
  }

  const [openModal, setOpenModal] = useState(false)
  const showModal = () => setOpenModal(true)
  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    dispatch(getCustomers({ activeToken, page: 1, search, userId: selectedUserId }))
  }, [dispatch, activeToken, search, selectedUserId])

  return (
    <SectionLayout title="Clientes" subtitle="Información General de los Clientes">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={CustomerForm}
        refetchFunction={refetchCustomers}
        slice="customer"
        title="Cliente"
        setEntitySelected={customerActions.setCustomerSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Clientes"
            restartCurrentPage={resetToFirstPage}
            showModal={showModal}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
          />
          <TableLayout>
            <CustomerTable currentItems={customersArray} showModal={showModal} handleDelete={handleDelete} />
          </TableLayout>
          <TablePaginate currentPage={currentPage - 1} pageCount={totalPages} handlePageChange={handlePageChange} />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default CustomerPage
