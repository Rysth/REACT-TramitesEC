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
      <div className="overflow-x-auto">
        <table className="table w-full bg-white">
          <thead className="font-normal">
            <tr>
              <th style={{ width: '3%' }}>#</th>
              <th style={{ width: '15%' }}>Trámitador</th>
              <th style={{ width: '15%' }}>Estado</th>
              <th style={{ width: '11%' }}>Trámite</th>
              <th style={{ width: '10%' }}>Fecha</th>
              <th style={{ width: '25%' }}>Cliente</th>
              <th style={{ width: '8%' }}>Pago</th>
              <th style={{ width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
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
