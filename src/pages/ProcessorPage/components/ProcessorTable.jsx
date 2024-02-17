import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcessor, processorActions } from '../../../redux/slices/ProcessorSlice'
import ProcessorItem from './ProcessorItem'

function ProcessorTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, processorSelected } = useSelector((store) => store.processor)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyProcessor({ activeToken, processorID: processorSelected.id })).then(() => {
      dispatch(processorActions.setProcessorSelected(''))
      handleDelete() // Call the handleDelete function passed as a prop
    })
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
            <TableHeaderCell className="w-[5%]">#</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Código</TableHeaderCell>
            <TableHeaderCell className="w-max">Nombre Completo</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Teléfono</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs">
          {currentItems.map((processor, index) => {
            const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

            return (
              <ProcessorItem
                key={calculatedIndex}
                index={calculatedIndex}
                processor={processor}
                showModal={showModal}
                showConfirmation={setConfirmationModal}
              />
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

ProcessorTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default ProcessorTable
