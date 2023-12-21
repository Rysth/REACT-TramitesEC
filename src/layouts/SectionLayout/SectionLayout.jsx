import PropTypes from 'prop-types'

function SectionLayout({ children }) {
  return (
    <section className="h-full p-4 sm:p-8 sm:pb-4 sm:ml-60" id="customerSection">
      <article className="h-full">{children}</article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default SectionLayout
