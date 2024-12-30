import React, { useState } from 'react'
import PropTypes from 'prop-types'

function DateRangeModal({ onGenerate }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleGenerate = () => {
    onGenerate(startDate, endDate)
    document.getElementById('dateRangeModal').close()
  }

  return (
    <dialog id="dateRangeModal" className="modal modal-bottom sm:modal-middle">
      <div className="p-0 modal-box">
        <header className="p-4 text-white bg-[var(--CL-primary)]">
          <h3 className="text-xl sm:text-2xl">Seleccionar Rango de Fechas</h3>
          <p className="text-sm text-gray-300">Dejar en blanco si deseas traer todos los registros</p>
        </header>
        <div className="p-6 pb-0 modal-body ">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2 ">
              <label className="block text-sm font-medium text-gray-700">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full input input-bordered"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full input input-bordered"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 pt-0 modal-action ">
          <button className="btn btn-error" onClick={() => document.getElementById('dateRangeModal').close()}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={handleGenerate}>
            Generar Excel
          </button>
        </div>
      </div>
    </dialog>
  )
}

DateRangeModal.propTypes = {
  onGenerate: PropTypes.func.isRequired,
}

export default DateRangeModal
