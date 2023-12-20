import { useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'flowbite-react'
import ProcessorItem from './ProcessorItem'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../../components/Loading/Loading'
import Error from '../../../components/Error/Error'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcessor, processorActions } from '../../../redux/slices/ProcessorSlice'

function ProcessorTable({ currentItems, showModal }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, processorSelected } = useSelector((store) => store.processor)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyProcessor({ activeToken, processorID: processorSelected.id }))
    dispatch(processorActions.setProcessorSelected(''))
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Trámitador no Encontrado!" />
  }

  return (
    <>
      <TableDelete
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        confirmDelete={confirmDelete}
      />
      <Table hoverable>
        <Table.Head className="sticky top-0 z-50 border border-x-0">
          <Table.HeadCell className="!rounded-none w-1/12 bg-white">#</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-2/12 bg-white">Cédula</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-4/12 bg-white">Nombre Completo</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-2/12 bg-white">Usuario</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-2/12 bg-white">Celular</Table.HeadCell>
          <Table.HeadCell className="!rounded-none w-3/12 bg-white">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentItems.map((processor) => (
            <ProcessorItem
              key={processor.id}
              processor={processor}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

ProcessorTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default ProcessorTable
