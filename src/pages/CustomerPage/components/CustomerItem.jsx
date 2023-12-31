import PropTypes from 'prop-types'
import { Badge, Button } from 'flowbite-react'
import { TableCell, TableRow } from '@tremor/react'
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
    <TableRow key={customer.id}>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{customer.id}</TableCell>
      <TableCell className="py-1 truncate">{customer.cedula}</TableCell>
      <TableCell className="py-1 truncate">{`${customer.nombres} ${customer.apellidos}`}</TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="info" className="grid place-items-center">
          {`${customer.processor.nombres} ${customer.processor.apellidos}`}
        </Badge>
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {customer.processor.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1 text-blue-500 truncate">
        <a href={`tel:+593${customer.celular}`} className="text-blue-500 md:hover:text-black">
          {customer.celular}
        </a>
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
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
      </TableCell>
    </TableRow>
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
