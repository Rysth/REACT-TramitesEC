import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroySchool, schoolActions } from '../../../redux/slices/SchoolSlice'
import SchoolItem from './SchoolItem'

function SchoolTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, schoolSelected } = useSelector((store) => store.school)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroySchool({ activeToken, schoolID: schoolSelected.id })).then(() => {
      dispatch(schoolActions.setSchoolSelected(''))
      handleDelete()
    })
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Escuela no Encontrada!" />
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
              <th style={{ width: '10%' }}>#</th>
              <th style={{ width: '60%' }}>Nombre</th>
              <th style={{ width: '15%' }}>Estado</th>
              <th style={{ width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((school, index) => {
              const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

              return (
                <SchoolItem
                  key={calculatedIndex}
                  index={calculatedIndex}
                  school={school}
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

SchoolTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default SchoolTable
