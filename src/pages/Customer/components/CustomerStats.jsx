import { useSelector } from 'react-redux'
import { Card, Grid, Metric, Text } from '@tremor/react'

function CustomerStats() {
  const customerStats = useSelector((store) => store.customer.customerStats)

  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-2 mb-2 outline-none sm:gap-4 md:gap-6 lg:gap-8 text">
      {customerStats.map((item) => (
        <Card key={item.title} className={`py-3 border-none shadow-lg outline-none text-xs ${item.color}`}>
          <Text className="!text-white">{item.title}</Text>
          <Metric className="!text-white">{item.metric}</Metric>
        </Card>
      ))}
    </Grid>
  )
}

export default CustomerStats
