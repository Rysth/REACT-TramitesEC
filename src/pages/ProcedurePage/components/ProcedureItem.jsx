import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProcedureDetails, procedureActions } from '../../../redux/slices/ProcedureSlice'

function ProcedureItem({ index, procedure, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((store) => store.authentication)

  const handleProcedureSelected = (procedureID) => {
    dispatch(fetchProcedureDetails({ activeToken, procedureId: procedureID }))
      .then(() => {
        showModal()
      })
      .catch((error) => {
        console.error('Error fetching procedure details:', error)
      })
  }

  const statusColor = procedure.status.id === 1 ? 'gray' : procedure.status.id === 2 ? 'indigo' : 'success'

  return (
    <TableRow>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1 truncate">{procedure.codigo}</TableCell>
      <TableCell className="py-1 truncate">{procedure.fecha}</TableCell>
      <TableCell className="py-1 truncate">{`${procedure.customer.nombres} ${procedure.customer.apellidos}`}</TableCell>
      <TableCell className="py-1 truncate">
        <Badge color={statusColor} className="grid place-items-center">
          {procedure.status.nombre}
        </Badge>
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {procedure.type.nombre}
        </Badge>
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="info" className="grid place-items-center">
          {`${procedure.processor.nombres} ${procedure.processor.apellidos}`}
        </Badge>
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {procedure.user.username}
        </Badge>
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
        <Button size="xs" color="blue" onClick={() => handleProcedureSelected(procedure.id)}>
          <span className="sr-only">Editar</span>
          <HiPencilSquare />
        </Button>
        <Button
          size="xs"
          color="red"
          onClick={() => {
            dispatch(procedureActions.setProcedureSelected(procedure.id))
            showConfirmation(true)
          }}
          disabled={procedure.user.id !== activeUser.id}
        >
          <span className="sr-only">Eliminar</span>
          <HiMiniTrash />
        </Button>
      </TableCell>
    </TableRow>
  )
}

// TODO: Display the Table and Items.

ProcedureItem.propTypes = {
  index: PropTypes.number.isRequired,
  procedure: PropTypes.shape({
    id: PropTypes.number.isRequired,
    codigo: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    valor: PropTypes.number.isRequired,
    valor_pendiente: PropTypes.number.isRequired,
    ganancia: PropTypes.number.isRequired,
    ganancia_pendiente: PropTypes.number.isRequired,
    processor: PropTypes.shape({
      nombres: PropTypes.string.isRequired,
      apellidos: PropTypes.string.isRequired,
    }),
    customer: PropTypes.shape({
      id: PropTypes.number.isRequired,
      cedula: PropTypes.string.isRequired,
      nombres: PropTypes.string.isRequired,
      apellidos: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
    license: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    }),
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcedureItem
