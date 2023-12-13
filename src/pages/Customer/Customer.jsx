import React from 'react'
import { customerActions } from '../../redux/slices/CustomerSlice'
import NavBar from '../../components/NavBar/NavBar'
import TableSearch from '../../components/Table/TableSearch'
import CustomerTable from './components/CustomerTable'
import CustomerStats from './components/CustomerStats'

function Customer() {
  return (
    <section className="px-4 sm:px-8 sm:pb-4 sm:ml-64" id="customerSection">
      <NavBar />
      <CustomerStats />
      <main>
        <TableSearch
          title="Listado de Clientes"
          searchElement={customerActions.searchCustomer}
          statusElement={customerActions.statusCustomer}
        />
        <CustomerTable />
      </main>
    </section>
  )
}

export default Customer
