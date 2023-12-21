import PropTypes from 'prop-types'
import { Table, Button, Badge } from 'flowbite-react'
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
    <Table.Row key={processor.id}>
      <Table.Cell className="py-2 font-bold text-gray-900 truncate whitespace-nowrap">{processor.id}</Table.Cell>
      <Table.Cell className="py-2 truncate">{processor.cedula}</Table.Cell>
      <Table.Cell className="py-2 truncate">{`${processor.nombres} ${processor.apellidos}`}</Table.Cell>
      <Table.Cell className="py-2 truncate">
        <Badge color="indigo" className="grid place-items-center" href="/">
          {processor.user.username}
        </Badge>
      </Table.Cell>
      <Table.Cell className="py-2 truncate">{processor.celular}</Table.Cell>
      <Table.Cell className="flex items-center w-full gap-1 py-2">
        <Button size="xs" color="blue" onClick={() => handleProcessorSelected(processor.id)}>
          Editar
        </Button>
        {processor.user.id === id && (
          <Button
            size="xs"
            color="failure"
            onClick={() => {
              dispatch(customerActions.setCustomerSelected(customer.id))
              showConfirmation(true)
            }}
          >
            Eliminar
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
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
