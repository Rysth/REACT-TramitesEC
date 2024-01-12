import PropTypes from 'prop-types'

function MainLayout({ children }) {
  return <main className="h-full mt-4 rounded-xl">{children}</main>
}

MainLayout.propTypes = {
  children: PropTypes.array.isRequired || PropTypes.object.isRequired,
}

export default MainLayout
