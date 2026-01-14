import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare, HiArchiveBox, HiArchiveBoxXMark } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { procedureTypeActions } from '../../../redux/slices/ProcedureTypeSlice'

function ProcedureTypeItem({ index, procedureType, showModal, showConfirmation, isAdmin, handleToggleArchive }) {
  const dispatch = useDispatch()

  const handleProcedureTypeSelected = (procedureTypeID) => {
    dispatch(procedureTypeActions.setProcedureTypeSelected(procedureTypeID))
    showModal()
  }

  return (
    <tr className={`hover *:py-1 *:text-[0.8rem] ${procedureType.archived ? 'opacity-60 bg-gray-100' : ''}`}>
      <th>{index}</th>

      <td>
        {procedureType.has_licenses ? (
          <span className="badge badge-success badge-sm">Licencias</span>
        ) : (
          <span className="badge badge-info badge-sm">Vehicular</span>
        )}
      </td>
      <td>
        {procedureType.archived ? (
          <span className="badge badge-warning badge-sm">Archivado</span>
        ) : (
          <span className="badge badge-success badge-sm">Activo</span>
        )}
      </td>
      <td>
        <span className="w-full uppercase">{procedureType.name}</span>
      </td>
      <td className="flex items-center gap-1">
        {isAdmin ? (
          <>
            <button className="btn btn-sm btn-primary" onClick={() => handleProcedureTypeSelected(procedureType.id)}>
              <HiPencilSquare />
            </button>
            <button
              className={`btn btn-sm ${procedureType.archived ? 'btn-success' : 'btn-warning'}`}
              onClick={() => handleToggleArchive(procedureType.id)}
              title={procedureType.archived ? 'Desarchivar' : 'Archivar'}
            >
              {procedureType.archived ? <HiArchiveBoxXMark /> : <HiArchiveBox />}
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                dispatch(procedureTypeActions.setProcedureTypeSelected(procedureType.id))
                showConfirmation(true)
              }}
            >
              <HiMiniTrash />
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
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
    archived: PropTypes.bool,
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  handleToggleArchive: PropTypes.func.isRequired,
}

export default ProcedureTypeItem
