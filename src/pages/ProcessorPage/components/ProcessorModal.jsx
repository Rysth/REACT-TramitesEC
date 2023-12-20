import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { processorActions } from '../../../redux/slices/ProcessorSlice'
import ProcessorForm from './ProcessorForm'

function ProcessorModal({ openModal, closeModal }) {
  const dispatch = useDispatch()
  const { processorSelected } = useSelector((store) => store.processor)

  const headerMessage = processorSelected ? 'Actualizar Trámitador' : 'Nuevo Trámitador'

  useEffect(() => {
    if (!openModal) dispatch(processorActions.setProcessorSelected(''))
  }, [openModal])

  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]" size="lg" dismissible>
      <header className="p-2 py-4 text-center text-white border-b rounded-t-lg bg-gradient-to-l from-blue-700 to-indigo-700">
        <h3 className="text-xl sm:text-3xl">{headerMessage}</h3>
      </header>
      <Modal.Body>
        <ProcessorForm closeModal={closeModal} />
      </Modal.Body>
    </Modal>
  )
}

ProcessorModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default ProcessorModal
