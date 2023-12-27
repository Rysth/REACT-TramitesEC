import PropTypes from 'prop-types'
import { processorActions } from '../../../redux/slices/ProcessorSlice'
import ProcessorForm from './ProcessorForm'
import TableModal from '../../../components/Table/TableModal'

function ProcessorModal({ openModal, closeModal }) {
  return (
    <TableModal
      openModal={openModal}
      closeModal={closeModal}
      formComponent={ProcessorForm}
      slice="processor"
      setEntitySelected={processorActions.setProcessorSelected}
    />
  )
}

ProcessorModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default ProcessorModal
