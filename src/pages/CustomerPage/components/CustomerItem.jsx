import PropTypes from 'prop-types'
import { Table, Button } from 'flowbite-react'

function CustomerItem({ customer }) {
  return (
    <Table.Row key={customer.id}>
      <Table.Cell className="py-2 font-medium text-gray-900 truncate whitespace-nowrap">{customer.id}</Table.Cell>
      <Table.Cell className="py-2 truncate">{customer.cedula}</Table.Cell>
      <Table.Cell className="py-2 truncate">{`${customer.nombres} ${customer.apellidos}`}</Table.Cell>
      <Table.Cell className="py-2 truncate">{customer.celular}</Table.Cell>
      <Table.Cell className="py-2 text-blue-500 truncate">
        <a href={`mailto:${customer.email}`} className="text-blue-500 md:hover:text-black">
          {customer.email}
        </a>
      </Table.Cell>
      <Table.Cell className="flex items-center w-full gap-1 py-2">
        <Button size="xs" color="blue">
          Editar
        </Button>
        <Button size="xs" color="failure">
          Eliminar
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}

CustomerItem.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cedula: PropTypes.string.isRequired,
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    celular: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
}

export default CustomerItem
