import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  Typography,
  Chip,
} from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'

const TABLE_HEAD = ['#', 'Cédula', 'Nombre Completo', 'Celular', 'Email', 'Estado', 'Acciones']

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
      <Dialog open={showModal} handler={hideShowModal} size="xs">
        <DialogHeader className="grid gap-1 text-center">
          <Typography variant="h3" className="leading-9">
            ¿Estas seguro/a que quieres eliminarlo?
          </Typography>
          <Typography color="gray">Esta acción es irreversible.</Typography>
        </DialogHeader>
        <DialogFooter className="justify-center pt-0 mt-0">
          <Button color="gray" onClick={hideShowModal} className="mr-1">
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="red" onClick={onDeleteCustomer}>
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <main className="relative overflow-x-auto max-h-96">
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
          <Card className="w-full h-full overflow-scroll ">
            <table className="w-full text-left table-auto min-w-max">
              <thead className="sticky top-0">
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-4 font-bold bg-gray-200 border-b border-blue-gray-100">
                    <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                      {head}
                    </Typography>
                  </th>
                ))}
              </thead>
              <tbody>
                {customersFilter.slice(0, records).map((customer, index) => (
                  <tr key={customer.id} className=" even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {customer.cedula}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {`${customer.nombres} ${customer.apellidos}`}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {customer.celular}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small">
                        <a
                          href="mailto:johnpalacios.t@gmail.com"
                          className="inline-block underline md:hover:text-gray-900"
                        >
                          {customer.email}
                        </a>
                      </Typography>
                    </td>
                    <td className="p-4">
                      {customer.active ? (
                        <Chip color="green" value="Activo" className="grid place-items-center" size="sm" />
                      ) : (
                        <Chip color="gray" value="Inactivo" className="grid place-items-center" size="sm" />
                      )}
                    </td>
                    <td className="flex items-center gap-2 p-4">
                      <Button size="sm" color="indigo" className="button">
                        Editar
                      </Button>
                      <Button size="sm" color="red" className="button" onClick={() => activeShowModal(customer.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </InfiniteScroll>
      </main>
    </article>
  )
}

export default CustomerTable
