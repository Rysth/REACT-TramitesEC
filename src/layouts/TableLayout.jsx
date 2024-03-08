import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="overflow-auto min-h-[35rem]">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
