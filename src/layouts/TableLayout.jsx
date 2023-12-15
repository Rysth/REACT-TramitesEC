import PropTypes from 'prop-types'

function TableLayout({ children }) {
  return <div className="overflow-auto h-[26rem]">{children}</div>
}

TableLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default TableLayout
