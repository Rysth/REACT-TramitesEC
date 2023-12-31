import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="overflow-auto min-h-[24rem] max-h-96">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
