import { AreaChart, Card, Grid, Metric, Tab, TabGroup, TabList, TabPanel, TabPanels, Text, Title } from '@tremor/react'
import React from 'react'
import SectionLayout from '../../layouts/SectionLayout'

function DashboardPage() {
  const data = [
    {
      Month: 'Jan 21',
      Sales: 2890,
      Profit: 2400,
    },
    {
      Month: 'Feb 21',
      Sales: 1890,
      Profit: 1398,
    },
    // ...
    {
      Month: 'Jan 22',
      Sales: 3890,
      Profit: 2980,
    },
  ]

  const categories = [
    {
      title: 'Ganancias',
      metric: '$ 23,456',
    },
    {
      title: 'Trámites',
      metric: '$ 13,123',
    },
    {
      title: 'Clientes',
      metric: '456',
    },
  ]

  const valueFormatter = (number) => `$${Intl.NumberFormat('us').format(number).toString()}`

  return (
    <SectionLayout>
      <Title className="text-xl font-bold sm:text-2xl md:text-4xl">Dashboard</Title>
      <Text className="text-xl">Información Estadística General</Text>
      <TabGroup className="pb-10 mt-6">
        <TabList>
          <Tab>Página 1</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-3">
              {categories.map((item) => (
                <Card key={item.title} decoration="top" decorationColor="indigo">
                  <Text>{item.title}</Text>
                  <Metric>{item.metric}</Metric>
                </Card>
              ))}
            </Grid>
            <div className="mt-6">
              <Card>
                <Title>Rendimiento</Title>
                <Text>Comparación entre Trámites y Ganancias</Text>
                <AreaChart
                  className="h-80"
                  data={data}
                  categories={['Sales', 'Profit']}
                  index="Month"
                  colors={['indigo', 'fuchsia']}
                  yAxisWidth={60}
                  valueFormatter={valueFormatter}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="m-6">
              <Card>
                <div className="h-96" />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </SectionLayout>
  )
}

export default DashboardPage
