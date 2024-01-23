import { Button, TextInput } from '@tremor/react'
import { Label } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiIdentification, HiMapPin, HiMiniDevicePhoneMobile, HiMiniEnvelope, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createCustomer, updateCustomer } from '../../../redux/slices/CustomerSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'

import { debounce } from 'lodash'
import AsyncSelect from 'react-select/async'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
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

  const loadProcessorOptions = debounce((inputValue, callback) => {
    dispatch(fetchProcessorOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((processor) => ({
          label: `${processor.codigo} - ${processor.nombres} ${processor.apellidos}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 800)

  useEffect(() => {
    console.log(customerSelected)
    if (customerSelected) {
      Object.keys(customerSelected).forEach((key) => {
        setValue(key, customerSelected[key])
      })
    } else {
      reset() // Reset the form if no customer is selected
    }
  }, [customerSelected, reset, setValue])

  useEffect(() => {
    dispatch(fetchProcessorOptions({ activeToken, query: '' }))
  }, [])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid">
        <div>
          <Label htmlFor="processor_id" value="Trámitador" />
          <AsyncSelect
            cacheOptions
            loadOptions={loadProcessorOptions}
            defaultOptions
            placeholder="Buscar..."
            onChange={(selectedOption) => setValue('processor_id', selectedOption.value)}
            defaultValue={
              customerSelected
                ? {
                    label: `${customerSelected.processor.codigo} - ${customerSelected.processor.nombres} ${customerSelected.processor.apellidos}`,
                    value: customerSelected.processor.id,
                  }
                : undefined
            }
            className="text-sm shadow shadow-gray-200"
          />
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
