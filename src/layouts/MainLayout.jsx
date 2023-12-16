import PropTypes from 'prop-types'

function MainLayout({ children }) {
  return <main className="flex flex-col mt-5 mb-10 shadow-md sm:gap-0 shadow-black/15 rounded-2xl">{children}</main>
}

MainLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default MainLayout
