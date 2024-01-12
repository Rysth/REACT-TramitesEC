import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcessor, processorActions } from '../../../redux/slices/ProcessorSlice'
import ProcessorItem from './ProcessorItem'

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
      <Table>
        <TableHead>
          <TableRow className="border-b border-x-0">
            <TableHeaderCell className="w-[5%] bg-gray-100 ">#</TableHeaderCell>
            <TableHeaderCell className="w-1/12 bg-gray-100">Código</TableHeaderCell>
            <TableHeaderCell className="w-4/12 bg-gray-100">Nombre Completo</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-2/12 bg-gray-100">Celular</TableHeaderCell>
            <TableHeaderCell className="w-1/12 bg-gray-100">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs divide-y">
          {currentItems.map((processor, index) => (
            <ProcessorItem
              key={index + 1}
              index={index + 1}
              processor={processor}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

ProcessorTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default ProcessorTable
