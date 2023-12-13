import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../../../components/Loading/Loading'
import { getClientes, destroyCliente } from '../../../redux/slices/CustomerSlice'

function CustomerTable() {
  const dispatch = useDispatch()
  const [records, setRecords] = useState(12)
  const { customersFilter, loading } = useSelector((store) => store.customer)
  const activeToken = useSelector((store) => store.authentication.activeToken)
  const [customerID, setCustomerID] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const increaseDisplayCount = () => {
    setRecords(records + 12)
  }

  const onDeleteCustomer = (customerID) => {
    dispatch(destroyCliente({ activeToken, customerID }))
    setShowModal(false)
  }

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative mb-10 overflow-auto shadow max-h-96" id="scrollableDiv">
      {showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full  grid place-items-center bg-black/50">
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 text-center md:p-5">
                <h3 className="mb-3 font-normal text-gray-900 sm:text-2xl">¿Estas seguro/a de querer eliminarlo?</h3>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                  onClick={() => {
                    onDeleteCustomer(customerID)
                  }}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <InfiniteScroll
        dataLength={records}
        next={increaseDisplayCount}
        hasMore={records < customersFilter.length}
        loader={<Loading />}
        scrollableTarget="scrollableDiv"
      >
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100">
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
            {customersFilter.slice(0, records).map((customer, index) => (
              <tr className="bg-white border-b hover:bg-gray-50" key={customer.id}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td className="px-6 py-4 truncate">{customer.cedula}</td>
                <td className="px-6 py-4 truncate">{`${customer.nombres} ${customer.apellidos}`}</td>
                <td className="px-6 py-4 truncate">{customer.celular}</td>
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
                    onClick={() => {
                      setShowModal(true)
                      setCustomerID(customer.id)
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  )
}

export default CustomerTable
