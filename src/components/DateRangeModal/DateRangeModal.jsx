import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'flowbite-react'
import { Button, TextInput } from '@tremor/react'

function DateRangeModal({ openModal, closeModal, onGenerate }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleGenerate = () => {
    onGenerate(startDate, endDate)
    closeModal()
  }

  return (
    <Modal
      show={openModal}
      onClose={closeModal}
      size="lg" // You can adjust the size according to your needs
      className={`z-[9000]`} // Ensure the modal is on top
    >
      <header className="p-2 py-4 sm:p-6 text-center text-white rounded-t-md bg-[var(--CL-primary)]">
        <h3 className="text-xl sm:text-2xl">Seleccionar Rango de Fechas</h3>
        <p className="text-sm text-gray-300">Dejar en blanco si deseas traer todos los registros</p>
      </header>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="red" onClick={closeModal}>
          Cancelar
        </Button>
        <Button color="green" onClick={handleGenerate}>
          Generar Excel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

DateRangeModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
}

export default DateRangeModal
