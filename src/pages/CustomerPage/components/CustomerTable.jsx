import { Table, Spinner } from 'flowbite-react'
import PropTypes from 'prop-types'
import CustomerItem from './CustomerItem'
import { RiErrorWarningFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'

function CustomerTable({ currentItems, showModal }) {
  const quantity = currentItems.length
  const { loading } = useSelector((store) => store.customer)

  if (loading) {
    return (
      <header className="flex flex-col items-center justify-center h-full text-xl text-center sm:text-2xl ">
        <Spinner aria-label="Default status example" color="purple" className="w-20 h-20 fill-[var(--CL-purple)]" />
      </header>
    )
  }

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
        <Table.HeadCell className="!rounded-none w-1/12 bg-white">#</Table.HeadCell>
        <Table.HeadCell className="!rounded-none w-1/12 bg-white">Cédula</Table.HeadCell>
        <Table.HeadCell className="!rounded-none w-3/12 bg-white">Nombre Completo</Table.HeadCell>
        <Table.HeadCell className="!rounded-none w-1/12 bg-white">Celular</Table.HeadCell>
        <Table.HeadCell className="!rounded-none w-4/12 bg-white">Email</Table.HeadCell>
        <Table.HeadCell className="!rounded-none w-2/12 bg-white">Acciones</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {currentItems.map((customer) => (
          <CustomerItem key={customer.id} customer={customer} showModal={showModal} />
        ))}
      </Table.Body>
    </Table>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default CustomerTable
