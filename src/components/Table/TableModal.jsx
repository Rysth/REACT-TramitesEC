import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'

function TableModal({ openModal, closeModal, formComponent, slice, setEntitySelected }) {
  const dispatch = useDispatch()
  const { [`${slice}Selected`]: entitySelected } = useSelector((store) => store[slice])

  const headerMessage = entitySelected ? `Actualizar ${slice}` : `Nuevo ${slice}`

  useEffect(() => {
    if (!openModal) dispatch(setEntitySelected(''))
  }, [openModal, dispatch, setEntitySelected])

  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]" size="lg" dismissible>
      <header className="p-2 py-4 text-center text-white border-b rounded-t-lg bg-gradient-to-l from-blue-700 to-indigo-700">
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
  setEntitySelected: PropTypes.func.isRequired,
}

export default TableModal
