import React from 'react'
import { Card, Grid, Metric, Text } from '@tremor/react'
import { customerActions } from '../../redux/slices/CustomerSlice'
import NavBar from '../../components/NavBar/NavBar'
import TableSearch from '../../components/Table/TableSearch'
import CustomerTable from './components/CustomerTable'
import { useSelector } from 'react-redux'

function Customer() {
  const customerStats = useSelector((store) => store.customer.customerStats)

  return (
    <section className="px-4 sm:px-8 sm:py-2 sm:ml-64">
      <NavBar />
      <Grid numItemsSm={2} numItemsLg={3} className="gap-2 mt-2 mb-8 outline-none sm:gap-4 md:gap-6 lg:gap-8 text">
        {customerStats.map((item) => (
          <Card key={item.title} className={`py-3 border-none shadow-lg outline-none text-xs ${item.color}`}>
            <Text className="!text-white">{item.title}</Text>
            <Metric className="!text-white">{item.metric}</Metric>
          </Card>
        ))}
      </Grid>
      <div className="relative sm:rounded-2xl">
        <TableSearch
          title="Listado de Clientes"
          searchElement={customerActions.searchCustomer}
          statusElement={customerActions.statusCustomer}
        />
        <CustomerTable />
      </div>
    </section>
  )
}

export default Customer
