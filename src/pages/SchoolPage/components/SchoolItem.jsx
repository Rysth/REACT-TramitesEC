import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { schoolActions } from '../../../redux/slices/SchoolSlice'

function SchoolItem({ index, school, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleSchoolSelected = (schoolID) => {
    dispatch(schoolActions.setSchoolSelected(schoolID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        <span className="w-full uppercase">{school.name}</span>
      </td>
      <td>
        {school.active ? (
          <span className="badge badge-success badge-sm">Activo</span>
        ) : (
          <span className="badge badge-ghost badge-sm">Inactivo</span>
        )}
      </td>
      <td className="flex items-center gap-1">
        <button className="btn btn-sm btn-primary" onClick={() => handleSchoolSelected(school.id)} disabled={!isAdmin}>
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(schoolActions.setSchoolSelected(school.id))
            showConfirmation(true)
          }}
          disabled={!isAdmin}
        >
          <HiMiniTrash />
        </button>
      </td>
    </tr>
  )
}

SchoolItem.propTypes = {
  index: PropTypes.number.isRequired,
  school: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default SchoolItem
