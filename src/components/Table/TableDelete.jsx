import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Modal, Button } from 'flowbite-react'
import PropTypes from 'prop-types'

function TableDelete({ confirmationModal, setConfirmationModal, confirmDelete }) {
  return (
    <Modal show={confirmationModal} size="md" onClose={() => setConfirmationModal(false)} className="z-[9000]" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-800 h-14 w-14 sm:h-32 sm:w-32 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-700 dark:text-gray-400 sm:text-xl">
            ¿Estas seguro/a de querer eliminarlo?
          </h3>
          <div className="flex justify-center gap-2">
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
