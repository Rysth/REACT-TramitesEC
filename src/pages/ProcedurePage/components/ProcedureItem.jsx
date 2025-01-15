import PropTypes from 'prop-types'
import { FaWhatsapp } from 'react-icons/fa'
import { HiMiniTrash, HiPencilSquare } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProcedureDetails, procedureActions } from '../../../redux/slices/ProcedureSlice'

function ProcedureItem({ index, procedure, showModal, showConfirmation, hasLicenses }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((store) => store.authentication)

  const handleProcedureSelected = (procedureID) => {
    dispatch(fetchProcedureDetails({ activeToken, procedureId: procedureID }))
      .then(() => {
        showModal()
      })
      .catch((error) => {
        console.error('Error fetching procedure details:', error)
      })
  }

  const statusColor =
    procedure.status.id === 1 || procedure.status.id === 3 ? 'info' : procedure.status.id === 2 ? 'accent' : 'success'
  const isDirect = procedure.customer?.is_direct

  return (
    <tr className="hover *:py-1 *:text-[0.8rem]">
      <th>{index}</th>
      <td>
        {!isDirect && procedure.processor ? (
          <span className="!w-max font-bold text-center uppercase border-transparent badge badge-sm">
            {`${procedure.processor.first_name.split(' ')[0]} ${procedure.processor.last_name.split(' ')[0]}`}
          </span>
        ) : (
          <span className="font-bold text-center uppercase border-transparent badge badge-sm !w-max">
            Cliente Directo
          </span>
        )}
      </td>
      <td>
        <span className={` font-bold text-center uppercase border-transparent badge badge-sm !w-max`}>
          {procedure.status.name}
        </span>
      </td>
      <td>{procedure.procedure_type.name}</td>
      <td>{new Date(procedure.created_at).toISOString().split('T')[0]}</td>
      <td className="uppercase">
        {hasLicenses ? (
          procedure.customer ? (
            <a href={`/clientes/${procedure.customer.id}`} className="link link-hover">
              {`${procedure.customer.first_name.split(' ')[0]} ${procedure.customer.last_name}`}
            </a>
          ) : (
            <p>No Customer</p>
          )
        ) : (
          <p>{procedure.plate}</p>
        )}
      </td>
      <td>
        {procedure.is_paid ? (
          <span className="badge-sm badge">Pagado</span>
        ) : (
          <span className="badge-sm badge badge-error">Pendiente</span>
        )}
      </td>
      <td className="flex items-center gap-1">
        {procedure.customer?.is_direct ? (
          <a
            href={`https://api.whatsapp.com/send?phone=593${procedure.customer.phone}`}
            className="btn btn-success btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        ) : (
          <a
            href={`https://api.whatsapp.com/send?phone=593${procedure.processor?.phone}`}
            className="btn btn-success btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        )}
        <button className="btn btn-sm btn-primary" onClick={() => handleProcedureSelected(procedure.id)}>
          <HiPencilSquare />
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            dispatch(procedureActions.setProcedureSelected(procedure.id))
            showConfirmation(true)
          }}
        >
          <HiMiniTrash />
        </button>
      </td>
    </tr>
  )
}

ProcedureItem.propTypes = {
  index: PropTypes.number.isRequired,
  procedure: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
    cost_pending: PropTypes.number.isRequired,
    profit: PropTypes.number.isRequired,
    profit_pending: PropTypes.number.isRequired,
    processor: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }),
    customer: PropTypes.shape({
      id: PropTypes.number.isRequired,
      identification: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
    license: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
  showConfirmation: PropTypes.func.isRequired,
  hasLicenses: PropTypes.bool.isRequired,
}

export default ProcedureItem
