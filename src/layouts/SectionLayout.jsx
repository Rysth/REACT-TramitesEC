import { Text, Title, Button } from '@tremor/react'
import PropTypes from 'prop-types'
import { FaFileExcel } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

function SectionLayout({ children, title, subtitle, excelMethod }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((state) => state.authentication)
  const isAdmin = activeUser.is_admin

  return (
    <section className="h-full p-4 overflow-hidden md:p-8 md:ml-60" id="customerSection">
      <article className="">
        <div className="flex items-center justify-between h-full">
          <div>
            <Title className="!text-3xl font-bold text-gray-900 sm:!text-4xl">{title}</Title>
            <Text className="text-sm sm:text-base">{subtitle}</Text>
          </div>
          <Button
            onClick={() => {
              dispatch(excelMethod({ activeToken, isAdmin }))
            }}
            color="green"
            className="flex items-center"
          >
            <span className="inline-block">Generar Excel</span>
            <FaFileExcel className="inline-block ml-1" />
          </Button>
        </div>
        <main>{children}</main>
      </article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

export default SectionLayout
