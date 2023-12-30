import { Card, Grid, Metric, Text } from '@tremor/react'
import PropTypes from 'prop-types'

function TableStats({ categories }) {
  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-3 mt-3">
      {categories.map((item) => (
        <Card key={item.title} decoration="top" decorationColor={item.color}>
          <Text>{item.title}</Text>
          <Metric>{item.metric}</Metric>
        </Card>
      ))}
    </Grid>
  )
}

TableStats.propTypes = {
  categories: PropTypes.array.isRequired,
}

export default TableStats
