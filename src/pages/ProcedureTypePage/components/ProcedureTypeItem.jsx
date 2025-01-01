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
        {procedureType.has_licenses ? (
          <span className="badge badge-success badge-sm">Licencias</span>
        ) : (
          <span className="badge badge-info badge-sm">Vehicular</span>
        )}
      </td>
      <td>
        <span className="w-full uppercase">{procedureType.name}</span>
      </td>
      <td className="flex items-center gap-1">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleProcedureTypeSelected(procedureType.id)}
          disabled={!isAdmin}
        >
          <HiPencilSquare />
        </button>
        <button
          className="hidden btn btn-sm btn-error"
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
    has_licenses: PropTypes.bool.isRequired,
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcedureTypeItem
