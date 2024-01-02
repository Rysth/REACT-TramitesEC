import { Text, Title } from '@tremor/react'
import PropTypes from 'prop-types'

function SectionLayout({ children, title, subtitle }) {
  return (
    <section className="h-full p-4 md:p-8 md:ml-64" id="customerSection">
      <article className="h-full">
        <Title className="text-2xl font-bold sm:text-4xl">{title}</Title>
        <Text className="text-sm sm:text-base">{subtitle}</Text>
        {children}
      </article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

export default SectionLayout
