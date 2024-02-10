import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { customerActions, destroyCustomer } from '../../../redux/slices/CustomerSlice'
import CustomerItem from './CustomerItem'

function CustomerTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, customerSelected } = useSelector((store) => store.customer)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyCustomer({ activeToken, customerID: customerSelected.id })).then(() => {
      dispatch(customerActions.setCustomerSelected(''))
      handleDelete() // Call the handleDelete function passed as a prop
    })
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
            <TableHeaderCell className="w-[5%]">#</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Cédula</TableHeaderCell>
            <TableHeaderCell className="w-max">Nombre Completo</TableHeaderCell>
            <TableHeaderCell className="w-[15%]">Trámitador</TableHeaderCell>
            <TableHeaderCell className="w-[15%]">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-[20%]">Teléfono Trámitador</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs divide-y">
          {currentItems.map((customer, index) => {
            const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

            return (
              <CustomerItem
                key={calculatedIndex}
                index={calculatedIndex}
                customer={customer}
                showModal={showModal}
                showConfirmation={setConfirmationModal}
              />
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default CustomerTable
