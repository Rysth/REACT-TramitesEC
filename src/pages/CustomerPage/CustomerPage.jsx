import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import HeaderLayout from '../../layouts/HeaderLayout'
import MainLayout from '../../layouts/MainLayout'
import TableLayout from '../../layouts/TableLayout'
import TableHeader from '../../components/Table/TableHeader'
import CustomerTable from './components/CustomerTable'
import { customerActions } from '../../redux/slices/CustomerSlice'
import ReactPaginate from 'react-paginate'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersArray } = useSelector((store) => store.customer)

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 30 // Set the number of items per page

  const pageCount = Math.ceil(customersArray.length / itemsPerPage)

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentItems = customersArray.slice(startIndex, endIndex)

  const restartCurrentPage = () => setCurrentPage(0)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  useEffect(() => {
    console.log(currentPage)
  }, [currentItems])

  return (
    <SectionLayout>
      <HeaderLayout />
      <MainLayout>
        <TableHeader
          title="Listado de Clientes"
          searchMethod={customerActions.searchCustomer}
          restartCurrentPage={restartCurrentPage}
        />
        <TableLayout>
          <CustomerTable currentItems={currentItems} />
        </TableLayout>
        <footer>
          <ReactPaginate
            previousLabel={'<<'}
            forcePage={currentPage}
            nextLabel={'>>'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={'flex items-center gap-1 justify-center sm:justify-end mx-auto text-sm p-4'}
            subContainerClassName={'mx-2'}
            activeClassName={'active'}
            pageLinkClassName="p-2 outline-1 block px-3"
          />
        </footer>
      </MainLayout>
    </SectionLayout>
  )
}

export default CustomerPage
