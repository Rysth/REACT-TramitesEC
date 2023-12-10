import React from 'react'
import { Card, Grid, Metric, Text } from '@tremor/react'
import NavBar from '../../components/NavBar/NavBar'
import TableSearch from '../../components/Table/TableSearch'

const categories = [
  {
    title: 'Clientes Registrados',
    metric: '1,000',
    color: 'bg-indigo-700',
  },
  {
    title: 'Activos',
    metric: '700',
    color: 'bg-green-500',
  },
  {
    title: 'Inactivos',
    metric: '300',
    color: 'bg-red-700',
  },
]

function Customer() {
  return (
    <section className="px-4 sm:px-8 sm:py-2 sm:ml-64">
      <NavBar />
      <Grid numItemsSm={2} numItemsLg={3} className="gap-2 mt-2 mb-8 outline-none sm:gap-4 md:gap-6 lg:gap-8">
        {categories.map((item) => (
          <Card key={item.title} className={`py-3 border-none shadow-lg outline-none ${item.color}`}>
            <Text className="!text-white">{item.title}</Text>
            <Metric className="!text-white">{item.metric}</Metric>
          </Card>
        ))}
      </Grid>
      <div className="relative sm:rounded-2xl">
        <TableSearch title="Listado de Clientes" />
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
              <tr className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  1
                </th>
                <td className="px-6 py-4">0931237663</td>
                <td className="px-6 py-4">John Andrés Palacios Tutiven</td>
                <td className="px-6 py-4">0988949117</td>
                <td className="px-6 py-4">
                  <a
                    href="mailto:johnpalacios.t@gmail.com"
                    className="inline-block text-blue-500 underline md:hover:scale-105 md:transition"
                  >
                    johnpalacios.t@gmail.com
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-1 rounded-full">
                    Activo
                  </span>
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
              <tr className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  2
                </th>
                <td className="px-6 py-4">0931237663</td>
                <td className="px-6 py-4">John Andrés Palacios Tutiven</td>
                <td className="px-6 py-4">0988949117</td>
                <td className="px-6 py-4">
                  <a
                    href="mailto:johnpalacios.t@gmail.com"
                    className="inline-block text-blue-500 underline md:hover:scale-105 md:transition"
                  >
                    johnpalacios.t@gmail.com
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-1 rounded-full">
                    Inactivo
                  </span>
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
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Customer
