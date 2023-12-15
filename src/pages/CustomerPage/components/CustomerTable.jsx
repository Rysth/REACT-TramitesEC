import { Table } from 'flowbite-react'
import PropTypes from 'prop-types'
import CustomerItem from './CustomerItem'

function CustomerTable({ currentItems }) {
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
          <CustomerItem customer={customer} />
        ))}
      </Table.Body>
    </Table>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
}

export default CustomerTable
