import PropTypes from 'prop-types'
import { customerActions } from '../../../redux/slices/CustomerSlice'
import CustomerForm from './CustomerForm'
import TableModal from '../../../components/Table/TableModal'

function CustomerModal({ openModal, closeModal }) {
  return (
    <TableModal
      openModal={openModal}
      closeModal={closeModal}
      formComponent={CustomerForm}
      slice="customer"
      setEntitySelected={customerActions.setCustomerSelected}
    />
  )
}

CustomerModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default CustomerModal
