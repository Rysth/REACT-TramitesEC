import React, { useState } from 'react'
import PropTypes from 'prop-types'

function DateRangeModal({ onGenerate }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRange, setSelectedRange] = useState('')

  const handleRangeChange = (e) => {
    const range = e.target.value
    setSelectedRange(range)

    const today = new Date()
    const end = today.toISOString().split('T')[0]
    let start = end

    switch (range) {
      case 'today':
        break
      case '7days':
        start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]
        break
      case '30days':
        start = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0]
        break
      case 'year':
        start = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0]
        break
      default:
        setStartDate('')
        setEndDate('')
        return
    }

    setStartDate(start)
    setEndDate(end)
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value)
    setSelectedRange('')
  }

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value)
    setSelectedRange('')
  }

  const handleGenerate = () => {
    onGenerate(startDate, endDate)
    document.getElementById('dateRangeModal').close()
  }

  return (
    <dialog id="dateRangeModal" className="modal modal-bottom sm:modal-middle">
      <div className="p-0 modal-box">
        <header className="p-4 text-white bg-[var(--CL-primary)]">
          <h3 className="text-xl sm:text-2xl">Seleccionar Rango de Fechas</h3>
        </header>
        <div className="p-6 pb-0 space-y-4 modal-body">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rango Predefinido</label>
            <select className="w-full select select-bordered" value={selectedRange} onChange={handleRangeChange}>
              <option value="">Todos los Trámites</option>
              <option value="today">Hoy</option>
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="year">Último Año</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full input input-bordered"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full input input-bordered"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 pt-0 modal-action">
          <button className="btn btn-success" onClick={handleGenerate}>
            Generar Excel
          </button>
          <button className="btn btn-error" onClick={() => document.getElementById('dateRangeModal').close()}>
            Cancelar
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
