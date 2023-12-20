import { Table, Modal, Button } from 'flowbite-react'
import Loading from '../../../components/Loading/Loading'
import Error from '../../../components/Error/Error'
import PropTypes from 'prop-types'
import CustomerItem from './CustomerItem'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'
import TableDelete from '../../../components/Table/TableDelete'

function CustomerTable({ currentItems, showModal }) {
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, customerSelected } = useSelector((store) => store.customer)
  const dispatch = useDispatch()
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyCliente({ activeToken, customerID: customerSelected.id }))
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
      <Table striped>
        <Table.Head className="sticky top-0 z-50 text-gray-700 border border-t-0 border-l-0 shadow">
          <Table.HeadCell className="!rounded-none w-1/12 bg-white">#</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-1/12 bg-white">Cédula</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-3/12 bg-white">Nombre Completo</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-1/12 bg-white">Celular</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-4/12 bg-white">Email</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-2/12 bg-white">Acciones</Table.HeadCell>
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
