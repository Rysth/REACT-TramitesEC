import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableHeading from '../../components/Table/TableHeading'
import TableSearch from '../../components/Table/TableSearch'
import CustomerStats from './components/CustomerStats'
import CustomerTable from './components/CustomerTable'
import CustomerFooter from './components/CustomerFooter'
import { getClientes, customerActions } from '../../redux/slices/CustomerSlice'
import { Spinner } from 'flowbite-react'

function Customer() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading } = useSelector((store) => store.customer)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  if (loading) {
    return (
      <div className="grid h-screen px-4 text-center place-items-center sm:px-8 sm:pb-4 sm:ml-64">
        <Spinner aria-label="Center-aligned spinner example" size="xl" className="w-20 h-20" color="purple" />
      </div>
    )
  }

  return (
    <section className="h-full px-4 sm:px-8 sm:pb-4 sm:ml-64" id="customerSection">
      <header>
        <TableHeading />
        <CustomerStats />
        <TableSearch title="Listado de Clientes" searchElement={customerActions.searchCustomer} />
      </header>
      <main>
        <CustomerTable />
      </main>
      <footer>
        <CustomerFooter />
      </footer>
    </section>
  )
}

export default Customer
