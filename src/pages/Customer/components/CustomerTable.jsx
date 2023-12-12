import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../../redux/slices/CustomerSlice'

function CustomerTable() {
  const dispatch = useDispatch()
  const activeToken = useSelector((store) => store.authentication.activeToken)
  const { customersFilter, loading } = useSelector((store) => store.customer)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch])

  if (loading) {
    return (
      <header className="py-12 text-center bg-indigo-700 rounded-lg">
        <h3 className="text-2xl text-white sm:text-3xl">Cargando...</h3>
      </header>
    )
  }

  return (
    <div className="mb-10 overflow-x-auto shadow">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Cédula
            </th>
            <th scope="col" className="px-6 py-3 min-w-[14rem] max-w-[14rem]">
              Nombre Completo
            </th>
            <th scope="col" className="px-6 py-3">
              Celular
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {customersFilter.map((customer, index) => (
            <tr className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {index + 1}
              </th>
              <td className="px-6 py-4">{customer.cedula}</td>
              <td className="px-6 py-4">{`${customer.nombres} ${customer.apellidos}`}</td>
              <td className="px-6 py-4">{customer.celular}</td>
              <td className="px-6 py-4">
                <a
                  href="mailto:johnpalacios.t@gmail.com"
                  className="inline-block text-blue-500 underline md:hover:scale-105 md:transition"
                >
                  {customer.email}
                </a>
              </td>
              <td className="px-6 py-4">
                {customer.active ? (
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-1 rounded-full">
                    Activo
                  </span>
                ) : (
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-1 rounded-full">
                    Inactivo
                  </span>
                )}
              </td>
              <td className="flex items-center gap-2 px-6 py-4">
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:active:scale-95"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-medium text-center text-white bg-red-700 rounded-md hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 md:active:scale-95"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
