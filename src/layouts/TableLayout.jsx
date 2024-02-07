import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="overflow-auto min-h-96 max-h-[30rem]">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
