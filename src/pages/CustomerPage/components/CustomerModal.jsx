import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import { customerActions } from '../../../redux/slices/CustomerSlice'
import CustomerForm from './CustomerForm'

function CustomerModal({ openModal, closeModal }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!openModal) dispatch(customerActions.setCustomerSelected(''))
  }, [openModal])

  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]" size="lg" dismissible>
      <header className="p-4 border-b">
        <h3 className="text-xl sm:text-2xl">Nuevo Cliente</h3>
      </header>
      <Modal.Body>
        <CustomerForm closeModal={closeModal} />
      </Modal.Body>
    </Modal>
  )
}

CustomerModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default CustomerModal
