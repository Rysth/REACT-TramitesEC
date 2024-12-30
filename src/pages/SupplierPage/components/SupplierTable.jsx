// SupplierTable.js
import TableDelete from '../../../components/Table/TableDelete'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import { destroySupplier, supplierActions } from '../../../redux/slices/SupplierSlice'
import SupplierItem from './SupplierItem'

function SupplierTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, supplierSelected } = useSelector((store) => store.supplier)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroySupplier({ activeToken, supplierID: supplierSelected.id })).then(() => {
      dispatch(supplierActions.setSupplierSelected(''))
      handleDelete() // Call the handleDelete function passed as a prop
    })
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Proveedor no Encontrado!" />
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
              <th style={{ width: '12%' }}>Usuario</th>
              <th style={{ width: '10%' }}>Identificación</th>
              <th style={{ width: '25%' }}>Nombre</th>
              <th style={{ width: '20%' }}>Teléfono</th>
              <th style={{ width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((supplier, index) => {
              const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

              return (
                <SupplierItem
                  key={calculatedIndex}
                  index={calculatedIndex}
                  supplier={supplier}
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

SupplierTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default SupplierTable
