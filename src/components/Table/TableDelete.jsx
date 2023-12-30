import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Modal, Button } from 'flowbite-react'
import PropTypes from 'prop-types'

function TableDelete({ confirmationModal, setConfirmationModal, confirmDelete }) {
  return (
    <Modal show={confirmationModal} size="sm" onClose={() => setConfirmationModal(false)} className="z-[9000]" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="w-24 h-24 mx-auto text-gray-800 sm:h-32 sm:w-32 dark:text-gray-200" />
          <h3 className="text-lg font-normal leading-5 text-gray-700 sm:text-xl md:text-2xl">
            ¿Estás seguro/a de querer eliminarlo?
          </h3>
          <p className="text-xs text-gray-500">¡Es irreversible!</p>
          <div className="flex justify-center gap-2 mt-5">
            <Button
              color="failure"
              onClick={() => {
                confirmDelete()
                setConfirmationModal(false)
              }}
            >
              Confirmar
            </Button>
            <Button color="dark" onClick={() => setConfirmationModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

TableDelete.propTypes = {
  confirmationModal: PropTypes.bool.isRequired,
  setConfirmationModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
}

export default TableDelete
