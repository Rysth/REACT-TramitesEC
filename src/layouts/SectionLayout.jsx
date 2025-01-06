import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FaFileExcel } from 'react-icons/fa'
import { RiRefreshLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import DateRangeModal from '../components/DateRangeModal/DateRangeModal'
import { procedureActions } from '../redux/slices/ProcedureSlice'

function SectionLayout({ children, title, subtitle, excelMethod, showUnpaid, setShowUnpaid }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((state) => state.authentication)
  const { selectedYear } = useSelector((state) => state.procedure)
  const isAdmin = activeUser.is_admin
  const location = useLocation()

  const handleGenerateExcel = (startDate, endDate) => {
    dispatch(excelMethod({ activeToken, isAdmin, startDate, endDate }))
  }

  const handleYearChange = (event) => {
    const year = event.target.value
    dispatch(procedureActions.setYear(year))
  }

  const handleClearYear = () => {
    dispatch(procedureActions.setYear(''))
  }

  const isTramitesPage =
    location.pathname.includes('tramites/licencias') || location.pathname.includes('tramites/vehiculares')

  return (
    <section className="h-full p-4 overflow-hidden md:p-8 md:ml-60" id="customerSection">
      <article className="">
        <div className="flex flex-col items-center justify-between h-full gap-2 text-center md:text-left md:flex-row">
          <header className="space-y-1">
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
            <p className="text-sm sm:text-base text-neutral-600 font-italic">{subtitle}</p>
          </header>
          <div className="flex items-center gap-2">
            {isTramitesPage && (
              <>
                <div className="form-control">
                  <label className="gap-2 cursor-pointer label">
                    <span className="text-sm label-text">Trámites sin Pago</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={showUnpaid}
                      onChange={(e) => setShowUnpaid(e.target.checked)}
                    />
                  </label>
                </div>
                <fieldset className="flex items-center gap-2">
                  <select value={selectedYear} onChange={handleYearChange} className="select select-bordered select-sm">
                    <option value="">Todos los Años</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                  <button className="text-white btn btn-sm btn-primary" onClick={handleClearYear}>
                    <RiRefreshLine className="" />
                    <span className="sr-only">Limpiar</span>
                  </button>
                </fieldset>
              </>
            )}
            <button
              onClick={() => document.getElementById('dateRangeModal').showModal()}
              className="flex items-center text-white btn btn-success btn-sm"
            >
              <span className="inline-block">Generar Excel</span>
              <FaFileExcel className="inline-block ml-1" />
            </button>
          </div>
        </div>
        <main>{children}</main>
        <DateRangeModal onGenerate={handleGenerateExcel} />
      </article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  excelMethod: PropTypes.func.isRequired,
  showUnpaid: PropTypes.bool,
  setShowUnpaid: PropTypes.func,
}

export default SectionLayout
