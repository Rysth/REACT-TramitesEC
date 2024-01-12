import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { Button, Label, Select, TextInput } from 'flowbite-react'
import { HiIdentification, HiMiniEnvelope, HiMiniUserCircle, HiMiniDevicePhoneMobile, HiMapPin } from 'react-icons/hi2'
import { createCliente, updateCliente } from '../../../redux/slices/CustomerSlice'

function CustomerForm({ closeModal }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { id: user_id } = useSelector((store) => store.authentication.activeUser)
  const { processorOriginal } = useSelector((store) => store.processor)
  const { customerSelected } = useSelector((store) => store.customer)
  const { register, handleSubmit, reset } = useForm()

  const handleCreateOrUpdate = (newCustomer) => {
    const customerData = {
      ...newCustomer,
    }

    if (customerSelected) {
      const oldCustomer = {
        id: customerSelected.id,
        ...customerData,
      }
      dispatch(updateCliente({ activeToken, oldCustomer })).then(() => closeModal())
      return
    }

    const newCustomerData = {
      ...newCustomer,
      user_id,
    }

    dispatch(createCliente({ activeToken, newCustomer: newCustomerData })).then(() => closeModal())
  }

  const onSubmit = (customerData) => {
    handleCreateOrUpdate(customerData)
  }

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid">
        <div>
          <Label htmlFor="processor_id" value="Trámitador" />
          <Select
            id="processor_id"
            {...register('processor_id')}
            defaultValue={customerSelected && customerSelected.processor.id}
            required
          >
            {processorOriginal.map((processor) => (
              <option key={processor.id} value={processor.id}>{`${processor.nombres} ${processor.apellidos}`}</option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cedula" value="Cédula" />
          <TextInput
            id="cedula"
            placeholder="0985736265"
            defaultValue={customerSelected && customerSelected.cedula}
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
            defaultValue={customerSelected && customerSelected.nombres}
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
            defaultValue={customerSelected && customerSelected.apellidos}
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
            defaultValue={customerSelected && customerSelected.celular}
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
            defaultValue={customerSelected && customerSelected.direccion}
            icon={HiMapPin}
            {...register('direccion')}
          />
        </div>
        <div>
          <Label htmlFor="email" value="Correo Electrónico" />
          <TextInput
            id="email"
            placeholder="username@example.com"
            defaultValue={customerSelected && customerSelected.email}
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
        <Button color="failure" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default CustomerForm
