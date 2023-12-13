import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'

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

  const onDeleteCustomer = () => {
    dispatch(destroyCliente({ activeToken, customerID })).then(() => hideShowModal())
  }

  return (
    <article className="overflow-auto max-h-96">
      {showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center  md:inset-0 h-[calc(100%)] max-h-full grid place-items-center bg-black/50">
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 text-center md:p-5">
                <h3 className="mb-3 font-normal text-gray-900 sm:text-2xl">¿Estas seguro/a de querer eliminarlo?</h3>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                  onClick={() => onDeleteCustomer()}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  onClick={() => hideShowModal(false)}
                >
                  Cancelar
                </button>
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
              <td className="px-6 py-2">
                {customer.active ? (
                  <span className="bg-green-100 text-green-800 text-sm me-2 px-2.5 py-1 rounded-full">Activo</span>
                ) : (
                  <span className="bg-indigo-100 text-indigo-800 text-sm me-2 px-2.5 py-1 rounded-full">Inactivo</span>
                )}
              </td>
              <td className="flex items-center gap-2 px-6 py-4">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:active:scale-95"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-center text-white bg-red-700 rounded-md hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 md:active:scale-95"
                  onClick={() => activeShowModal(customer.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

export default CustomerTable
