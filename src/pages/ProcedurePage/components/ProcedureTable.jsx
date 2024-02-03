import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcedure, procedureActions } from '../../../redux/slices/ProcedureSlice'
import ProcedureItem from './ProcedureItem'

function ProcedureTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, procedureSelected } = useSelector((store) => store.procedure)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyProcedure({ activeToken, procedureID: procedureSelected.id })).then(() => {
      dispatch(procedureActions.setProcedureSelected(''))
      handleDelete() // Call the handleDelete function passed as a prop
    })
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
            <TableHeaderCell className="w-[5%]">#</TableHeaderCell>
            <TableHeaderCell className="w-[5%]">Código</TableHeaderCell>
            <TableHeaderCell className="w-[5%]">Fecha</TableHeaderCell>
            <TableHeaderCell className="w-max">Cliente</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Estado</TableHeaderCell>
            <TableHeaderCell className="w-[15%]">Tipo Trámite</TableHeaderCell>
            <TableHeaderCell className="w-[15%]">Trámitador</TableHeaderCell>
            <TableHeaderCell className="w-[15%]">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs divide-y">
          {currentItems.map((procedure, index) => {
            const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

            return (
              <ProcedureItem
                key={calculatedIndex}
                index={calculatedIndex}
                procedure={procedure}
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

ProcedureTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default ProcedureTable
