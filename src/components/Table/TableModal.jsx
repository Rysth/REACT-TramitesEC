import { Modal } from 'flowbite-react'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function TableModal({
  openModal,
  closeModal,
  formComponent,
  slice,
  title,
  setEntitySelected,
  modalSize,
  refetchFunction,
}) {
  const dispatch = useDispatch()
  const { [`${slice}Selected`]: entitySelected, loading } = useSelector((store) => store[slice])

  const headerMessage = entitySelected ? `Actualizar ${title}` : `Nuevo ${title}`

  useEffect(() => {
    if (!openModal) dispatch(setEntitySelected(''))
  }, [openModal, dispatch, setEntitySelected])

  return (
    <Modal
      show={openModal}
      position="center"
      onClose={closeModal}
      className={`z-[9000] ${loading && 'pointer-events-none grayscale'}`}
      size={modalSize ? modalSize : 'lg'}
    >
      <header className="p-2 py-4 sm:p-6 text-center text-white rounded-t-md bg-[var(--CL-primary)]">
        <h3 className="text-xl sm:text-3xl">{headerMessage}</h3>
      </header>
      <Modal.Body>{React.createElement(formComponent, { closeModal, refetchFunction })}</Modal.Body>
    </Modal>
  )
}

TableModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
  formComponent: PropTypes.elementType.isRequired,
  slice: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setEntitySelected: PropTypes.func.isRequired,
  modalSize: PropTypes.string,
}

export default TableModal
