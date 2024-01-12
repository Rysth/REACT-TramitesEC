import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="min-h-[31.5rem] max-h-[31.5rem] overflow-auto">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
