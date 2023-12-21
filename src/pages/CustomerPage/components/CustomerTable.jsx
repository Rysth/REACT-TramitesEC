import { useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'flowbite-react'
import CustomerItem from './CustomerItem'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../../components/Loading/Loading'
import Error from '../../../components/Error/Error'
import TableDelete from '../../../components/Table/TableDelete'
import { customerActions, destroyCliente } from '../../../redux/slices/CustomerSlice'

function CustomerTable({ currentItems, showModal }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, customerSelected } = useSelector((store) => store.customer)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyCliente({ activeToken, customerID: customerSelected.id }))
    dispatch(customerActions.setCustomerSelected(''))
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Cliente no Encontrado!" />
  }

  return (
    <>
      <TableDelete
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        confirmDelete={confirmDelete}
      />
      <Table hoverable>
        <Table.Head className="sticky top-0 z-50 border-b border-x-0">
          <Table.HeadCell className="!rounded-none bg-gray-100">#</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Cédula</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Cliente</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Trámitador</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Usuario</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Email</Table.HeadCell>
          <Table.HeadCell className="!rounded-none bg-gray-100">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentItems.map((customer) => (
            <CustomerItem
              key={customer.id}
              customer={customer}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default CustomerTable
