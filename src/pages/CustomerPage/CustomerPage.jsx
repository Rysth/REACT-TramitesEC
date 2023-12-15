import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import HeaderLayout from '../../layouts/HeaderLayout'
import MainLayout from '../../layouts/MainLayout'
import TableHeader from '../../components/Table/TableHeader'
import { Button, Table } from 'flowbite-react'
import { customerActions } from '../../redux/slices/CustomerSlice'

import ReactPaginate from 'react-paginate'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersArray } = useSelector((store) => store.customer)

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 20 // Set the number of items per page

  const pageCount = Math.ceil(customersArray.length / itemsPerPage)

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentItems = customersArray.slice(startIndex, endIndex)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <HeaderLayout />
      <MainLayout>
        <TableHeader title="Listado de Clientes" searchMethod={customerActions.searchCustomer} />
        <div className="overflow-auto h-[30rem]" id="scrollableDiv">
          <Table striped>
            <Table.Head className="sticky top-0 z-50 text-gray-700 border border-t-0 border-l-0 shadow">
              <Table.HeadCell className="!rounded-none w-10">#</Table.HeadCell>
              <Table.HeadCell className="!rounded-none w-20">Cédula</Table.HeadCell>
              <Table.HeadCell className="!rounded-none w-72">Nombre Completo</Table.HeadCell>
              <Table.HeadCell className="!rounded-none w-20">Celular</Table.HeadCell>
              <Table.HeadCell className="!rounded-none w-96">Email</Table.HeadCell>
              <Table.HeadCell className="!rounded-none w-60">Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {currentItems.map((customer, index) => (
                <Table.Row key={customer.id}>
                  <Table.Cell className="font-medium text-gray-900 truncate whitespace-nowrap">
                    {customer.id}
                  </Table.Cell>
                  <Table.Cell className="truncate">{customer.cedula}</Table.Cell>
                  <Table.Cell className="truncate">{`${customer.nombres} ${customer.apellidos}`}</Table.Cell>
                  <Table.Cell className="truncate">{customer.celular}</Table.Cell>
                  <Table.Cell className="text-blue-500 truncate">
                    <a href={`mailto:${customer.email}`} className="text-blue-500 md:hover:text-black">
                      {customer.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell className="flex items-center w-full gap-1">
                    <Button size="xs" color="blue">
                      Editar
                    </Button>
                    <Button size="xs" color="failure">
                      Eliminar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <footer className="overflow-x-auto">
          <ReactPaginate
            previousLabel={'<<'}
            nextLabel={'>>'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={'flex items-center gap-1 justify-center sm:justify-end mx-auto text-sm mt-3 p-4'}
            subContainerClassName={'mx-2'}
            activeClassName={'active'}
            pageLinkClassName="p-2 outline-1 block sm:px-3" // Adjust padding for different screen sizes
          />
        </footer>
      </MainLayout>
    </SectionLayout>
  )
}

export default CustomerPage
