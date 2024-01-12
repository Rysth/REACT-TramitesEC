import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { customerActions, destroyCliente } from '../../../redux/slices/CustomerSlice'
import CustomerItem from './CustomerItem'

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
      <Table>
        <TableHead>
          <TableRow className="sticky top-0 z-40 border-b border-x-0">
            <TableHeaderCell className="w-[5%] bg-gray-100 ">#</TableHeaderCell>
            <TableHeaderCell className="w-1/12 bg-gray-100 ">Cédula</TableHeaderCell>
            <TableHeaderCell className="w-3/12 bg-gray-100 ">Nombre Completo</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100 ">Dirección</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100 ">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100 ">Celular</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100 ">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs divide-y">
          {currentItems.map((customer) => (
            <CustomerItem
              key={customer.id}
              customer={customer}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default CustomerTable
