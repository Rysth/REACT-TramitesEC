import PropTypes from 'prop-types'
import { Badge, Button } from 'flowbite-react'
import { TableCell, TableRow } from '@tremor/react'
import { useDispatch, useSelector } from 'react-redux'
import { procedureActions } from '../../../redux/slices/ProcedureSlice'

function ProcedureItem({ procedure, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { id } = useSelector((store) => store.authentication.activeUser)

  const handleProcedureSelected = (procedureID) => {
    dispatch(procedureActions.setProcedureSelected(procedureID))
    showModal()
  }

  return (
    <TableRow key={procedure.id}>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{procedure.id}</TableCell>
      <TableCell className="py-1 truncate">{procedure.codigo}</TableCell>
      <TableCell className="py-1 truncate">{procedure.fecha}</TableCell>
      <TableCell className="py-1 truncate">{`${procedure.customer.nombres} ${procedure.customer.apellidos}`}</TableCell>
      <TableCell className="py-1 truncate">{procedure.type.nombre}</TableCell>
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
      <TableCell className="py-1 truncate">
        <Badge color="green" className="grid place-items-center">
          ${procedure.valor}
        </Badge>
      </TableCell>
      <TableCell className="py-1 truncate">
        <Badge color={`${procedure.valor_pendiente === 0 ? 'gray' : 'red'}`} className="grid place-items-center">
          ${procedure.valor_pendiente}
        </Badge>
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
        <Button size="xs" color="blue" onClick={() => handleProcedureSelected(procedure.id)}>
          Editar
        </Button>
        {procedure.user.id === id && (
          <Button
            size="xs"
            color="failure"
            onClick={() => {
              dispatch(procedureActions.setProcedureSelected(procedure.id))
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

// TODO: Display the Table and Items.

ProcedureItem.propTypes = {
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
