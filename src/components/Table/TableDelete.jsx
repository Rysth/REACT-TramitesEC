import PropTypes from 'prop-types'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function TableDelete({ confirmationModal, setConfirmationModal, confirmDelete }) {
  return (
    <dialog
      id="confirmDeleteModal"
      className={`modal ${confirmationModal ? 'modal-open' : ''} modal-bottom sm:modal-middle`}
    >
      <div className="p-0 modal-box">
        <header className="p-4 text-white bg-[var(--CL-primary)]">
          <h3 className="text-xl sm:text-2xl">Confirmar Eliminación</h3>
        </header>
        <div className="p-6 pb-0 text-center modal-body">
          <HiOutlineExclamationCircle className="w-24 h-24 mx-auto text-gray-500" />
          <h3 className="mt-4 text-lg leading-5 text-gray-700 sm:text-xl md:text-2xl">
            ¿Estás seguro/a de querer eliminarlo?
          </h3>
          <p className="mt-2 text-sm text-gray-500">¡Es irreversible!</p>
        </div>
        <div className="flex justify-end p-4 pt-0 modal-action">
          <button
            className="btn btn-error"
            onClick={() => {
              confirmDelete()
              setConfirmationModal(false)
            }}
          >
            Confirmar
          </button>
          <button className="btn" onClick={() => setConfirmationModal(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </dialog>
  )
}

TableDelete.propTypes = {
  confirmationModal: PropTypes.bool.isRequired,
  setConfirmationModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
}

export default TableDelete
