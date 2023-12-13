import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavBar from '../../components/NavBar/NavBar'
import TableSearch from '../../components/Table/TableSearch'
import CustomerStats from './components/CustomerStats'
import CustomerTable from './components/CustomerTable'
import { getClientes, customerActions } from '../../redux/slices/CustomerSlice'

function Customer() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <section className="px-4 sm:px-8 sm:pb-4 sm:ml-64" id="customerSection">
      <header>
        <NavBar />
        <CustomerStats />
        <TableSearch title="Listado de Clientes" searchElement={customerActions.searchCustomer} />
      </header>
      <main>
        <CustomerTable />
      </main>
    </section>
  )
}

export default Customer
