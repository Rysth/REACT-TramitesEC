import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { customerActions, fetchCustomerDetails } from '../../../redux/slices/CustomerSlice'

function CustomerItem({ index, customer, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleCustomerSelected = (customerID) => {
    dispatch(customerActions.setCustomerSelected(customerID))
    showModal()
  }

  const isDirect = customer.is_direct
  const isAdmin = activeUser.is_admin

  return (
    <TableRow>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1 truncate">
        <a href={`/clientes/${customer.id}`} className="transition hover:text-blue-500 hover:underline">
          {customer.identification}
        </a>
      </TableCell>
      <TableCell className="py-1 truncate">{`${customer.first_name} ${customer.last_name}`}</TableCell>
      <TableCell className="py-1 truncate">
        {!isDirect ? (
          <Badge className="grid place-items-center" href={`/tramitadores/${customer.processor.id}`}>
            {`${customer.processor.first_name} ${customer.processor.last_name}`}
          </Badge>
        ) : (
          <Badge className="grid place-items-center" color="green">
            Usuario Directo
          </Badge>
        )}
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {customer.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1 text-blue-500 truncate">
        {isDirect ? (
          <a href={`tel:+593${customer.phone}`} className="text-blue-500 md:hover:underline">
            {customer.phone}
          </a>
        ) : (
          <a href={`tel:+593${customer.processor.phone}`} className="text-blue-500 md:hover:underline">
            {customer.processor.phone}
          </a>
        )}
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
        <Button size="xs" color="blue" onClick={() => handleCustomerSelected(customer.id)} disabled={!isAdmin}>
          <span className="sr-only">Editar</span>
          <HiPencilSquare />
        </Button>
        <Button
          size="xs"
          color="red"
          onClick={() => {
            dispatch(customerActions.setCustomerSelected(customer.id))
            showConfirmation(true)
          }}
          disabled={!isAdmin}
        >
          <span className="sr-only">Eliminar</span>
          <HiMiniTrash />
        </Button>
      </TableCell>
    </TableRow>
  )
}

CustomerItem.propTypes = {
  index: PropTypes.number.isRequired,
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    identification: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    processor: PropTypes.shape({
      code: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
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
