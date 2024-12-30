import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { FaWhatsapp } from 'react-icons/fa'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { customerActions } from '../../../redux/slices/CustomerSlice'

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
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        {!isDirect ? (
          <span className="w-full text-white uppercase badge badge-primary badge-sm">
            {`${customer.processor.first_name.split(' ')[0]} ${customer.processor.last_name.split(' ')[0]}`}
          </span>
        ) : (
          <span className="w-full text-white badge badge-primary">Cliente Directo</span>
        )}
      </td>
      <td>
        <a href={`/clientes/${customer.id}`} className="font-bold link link-hover">
          {customer.identification}
        </a>
      </td>
      <td className="uppercase">{`${customer.first_name} ${customer.last_name}`}</td>
      <td>
        {isDirect ? (
          <a
            href={`https://api.whatsapp.com/send?phone=593${customer.phone}`}
            className="btn btn-success btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Contactar
          </a>
        ) : (
          <a
            href={`https://api.whatsapp.com/send?phone=593${customer.processor.phone}`}
            className="btn btn-success btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Contactar
          </a>
        )}
      </td>
      <td className="flex items-center gap-1">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleCustomerSelected(customer.id)}
          disabled={!isAdmin}
        >
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(customerActions.setCustomerSelected(customer.id))
            showConfirmation(true)
          }}
          disabled={!isAdmin}
        >
          <HiMiniTrash />
        </button>
      </td>
    </tr>
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
