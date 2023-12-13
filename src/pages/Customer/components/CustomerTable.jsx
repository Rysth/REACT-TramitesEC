import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Table, Button, Badge } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'

function CustomerTable() {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersFilter } = useSelector((store) => store.customer)
  const [customerID, setCustomerID] = useState(undefined)
  const [records, setRecords] = useState(10)

  const increaseRecords = () => setRecords(records + 10)

  const activeShowModal = (customerID) => {
    setShowModal(true)
    setCustomerID(customerID)
  }
  const hideShowModal = () => {
    setShowModal(false)
    setCustomerID(undefined)
  }

  const onDeleteCustomer = () => dispatch(destroyCliente({ activeToken, customerID })).then(() => hideShowModal())

  return (
    <article>
      {showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center  md:inset-0 h-[calc(100%)] max-h-full grid place-items-center bg-black/50">
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 text-center md:p-5+">
                <h3 className="mb-3 font-normal text-gray-900 sm:text-2xl">¿Estas seguro/a de querer eliminarlo?</h3>
                <div className="flex items-center justify-center gap-1">
                  <Button size="xs" color="failure" className="button" onClick={() => onDeleteCustomer()}>
                    Confirmar
                  </Button>
                  <Button size="xs" color="gray" className="button" onClick={() => hideShowModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="overflow-x-auto max-h-96">
        <InfiniteScroll
          pageStart={0}
          loadMore={increaseRecords}
          hasMore={records < customersFilter.length}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
        >
          <Table hoverable className="relative z-30">
            <Table.Head className="sticky top-0 z-20">
              <Table.HeadCell className="w-12">#</Table.HeadCell>
              <Table.HeadCell className="w-24">Cédula</Table.HeadCell>
              <Table.HeadCell className="w-48">Nombre Completo</Table.HeadCell>
              <Table.HeadCell className="w-24">Celular</Table.HeadCell>
              <Table.HeadCell className="w-48">Email</Table.HeadCell>
              <Table.HeadCell className="w-32">Estado</Table.HeadCell>
              <Table.HeadCell className="w-48">Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-opacity-100 divide-y">
              {customersFilter.slice(0, records).map((customer, index) => (
                <Table.Row key={customer.id}>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">{index + 1}</Table.Cell>
                  <Table.Cell className="truncate">{customer.cedula}</Table.Cell>
                  <Table.Cell className="truncate">{`${customer.nombres} ${customer.apellidos}`}</Table.Cell>
                  <Table.Cell className="truncate">{customer.celular}</Table.Cell>
                  <Table.Cell className="truncate">
                    <a
                      href="mailto:johnpalacios.t@gmail.com"
                      className="inline-block text-blue-500 underline md:hover:text-gray-900"
                    >
                      {customer.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {customer.active ? (
                      <Badge color="success" size="xs" className="grid place-items-center">
                        Activo
                      </Badge>
                    ) : (
                      <Badge color="gray" size="xs" className="grid place-items-center">
                        Inactivo
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="flex items-center justify-center gap-2">
                    <Button size="xs" color="blue" className="button">
                      Editar
                    </Button>
                    <Button size="xs" color="failure" className="button" onClick={() => activeShowModal(customer.id)}>
                      Eliminar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </InfiniteScroll>
      </main>
    </article>
  )
}

export default CustomerTable
