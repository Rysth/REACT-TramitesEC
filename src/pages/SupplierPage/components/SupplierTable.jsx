// SupplierTable.js
import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@tremor/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
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
      <Table>
        <TableHead>
          <TableRow className="border-b border-x-0">
            <TableHeaderCell className="w-[4%]">#</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Usuario</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Identificación</TableHeaderCell>
            <TableHeaderCell className="w-max">Nombre</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Teléfono</TableHeaderCell>
            <TableHeaderCell className="w-[10%]">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs">
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
        </TableBody>
      </Table>
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
