import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcessor, processorActions } from '../../../redux/slices/ProcessorSlice'
import ProcessorItem from './ProcessorItem'
import { CSVLink } from 'react-csv'

function ProcessorTable({ currentItems, showModal, originalItems }) {
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
      <CSVLink data={originalItems} filename={'your-file.csv'}>
        Download CSV
      </CSVLink>
      <TableDelete
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        confirmDelete={confirmDelete}
      />
      <Table>
        <TableHead>
          <TableRow className="sticky top-0 z-40 border-b border-x-0">
            <TableHeaderCell className="!rounded-none bg-gray-100">#</TableHeaderCell>
            <TableHeaderCell className="!rounded-none bg-gray-100">Cédula</TableHeaderCell>
            <TableHeaderCell className="!rounded-none bg-gray-100">Nombre Completo</TableHeaderCell>
            <TableHeaderCell className="!rounded-none bg-gray-100">Usuario</TableHeaderCell>
            <TableHeaderCell className="!rounded-none bg-gray-100">Celular</TableHeaderCell>
            <TableHeaderCell className="!rounded-none bg-gray-100">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {currentItems.map((processor) => (
            <ProcessorItem
              key={processor.id}
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
  originalItems: PropTypes.array.isRequired,
}

export default ProcessorTable
