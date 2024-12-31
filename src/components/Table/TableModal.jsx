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
  refetchFunction,
  modalSize,
}) {
  const dispatch = useDispatch()
  const { [`${slice}Selected`]: entitySelected, loading } = useSelector((store) => store[slice])

  const headerMessage = entitySelected ? `Actualizar ${title}` : `Nuevo ${title}`

  useEffect(() => {
    if (!openModal) dispatch(setEntitySelected(''))
  }, [openModal, dispatch, setEntitySelected])

  return (
    <dialog id="tableModal" className={`modal ${openModal ? 'modal-open' : ''} modal-bottom sm:modal-middle z-[1000]`}>
      <div
        className={`modal-box ${modalSize && '!min-w-[70rem]'} z-[1000] p-0 ${loading && 'pointer-events-none grayscale '} $`}
      >
        <header className="p-4 py-5 text-center text-white bg-[var(--CL-primary)]">
          <h3 className="text-xl sm:text-3xl">
            {headerMessage} {modalSize}
          </h3>
        </header>
        <div className="p-6 pb-0 modal-body">{React.createElement(formComponent, { closeModal, refetchFunction })}</div>
      </div>
    </dialog>
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
