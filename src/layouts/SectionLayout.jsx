import { Title, Text } from '@tremor/react'
import PropTypes from 'prop-types'

function SectionLayout({ children, title, subtitle }) {
  return (
    <section className="h-full p-4 md:p-8 md:ml-64" id="customerSection">
      <article className="h-full">
        <Title className="text-2xl font-bold sm:text-4xl">{title}</Title>
        <Text className="text-sm sm:text-lg">{subtitle}</Text>
        {children}
      </article>
    </section>
  )
}

SectionLayout.propTypes = {
  children: PropTypes.array.isRequired,
}

export default SectionLayout
