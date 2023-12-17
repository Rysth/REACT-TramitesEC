import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { customerActions } from '../../../redux/slices/CustomerSlice'
import CustomerForm from './CustomerForm'

function CustomerModal({ openModal, closeModal }) {
  const dispatch = useDispatch()
  const { customerSelected } = useSelector((store) => store.customer)

  const headerMessage = customerSelected ? 'Actualizar Cliente' : 'Nuevo Cliente'

  useEffect(() => {
    if (!openModal) dispatch(customerActions.setCustomerSelected(''))
  }, [openModal])

  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]" size="lg" dismissible>
      <header className="p-2 py-4 text-center text-white border-b rounded-t-lg bg-gradient-to-l from-blue-700 to-indigo-700">
        <h3 className="text-xl sm:text-3xl">{headerMessage}</h3>
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
