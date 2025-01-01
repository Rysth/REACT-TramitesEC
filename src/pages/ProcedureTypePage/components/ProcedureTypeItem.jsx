import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { procedureTypeActions } from '../../../redux/slices/ProcedureTypeSlice'

function ProcedureTypeItem({ index, procedureType, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleProcedureTypeSelected = (procedureTypeID) => {
    dispatch(procedureTypeActions.setProcedureTypeSelected(procedureTypeID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        <span className="w-full text-white uppercase badge badge-primary badge-sm">{procedureType.name}</span>
      </td>
      <td>{procedureType.description}</td>
      <td className="flex items-center gap-1">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleProcedureTypeSelected(procedureType.id)}
          disabled={!isAdmin}
        >
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(procedureTypeActions.setProcedureTypeSelected(procedureType.id))
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

ProcedureTypeItem.propTypes = {
  index: PropTypes.number.isRequired,
  procedureType: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcedureTypeItem
