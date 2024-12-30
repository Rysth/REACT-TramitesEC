import { Text, Title, Button } from '@tremor/react'
import PropTypes from 'prop-types'
import { FaFileExcel } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import DateRangeModal from '../components/DateRangeModal/DateRangeModal'

function SectionLayout({ children, title, subtitle, excelMethod }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((state) => state.authentication)
  const isAdmin = activeUser.is_admin

  const handleGenerateExcel = (startDate, endDate) => {
    dispatch(excelMethod({ activeToken, isAdmin, startDate, endDate }))
  }

  return (
    <section className="h-full p-4 overflow-hidden md:p-8 md:ml-60" id="customerSection">
      <article className="">
        <div className="flex flex-col items-center justify-between h-full gap-2 text-center md:text-left md:flex-row">
          <header className="space-y-1">
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
            <p className="text-sm sm:text-base text-neutral-600 font-italic">{subtitle}</p>
          </header>
          <button
            onClick={() => document.getElementById('dateRangeModal').showModal()}
            className="flex items-center text-white btn btn-success"
          >
            <span className="inline-block">Generar Excel</span>
            <FaFileExcel className="inline-block ml-1" />
          </button>
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
}

export default SectionLayout
