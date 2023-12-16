import PropTypes from 'prop-types'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { HiIdentification, HiMiniEnvelope, HiMiniUserCircle, HiMiniDevicePhoneMobile, HiMapPin } from 'react-icons/hi2'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createCliente } from '../../../redux/slices/CustomerSlice'

function CustomerModal({ openModal, closeModal }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { id } = useSelector((store) => store.authentication.activeUser)
  const { register, handleSubmit, reset } = useForm()

  const resetForm = () => {
    reset()
    closeModal()
  }

  const onSubmit = (customerData) => {
    const user_id = id
    const newCustomer = {
      ...customerData,
      user_id,
    }
    dispatch(createCliente({ activeToken, newCustomer })).then(() => reset())
  }

  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]" size="lg">
      <header className="p-4 border-b">
        <h3 className="text-xl sm:text-2xl">Nuevo Cliente</h3>
      </header>
      <Modal.Body>
        <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cedula" value="Cédula" />
              <TextInput
                id="cedula"
                placeholder="0985736265"
                icon={HiIdentification}
                {...register('cedula')}
                required
              />
            </div>
            <div>
              <Label htmlFor="nombres" value="Nombres" />
              <TextInput
                id="nombres"
                placeholder="John Doe"
                icon={HiMiniUserCircle}
                {...register('nombres')}
                required
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="apellidos" value="Apellidos" />
              <TextInput
                id="apellidos"
                placeholder="Sánchez Castro"
                icon={HiMiniUserCircle}
                {...register('apellidos')}
                required
              />
            </div>
            <div>
              <Label htmlFor="celular" value="Celular" />
              <TextInput
                id="celular"
                placeholder="0966553564"
                icon={HiMiniDevicePhoneMobile}
                {...register('celular')}
                required
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="direccion" value="Dirección" />
              <TextInput
                id="direccion"
                placeholder="Av. de las Américas"
                icon={HiMapPin}
                {...register('direccion')}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Correo Electrónico" />
              <TextInput
                id="email"
                placeholder="username@example.com"
                icon={HiMiniEnvelope}
                {...register('email')}
                required
              />
            </div>
          </fieldset>
          <fieldset className="flex items-center justify-end gap-2 mt-10">
            <Button color="blue" type="submit" className="mt-3">
              Guardar
            </Button>
            <Button color="failure" onClick={resetForm} className="mt-3">
              Cancelar
            </Button>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  )
}

CustomerModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default CustomerModal
