import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcessor, procedureActions } from '../../../redux/slices/ProcedureSlice'
import ProcedureItem from './ProcedureItem'

function ProcedureTable({ currentItems, showModal }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, procedureSelected } = useSelector((store) => store.procedure)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyProcessor({ activeToken, procedureID: procedureSelected.id }))
    dispatch(procedureActions.setProcedureSelected(''))
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Trámite no Encontrado!" />
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
            <TableHeaderCell className="bg-gray-100">#</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Código</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Cliente</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Trámitador</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Usuario</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Valor</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Pendiente</TableHeaderCell>
            <TableHeaderCell className="bg-gray-100">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {currentItems.map((procedure) => (
            <ProcedureItem
              key={procedure.id}
              procedure={procedure}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

ProcedureTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default ProcedureTable
