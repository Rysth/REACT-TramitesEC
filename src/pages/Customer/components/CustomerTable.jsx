import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Table, Button, Badge, Modal } from 'flowbite-react'
import { TiWarningOutline } from 'react-icons/ti'
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
    <article className="mb-5">
      <Modal
        show={showModal}
        size="md"
        onClose={() => hideShowModal()}
        popup
        position={'center'}
        className="bg-black/50"
      >
        <Modal.Body>
          <TiWarningOutline className="w-32 h-32 mx-auto mb-2 text-gray-900" />
          <div className="text-center">
            <h3 className="mb-5 text-lg sm:text-2xl">¿Estás seguro/a de querer eliminarlo?</h3>
            <div className="flex justify-center gap-2">
              <Button color="failure" size="sm" className="button" onClick={() => onDeleteCustomer()}>
                Confirmar
              </Button>
              <Button color="gray" size="sm" className="button" onClick={() => hideShowModal()}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
          <Table hoverable className="relative z-30 rounded-2xl">
            <Table.Head className="sticky top-0 z-20 ">
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
