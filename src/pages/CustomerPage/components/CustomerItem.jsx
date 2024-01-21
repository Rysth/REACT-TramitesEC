import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { customerActions } from '../../../redux/slices/CustomerSlice'

function CustomerItem({ index, customer, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { id } = useSelector((store) => store.authentication.activeUser)

  const handleCustomerSelected = (customerID) => {
    dispatch(customerActions.setCustomerSelected(customerID))
    showModal()
  }

  return (
    <TableRow>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1 truncate">{customer.cedula}</TableCell>
      <TableCell className="py-1 truncate">{`${customer.nombres} ${customer.apellidos}`}</TableCell>
      <TableCell className="py-1 truncate">{customer.direccion}</TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {customer.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1 text-blue-500 truncate">
        <a href={`tel:+593${customer.celular}`} className="text-blue-500 md:hover:text-black">
          {customer.celular}
        </a>
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
        <Button size="xs" color="blue" onClick={() => handleCustomerSelected(customer.id)}>
          <span className="sr-only">Editar</span>
          <HiPencilSquare />
        </Button>
        {customer.user.id === id && (
          <Button
            size="xs"
            color="red"
            onClick={() => {
              dispatch(customerActions.setCustomerSelected(customer.id))
              showConfirmation(true)
            }}
          >
            <span className="sr-only">Eliminar</span>
            <HiMiniTrash />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

CustomerItem.propTypes = {
  index: PropTypes.number.isRequired,
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cedula: PropTypes.string.isRequired,
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    celular: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    processor: PropTypes.shape({
      nombres: PropTypes.string,
      apellidos: PropTypes.string,
    }),
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default CustomerItem
