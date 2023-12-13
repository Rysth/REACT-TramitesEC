import React from 'react'
import { customerActions } from '../../redux/slices/CustomerSlice'
import NavBar from '../../components/NavBar/NavBar'
import TableSearch from '../../components/Table/TableSearch'
import CustomerTable from './components/CustomerTable'
import CustomerStats from './components/CustomerStats'

function Customer() {
  return (
    <section className="px-4 sm:px-8 sm:py-2 sm:ml-64">
      <NavBar />
      <CustomerStats />
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
