import PropTypes from 'prop-types'

function MainLayout({ children }) {
  return <main className="mt-4 rounded-xl">{children}</main>
}

MainLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default MainLayout
