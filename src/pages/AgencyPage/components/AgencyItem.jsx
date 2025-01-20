import PropTypes from 'prop-types'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { agencyActions } from '../../../redux/slices/AgencySlice'

function AgencyItem({ index, agency, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleAgencySelected = (agencyID) => {
    dispatch(agencyActions.setAgencySelected(agencyID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        {agency.has_licenses ? (
          <span className="badge badge-success badge-sm">Licencias</span>
        ) : (
          <span className="badge badge-info badge-sm">Vehicular</span>
        )}
      </td>
      <td>
        <span className="w-full uppercase">{agency.name}</span>
      </td>
      <td className="flex items-center gap-1">
        <button className="btn btn-sm btn-primary" onClick={() => handleAgencySelected(agency.id)} disabled={!isAdmin}>
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(agencyActions.setAgencySelected(agency.id))
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

AgencyItem.propTypes = {
  index: PropTypes.number.isRequired,
  agency: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    has_licenses: PropTypes.bool.isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default AgencyItem
