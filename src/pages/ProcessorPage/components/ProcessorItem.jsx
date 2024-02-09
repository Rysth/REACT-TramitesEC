import { Button, TableCell, TableRow } from '@tremor/react'
import { Badge } from 'flowbite-react'
import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { processorActions } from '../../../redux/slices/ProcessorSlice'

function ProcessorItem({ index, processor, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleProcessorSelected = (processorID) => {
    dispatch(processorActions.setProcessorSelected(processorID))
    showModal()
  }

  const isAdmin = activeUser.id === 3

  return (
    <TableRow>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{index}</TableCell>
      <TableCell className="py-1 truncate">
        <a href={`/tramitadores/${processor.id}`} className="transition hover:text-blue-500 hover:underline">
          {processor.codigo}
        </a>
      </TableCell>
      <TableCell className="py-1 truncate">{`${processor.nombres} ${processor.apellidos}`}</TableCell>
      <TableCell className="py-1 truncate">
        <Badge color="indigo" className="grid place-items-center">
          {processor.user.username}
        </Badge>
      </TableCell>
      <TableCell className="py-1 text-blue-500 truncate">
        <a href={`tel:+593${processor.celular}`} className="text-blue-500 md:hover:text-black">
          {processor.celular}
        </a>
      </TableCell>
      <TableCell className="flex items-center w-full gap-1 py-1">
        <Button size="xs" color="blue" onClick={() => handleProcessorSelected(processor.id)} disabled={!isAdmin}>
          <span className="sr-only">Editar</span>
          <HiPencilSquare />
        </Button>
        <Button
          color="red"
          size="xs"
          onClick={() => {
            dispatch(processorActions.setProcessorSelected(processor.id))
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

ProcessorItem.propTypes = {
  index: PropTypes.number.isRequired,
  processor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    codigo: PropTypes.string.isRequired,
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    celular: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcessorItem
