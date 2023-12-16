import { Table } from 'flowbite-react'
import PropTypes from 'prop-types'
import CustomerItem from './CustomerItem'
import { RiErrorWarningFill } from 'react-icons/ri'

function CustomerTable({ currentItems }) {
  const quantity = currentItems.length

  if (quantity === 0) {
    return (
      <header className="flex flex-col items-center justify-center h-full text-xl text-center sm:text-2xl ">
        <RiErrorWarningFill className="w-32 h-32 text-red-700 sm:h-40 sm:w-40" />
        <h3>¡Cliente no Encontrado!</h3>
      </header>
    )
  }

  return (
    <Table striped>
      <Table.Head className="sticky top-0 z-50 text-gray-700 border border-t-0 border-l-0 shadow">
        <Table.HeadCell className="!rounded-none">#</Table.HeadCell>
        <Table.HeadCell className="!rounded-none">Cédula</Table.HeadCell>
        <Table.HeadCell className="!rounded-none">Nombre Completo</Table.HeadCell>
        <Table.HeadCell className="!rounded-none">Celular</Table.HeadCell>
        <Table.HeadCell className="!rounded-none">Email</Table.HeadCell>
        <Table.HeadCell className="!rounded-none">Acciones</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {currentItems.map((customer) => (
          <CustomerItem key={customer.id} customer={customer} />
        ))}
      </Table.Body>
    </Table>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
}

export default CustomerTable
