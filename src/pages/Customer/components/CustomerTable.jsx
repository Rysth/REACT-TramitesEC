function CustomerTable() {
  return (
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
        {currentItems.map((customer, index) => (
          <tr className="bg-white border-b hover:bg-gray-50" key={customer.id}>
            <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {customer.id}
            </th>
            <td className="px-6 py-2 truncate">{customer.cedula}</td>
            <td className="px-6 py-2 truncate">{`${customer.nombres} ${customer.apellidos}`}</td>
            <td className="px-6 py-2 truncate">{customer.celular}</td>
            <td className="px-6 py-2 truncate">
              <a
                href="mailto:johnpalacios.t@gmail.com"
                className="inline-block text-blue-500 underline md:hover:scale-105 md:transition"
              >
                {customer.email}
              </a>
            </td>
            <td className="px-6 py-2">
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
  )
}

export default CustomerTable
