import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import HeaderLayout from '../../layouts/HeaderLayout'
import { Button, Table, TextInput } from 'flowbite-react'
import { IoSearch } from 'react-icons/io5'
import { FaUserGroup } from 'react-icons/fa6'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersArray } = useSelector((store) => store.customer)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <HeaderLayout />
      <main className="flex flex-col gap-5 mt-5 shadow-md sm:gap-0 shadow-black/25 rounded-2xl">
        <article className="flex flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row bg-purple rounded-t-2xl">
          <header className="flex items-center gap-1.5 text-white">
            <FaUserGroup className="text-lg" />
            <h3 className="text-lg">Listado de Clientes</h3>
          </header>
          <TextInput id="search" type="text" icon={IoSearch} placeholder="Buscar..." color="purple" required />
        </article>
        <div className="overflow-x-auto max-h-[30rem]">
          <Table striped>
            <Table.Head className="sticky top-0 z-50 text-gray-700 border border-t-0 border-l-0 shadow">
              <Table.HeadCell>#</Table.HeadCell>
              <Table.HeadCell>Cédula</Table.HeadCell>
              <Table.HeadCell>Nombre Completo</Table.HeadCell>
              <Table.HeadCell>Celular</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {customersArray.map((customer, index) => (
                <Table.Row>
                  <Table.Cell className="font-medium text-gray-900 truncate whitespace-nowrap">{index + 1}</Table.Cell>
                  <Table.Cell className="truncate">{customer.cedula}</Table.Cell>
                  <Table.Cell className="truncate">{`${customer.nombres} ${customer.apellidos}`}</Table.Cell>
                  <Table.Cell className="truncate">{customer.celular}</Table.Cell>
                  <Table.Cell className="text-blue-500 truncate">
                    <a href={`mailto:${customer.email}`} className="text-blue-500 md:hover:text-black">
                      {customer.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell className="flex items-center gap-1">
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
      </main>
    </SectionLayout>
  )
}

export default CustomerPage
