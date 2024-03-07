import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiEye, HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
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

  const statusColor =
    procedure.status.id === 1 || procedure.status.id === 3 ? 'gray' : procedure.status.id === 2 ? 'indigo' : 'success'
  const isAdmin = activeUser.is_admin
  const isDirect = procedure.customer?.is_direct

  return (
    <TableRow>
      <TableCell className="py-1.5 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1.5 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {procedure.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1.5 uppercase">
        {!isDirect && procedure.processor ? (
          <Badge
            className="grid truncate place-items-center max-w-[8rem]"
            href={`/tramitadores/${procedure.processor.id}`}
            color="purple"
          >
            {`${procedure.processor.first_name.split(' ')[0]} ${procedure.processor.last_name.split(' ')[0]}`}
          </Badge>
        ) : (
          <Badge className="grid place-items-center">Cliente Directo</Badge>
        )}
      </TableCell>
      <TableCell className="py-1.5 ">
        <Badge color={statusColor} className="grid truncate place-items-center">
          {procedure.status.name}
        </Badge>
      </TableCell>
      <TableCell className="py-1.5">{new Date(procedure.updated_at).toLocaleDateString()}</TableCell>
      <TableCell className="py-1.5 ">
        {procedure.customer ? (
          <a
            href={`/clientes/${procedure.customer.id}`}
            className=" transition hover:text-blue-500 hover:underline max-w-[5rem]"
          >
            {`${procedure.customer.first_name.split(' ')[0]} ${procedure.customer.last_name.split(' ')[0]}`}
          </a>
        ) : (
          <p>{procedure.plate}</p>
        )}
      </TableCell>

      <TableCell className="py-1.5 ">{procedure.procedure_type.name}</TableCell>
      <TableCell className="py-1.5">
        {procedure.is_paid ? (
          <Badge className="grid place-items-center" color="green">
            Pagado
          </Badge>
        ) : (
          <Badge className="grid place-items-center" color="red">
            Pendiente
          </Badge>
        )}
      </TableCell>

      <TableCell className="flex items-center w-full gap-1 py-1.5">
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
          disabled={!isAdmin}
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
    code: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
    cost_pending: PropTypes.number.isRequired,
    profit: PropTypes.number.isRequired,
    profit_pending: PropTypes.number.isRequired,
    processor: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }),
    customer: PropTypes.shape({
      id: PropTypes.number.isRequired,
      identification: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
    license: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcedureItem
