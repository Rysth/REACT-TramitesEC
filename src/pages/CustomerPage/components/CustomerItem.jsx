import PropTypes from 'prop-types'
import { Table, Button, Badge } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { customerActions } from '../../../redux/slices/CustomerSlice'

function CustomerItem({ customer, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { id } = useSelector((store) => store.authentication.activeUser)

  const handleCustomerSelected = (customerID) => {
    dispatch(customerActions.setCustomerSelected(customerID))
    showModal()
  }

  return (
    <Table.Row key={customer.id}>
      <Table.Cell className="py-2 font-bold text-gray-900 truncate whitespace-nowrap">{customer.id}</Table.Cell>
      <Table.Cell className="py-2 truncate">{customer.cedula}</Table.Cell>
      <Table.Cell className="py-2 truncate">{`${customer.nombres} ${customer.apellidos}`}</Table.Cell>
      <Table.Cell className="py-2 truncate">
        <Badge color="info" className="grid place-items-center">
          {`${customer.processor.nombres} ${customer.processor.apellidos}`}
        </Badge>
      </Table.Cell>
      <Table.Cell className="py-2 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {customer.processor.user.username}
        </Badge>
      </Table.Cell>
      <Table.Cell className="py-2 text-blue-500 truncate">
        <a href={`mailto:${customer.email}`} className="text-blue-500 md:hover:text-black">
          {customer.email}
        </a>
      </Table.Cell>
      <Table.Cell className="flex items-center w-full gap-1 py-2">
        <Button size="xs" color="blue" onClick={() => handleCustomerSelected(customer.id)}>
          Editar
        </Button>
        {customer.processor.user.id === id && (
          <Button
            size="xs"
            color="failure"
            onClick={() => {
              dispatch(customerActions.setCustomerSelected(customer.id))
              showConfirmation(true)
            }}
          >
            Eliminar
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  )
}

CustomerItem.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cedula: PropTypes.string.isRequired,
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    celular: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    processor: PropTypes.shape({
      nombres: PropTypes.string.isRequired,
      apellidos: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
      }),
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default CustomerItem
