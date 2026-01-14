import PropTypes from 'prop-types'
import { Button } from '@tremor/react'
import { FaFileExcel } from 'react-icons/fa'
import { HiOutlineDocumentDownload } from 'react-icons/hi'
import { RiRefreshLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import DateRangeModal from '../components/DateRangeModal/DateRangeModal'
import { procedureActions } from '../redux/slices/ProcedureSlice'

function SectionLayout({ 
  title, 
  subtitle, 
  children, 
  excelMethod, 
  showUnpaid, 
  setShowUnpaid,
  showPrimeraVez,
  setShowPrimeraVez,
  showArchived,
  setShowArchived 
}) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((state) => state.authentication)
  const { selectedYear } = useSelector((state) => state.procedure)
  const isAdmin = activeUser.is_admin
  const location = useLocation()
  const isCollapsed = useSelector((state) => state.shared.isSidebarCollapsed)
  const [isExporting, setIsExporting] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, idx) => (2024 + idx).toString())

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

  const handleExcelClick = async () => {
    if (!excelMethod) return
    try {
      setIsExporting(true)
      const result = dispatch(excelMethod({ activeToken, isAdmin }))
      if (result?.finally) {
        await result.finally(() => {})
      } else if (result?.unwrap) {
        await result.unwrap()
      } else {
        await result
      }
    } finally {
      setIsExporting(false)
    }
  }

  const isTramitesPage =
    location.pathname.includes('tramites/licencias') || location.pathname.includes('tramites/vehiculares')

  return (
    <section
      className={`h-full p-4 overflow-hidden md:p-8 transition-all duration-300
      ${isCollapsed ? 'md:ml-[4.25rem]' : 'md:ml-60'}`}
      id="customerSection"
    >
      <article className="">
        <div className="flex flex-col items-start justify-between gap-2 text-center md:flex-row md:items-center md:text-left">
          <div className='w-max'>
            <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
            <h2 className="text-sm text-gray-500">{subtitle}</h2>
          </div>
          <div className="flex items-center gap-3">

         {
          isTramitesPage && (
            <fieldset className="flex items-center gap-2">
            <select value={selectedYear} onChange={handleYearChange} className="select select-bordered select-sm">
              <option value="">Todos los Años</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="text-white btn btn-sm btn-primary" onClick={handleClearYear}>
              <RiRefreshLine className="" />
              <span className="sr-only">Limpiar</span>
            </button>
          </fieldset>
          )
         }

            {/* Primera Vez Toggle (only show for licencias) */}
            {showPrimeraVez !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Primera Vez</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  checked={showPrimeraVez}
                  onChange={(e) => setShowPrimeraVez(e.target.checked)}
                />
              </div>
            )}

            {/* Existing Unpaid Toggle */}
            {showUnpaid !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Trámites sin Pago</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  checked={showUnpaid}
                  onChange={(e) => setShowUnpaid(e.target.checked)}
                />
              </div>
            )}

            {/* Show Archived Toggle */}
            {setShowArchived !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Ver Archivados</span>
                <input
                  type="checkbox"
                  className="toggle toggle-warning toggle-sm"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
              </div>
            )}
            
            {/* Excel Download Button */}
            {excelMethod && (
              <Button
                color="green"
                size="xs"
                onClick={handleExcelClick}
                icon={HiOutlineDocumentDownload}
                disabled={isExporting}
                loading={isExporting}
                className="text-xs"
              >
                {isExporting ? 'Generando...' : 'Generar Excel'}
              </Button>
            )}
          </div>
        </div>
        <main>{children}</main>
        <DateRangeModal onGenerate={handleGenerateExcel} />
      </article>
    </section>
  )
}

SectionLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  excelMethod: PropTypes.func,
  showUnpaid: PropTypes.bool,
  setShowUnpaid: PropTypes.func,
  showPrimeraVez: PropTypes.bool,
  setShowPrimeraVez: PropTypes.func,
  showArchived: PropTypes.bool,
  setShowArchived: PropTypes.func,
}

export default SectionLayout
