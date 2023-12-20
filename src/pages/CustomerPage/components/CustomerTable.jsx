import { Table, Spinner, Modal, Button } from 'flowbite-react'
import PropTypes from 'prop-types'
import CustomerItem from './CustomerItem'
import { RiErrorWarningFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { destroyCliente } from '../../../redux/slices/CustomerSlice'

function CustomerTable({ currentItems, showModal }) {
  const quantity = currentItems.length
  const { activeToken } = useSelector((store) => store.authentication)
  const { loading, customerSelected } = useSelector((store) => store.customer)
  const dispatch = useDispatch()
  const [confirmationModal, setConfirmationModal] = useState(false)

  const confirmDelete = () => {
    dispatch(destroyCliente({ activeToken, customerID: customerSelected.id }))
  }

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
    <>
      <Modal show={confirmationModal} size="md" onClose={() => setConfirmationModal(false)} className="z-[9000]" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-800 h-14 w-14 sm:h-32 sm:w-32 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estas seguro/a de querer eliminarlo?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  confirmDelete()
                  setConfirmationModal(false)
                }}
              >
                Confirmar
              </Button>
              <Button color="gray" onClick={() => setConfirmationModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
            <CustomerItem
              key={customer.id}
              customer={customer}
              showModal={showModal}
              showConfirmation={setConfirmationModal}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

CustomerTable.propTypes = {
  currentItems: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default CustomerTable
