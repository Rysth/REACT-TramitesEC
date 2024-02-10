import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="overflow-auto min-h-96 max-h-96 md:min-h-[30rem] md:max-h-[30rem]">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
