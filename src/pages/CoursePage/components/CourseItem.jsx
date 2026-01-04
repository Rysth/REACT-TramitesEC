import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { courseActions } from '../../../redux/slices/CourseSlice'

function CourseItem({ index, course, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleCourseSelected = (courseID) => {
    dispatch(courseActions.setCourseSelected(courseID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        <span className="w-full uppercase">{course.name}</span>
      </td>
      <td>
        {course.active ? (
          <span className="badge badge-success badge-sm">Activo</span>
        ) : (
          <span className="badge badge-ghost badge-sm">Inactivo</span>
        )}
      </td>
      <td className="flex items-center gap-1">
        <button className="btn btn-sm btn-primary" onClick={() => handleCourseSelected(course.id)} disabled={!isAdmin}>
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(courseActions.setCourseSelected(course.id))
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

CourseItem.propTypes = {
  index: PropTypes.number.isRequired,
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default CourseItem
