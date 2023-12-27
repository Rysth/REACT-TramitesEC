import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../Loading/Loading'

function TableModal({ openModal, closeModal, formComponent, slice, title, setEntitySelected }) {
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
      size="lg"
    >
      <header className="p-2 py-4 text-center text-white border-b rounded-t-md bg-[var(--CL-secondary)]">
        <h3 className="text-xl sm:text-3xl">{headerMessage}</h3>
      </header>
      <Modal.Body>{React.createElement(formComponent, { closeModal })}</Modal.Body>
    </Modal>
  )
}

TableModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  formComponent: PropTypes.elementType.isRequired,
  slice: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setEntitySelected: PropTypes.func.isRequired,
}

export default TableModal
