// SupplierItem.js
import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { supplierActions } from '../../../redux/slices/SupplierSlice'
import { FaWhatsapp } from 'react-icons/fa'

function SupplierItem({ index, supplier, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleSupplierSelected = (supplierID) => {
    dispatch(supplierActions.setSupplierSelected(supplierID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <TableRow className="hover:bg-neutral-100">
      <TableCell className="py-1.5 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1.5 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {supplier.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1.5 truncate">
        <a href={`/proveedores/${supplier.id}`} className="transition hover:text-blue-500 hover:underline">
          {supplier.identification}
        </a>
      </TableCell>
      <TableCell className="py-1.5 truncate">{supplier.name}</TableCell>
      <TableCell className="py-1.5 truncate">
        <a
          href={`https://api.whatsapp.com/send?phone=593${supplier.phone}`}
          className="flex items-center justify-center w-24 gap-1 p-1.5 font-bold text-center text-white bg-green-400 rounded md:hover:bg-black"
          target="_blank"
        >
          <FaWhatsapp /> Contactar
        </a>
      </TableCell>

      <TableCell className="flex items-center w-full gap-1 py-1.5">
        <Button size="xs" color="blue" onClick={() => handleSupplierSelected(supplier.id)} disabled={!isAdmin}>
          <span className="sr-only">Editar</span>
          <HiPencilSquare />
        </Button>
        <Button
          color="red"
          size="xs"
          onClick={() => {
            dispatch(supplierActions.setSupplierSelected(supplier.id))
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

SupplierItem.propTypes = {
  index: PropTypes.number.isRequired,
  supplier: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    identification: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default SupplierItem
