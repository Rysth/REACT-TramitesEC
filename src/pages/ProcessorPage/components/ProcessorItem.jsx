import PropTypes from 'prop-types'
import { FaWhatsapp } from 'react-icons/fa'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { processorActions } from '../../../redux/slices/ProcessorSlice'

function ProcessorItem({ index, processor, showModal, showConfirmation }) {
  const dispatch = useDispatch()
  const { activeUser } = useSelector((store) => store.authentication)

  const handleProcessorSelected = (processorID) => {
    dispatch(processorActions.setProcessorSelected(processorID))
    showModal()
  }

  const isAdmin = activeUser.is_admin

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        <span className="w-full text-white uppercase badge badge-primary badge-sm">{processor.user.username}</span>
      </td>
      <td>
        <a href={`/tramitadores/${processor.id}`} className="font-bold link link-hover">
          {processor.code}
        </a>
      </td>
      <td className="uppercase">{`${processor.first_name} ${processor.last_name}`}</td>
      <td>
        <a
          href={`https://api.whatsapp.com/send?phone=593${processor.phone}`}
          className="btn btn-success btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> Contactar
        </a>
      </td>
      <td className="flex items-center gap-1">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleProcessorSelected(processor.id)}
          disabled={!isAdmin}
        >
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(processorActions.setProcessorSelected(processor.id))
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

ProcessorItem.propTypes = {
  index: PropTypes.number.isRequired,
  processor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
}

export default ProcessorItem
