import PropTypes from 'prop-types'

function SectionLayout({ children }) {
  return (
    <section className="h-full p-4 md:p-8 sm:pb-4 md:ml-64" id="customerSection">
      <article className="h-full">{children}</article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default SectionLayout
