// SupplierItem.js
import PropTypes from 'prop-types'
import { FaWhatsapp } from 'react-icons/fa'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { supplierActions } from '../../../redux/slices/SupplierSlice'

function SupplierItem({ index, supplier, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleSupplierSelected = (supplierID) => {
    dispatch(supplierActions.setSupplierSelected(supplierID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 ">
      <th>{index}</th>
      <td>
        <span className="w-full text-white badge badge-primary">{supplier.user.username}</span>
      </td>
      <td>
        <a href={`/proveedores/${supplier.id}`} className="font-bold link link-hover">
          {supplier.identification}
        </a>
      </td>
      <td className="uppercase">{supplier.name}</td>
      <td>
        <a
          href={`https://api.whatsapp.com/send?phone=593${supplier.phone}`}
          className="btn btn-success btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> Contactar
        </a>
      </td>
      <td className="flex items-center gap-1">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleSupplierSelected(supplier.id)}
          disabled={!isAdmin}
        >
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(supplierActions.setSupplierSelected(supplier.id))
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

SupplierItem.propTypes = {
  index: PropTypes.number.isRequired,
  supplier: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    identification: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default SupplierItem
