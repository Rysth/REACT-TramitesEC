import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { userActions } from '../../../redux/slices/UserSlice'

function UserItem({ index, user, showModal, showConfirmation, isCurrentUser }) {
  const dispatch = useDispatch()

  const handleUserSelected = (userID) => {
    dispatch(userActions.setUserSelected(userID))
    showModal()
  }

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        <span className="w-full">{user.username}</span>
      </td>
      <td>
        <span className="w-full text-gray-600">{user.email}</span>
      </td>
      <td>
        {user.is_admin ? (
          <span className="badge badge-primary badge-sm">Admin</span>
        ) : (
          <span className="badge badge-ghost badge-sm">Usuario</span>
        )}
      </td>
      <td>
        {user.active ? (
          <span className="badge badge-success badge-sm">Activo</span>
        ) : (
          <span className="badge badge-error badge-sm">Inactivo</span>
        )}
      </td>
      <td className="flex items-center gap-1">
        <button className="btn btn-sm btn-primary" onClick={() => handleUserSelected(user.id)}>
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(userActions.setUserSelected(user.id))
            showConfirmation(true)
          }}
          disabled={isCurrentUser}
          title={isCurrentUser ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
        >
          <HiMiniTrash />
        </button>
      </td>
    </tr>
  )
}

UserItem.propTypes = {
  index: PropTypes.number.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    is_admin: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
}

export default UserItem
