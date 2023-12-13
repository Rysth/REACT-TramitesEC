import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'
import { Badge, Button } from '@tremor/react'

function CustomerTable() {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const { activeToken } = useSelector((store) => store.authentication)
  const { customersFilter } = useSelector((store) => store.customer)
  const [customerID, setCustomerID] = useState(undefined)

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
    <article className="overflow-auto max-h-96">
      {showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center  md:inset-0 h-[calc(100%)] max-h-full grid place-items-center bg-black/50">
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 text-center md:p-5+">
                <h3 className="mb-3 font-normal text-gray-900 sm:text-2xl">¿Estas seguro/a de querer eliminarlo?</h3>
                <div className="flex items-center justify-center gap-1">
                  <Button size="xs" variant="primary" color="red" onClick={() => onDeleteCustomer()}>
                    Confirmar
                  </Button>
                  <Button size="xs" variant="secondary" color="gray" onClick={() => hideShowModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="w-full overflow-auto text-sm text-left text-gray-500">
        <thead className="w-full text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="w-12 px-6 py-3">
              #
            </th>
            <th scope="col" className="w-32 px-6 py-3">
              Cédula
            </th>
            <th scope="col" className="w-40 px-6 py-3">
              Nombre Completo
            </th>
            <th scope="col" className="w-32 px-6 py-3">
              Celular
            </th>
            <th scope="col" className="w-40 px-6 py-3">
              Email
            </th>
            <th scope="col" className="w-16 px-6 py-3">
              Estado
            </th>
            <th scope="col" className="w-32 px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {customersFilter.map((customer, index) => (
            <tr className="bg-white border-b hover:bg-gray-50" key={customer.id}>
              <th scope="row" className="px-6 py-2 text-gray-900">
                {index + 1}
              </th>
              <td className="px-6 py-2 truncate">{customer.cedula}</td>
              <td className="px-6 py-2 truncate">{`${customer.nombres} ${customer.apellidos}`}</td>
              <td className="px-6 py-2 truncate">{customer.celular}</td>
              <td className="px-6 py-2 truncate">
                <a
                  href="mailto:johnpalacios.t@gmail.com"
                  className="inline-block text-blue-500 underline md:hover:text-gray-900"
                >
                  {customer.email}
                </a>
              </td>
              <td className="px-6 py-2 text-center">
                {customer.active ? (
                  <Badge className="text-gray-700 bg-green-100">Activo</Badge>
                ) : (
                  <Badge className="text-gray-700 bg-slate-100">Inactivo</Badge>
                )}
              </td>
              <td className="flex items-center gap-2 px-6 py-4">
                <Button size="xs" variant="primary">
                  Editar
                </Button>
                <Button size="xs" variant="primary" color="red" onClick={() => activeShowModal(customer.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

export default CustomerTable
