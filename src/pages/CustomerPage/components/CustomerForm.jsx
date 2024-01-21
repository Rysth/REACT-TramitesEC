import { Button, TextInput } from '@tremor/react'
import { Label, Select } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiIdentification,
  HiMapPin,
  HiMiniDevicePhoneMobile,
  HiMiniEnvelope,
  HiMiniUserCircle,
  HiUser,
} from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createCustomer, updateCustomer } from '../../../redux/slices/CustomerSlice'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorOriginal } = useSelector((store) => store.processor)
  const { customerSelected } = useSelector((store) => store.customer)
  const { register, handleSubmit, reset, setValue } = useForm()

  const onSubmit = (customerData) => {
    if (customerSelected) {
      dispatch(updateCustomer({ activeToken, customerData: { ...customerData, id: customerSelected.id } }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    } else {
      dispatch(createCustomer({ activeToken, customerData }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (customerSelected) {
      // Populate the form with the selected processor's data
      Object.keys(customerSelected).forEach((key) => {
        setValue(key, customerSelected[key])
      })
    } else {
      reset() // Reset the form if no processor is selected
    }
  }, [customerSelected, reset, setValue])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid">
        <div>
          <Label htmlFor="processor_id" value="Trámitador" />
          <Select
            icon={HiUser}
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
            placeholder=""
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
            placeholder=""
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
            placeholder=""
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
            placeholder=""
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
            placeholder=""
            defaultValue={customerSelected && customerSelected.direccion}
            icon={HiMapPin}
            {...register('direccion')}
          />
        </div>
        <div>
          <Label htmlFor="email" value="Correo Electrónico" />
          <TextInput
            id="email"
            placeholder=""
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
        <Button color="red" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CustomerForm
