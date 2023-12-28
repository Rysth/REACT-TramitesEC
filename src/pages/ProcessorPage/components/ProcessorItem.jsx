import PropTypes from 'prop-types'
import { Button, Badge } from 'flowbite-react'
import { TableCell, TableRow } from '@tremor/react'
import { useDispatch, useSelector } from 'react-redux'
import { processorActions } from '../../../redux/slices/ProcessorSlice'

function ProcessorItem({ processor, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { id } = useSelector((store) => store.authentication.activeUser)

  const handleProcessorSelected = (processorID) => {
    dispatch(processorActions.setProcessorSelected(processorID))
    showModal()
  }

  return (
    <TableRow key={processor.id}>
      <TableCell className="py-1 font-bold text-gray-900 truncate whitespace-nowrap">{processor.id}</TableCell>
      <TableCell className="py-1 truncate">{processor.cedula}</TableCell>
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
        <Button size="xs" color="blue" onClick={() => handleProcessorSelected(processor.id)}>
          Editar
        </Button>
        {processor.user.id === id && (
          <Button
            size="xs"
            color="failure"
            onClick={() => {
              dispatch(processorActions.setProcessorSelected(processor.id))
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

ProcessorItem.propTypes = {
  processor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cedula: PropTypes.string.isRequired,
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
