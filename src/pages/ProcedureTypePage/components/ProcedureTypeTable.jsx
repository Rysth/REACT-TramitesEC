import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyProcedureType, procedureTypeActions } from '../../../redux/slices/ProcedureTypeSlice'
import ProcedureTypeItem from './ProcedureTypeItem'

function ProcedureTypeTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, procedureTypeSelected } = useSelector((store) => store.procedureType)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyProcedureType({ activeToken, procedureTypeID: procedureTypeSelected.id })).then(() => {
      dispatch(procedureTypeActions.setProcedureTypeSelected(''))
      handleDelete() // Call the handleDelete function passed as a prop
    })
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Tipo de Trámite no Encontrado!" />
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
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '25%' }}>Nombre</th>
              <th style={{ width: '50%' }}>Descripción</th>
              <th style={{ width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((procedureType, index) => {
              const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

              return (
                <ProcedureTypeItem
                  key={calculatedIndex}
                  index={calculatedIndex}
                  procedureType={procedureType}
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

ProcedureTypeTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default ProcedureTypeTable
