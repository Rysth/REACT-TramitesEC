import PropTypes from 'prop-types'

function MainLayout({ children }) {
  return <main className="flex flex-col mt-5 mb-10 bg-white shadow sm:gap-0 rounded-xl">{children}</main>
}

MainLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default MainLayout
