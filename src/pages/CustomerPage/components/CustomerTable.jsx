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
      <div className="overflow-x-auto">
        <table className="table w-full bg-white">
          <thead className="font-normal">
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '12%' }}>Trámitador</th>
              <th style={{ width: '10%' }}>Cédula</th>
              <th style={{ width: '28%' }}>Nombre Completo</th>
              <th style={{ width: '15%' }}>Teléfono</th>
              <th style={{ width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
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
