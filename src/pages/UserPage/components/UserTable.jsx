import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../../components/Error/Error'
import Loading from '../../../components/Loading/Loading'
import TableDelete from '../../../components/Table/TableDelete'
import { destroyUser, userActions } from '../../../redux/slices/UserSlice'
import UserItem from './UserItem'

function UserTable({ currentItems, currentPage, itemsPerPage, showModal, handleDelete }) {
  const dispatch = useDispatch()
  const quantity = currentItems.length
  const { activeToken, activeUser } = useSelector((store) => store.authentication)
  const { loading, userSelected } = useSelector((store) => store.users)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyUser({ activeToken, userID: userSelected.id })).then(() => {
      dispatch(userActions.setUserSelected(''))
      handleDelete()
    })
  }

  if (loading) {
    return <Loading />
  }

  if (quantity === 0) {
    return <Error title="¡Usuario no Encontrado!" />
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
              <th style={{ width: '25%' }}>Usuario</th>
              <th style={{ width: '30%' }}>Correo</th>
              <th style={{ width: '15%' }}>Rol</th>
              <th style={{ width: '10%' }}>Estado</th>
              <th style={{ width: '15%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => {
              const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1

              return (
                <UserItem
                  key={calculatedIndex}
                  index={calculatedIndex}
                  user={user}
                  showModal={showModal}
                  showConfirmation={setConfirmationModal}
                  isCurrentUser={user.id === activeUser?.id}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

UserTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
}

export default UserTable
