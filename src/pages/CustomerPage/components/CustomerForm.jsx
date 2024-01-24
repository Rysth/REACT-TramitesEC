import { Button, TextInput } from '@tremor/react'
import { Badge, Label } from 'flowbite-react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiIdentification, HiMapPin, HiMiniDevicePhoneMobile, HiMiniEnvelope, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { createCustomer, updateCustomer } from '../../../redux/slices/CustomerSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customerSelected } = useSelector((store) => store.customer)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

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
  }, [dispatch, activeToken])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="processor_id" value="Trámitador" />
            {errors.processor_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cedula" value="Cédula" />
            {errors.cedula && (
              <Badge className="text-xs" color="failure">
                {errors.cedula.type === 'required' && 'Campo requerido'}
                {errors.cedula.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="cedula"
            placeholder=""
            defaultValue={customerSelected && customerSelected.cedula}
            icon={HiIdentification}
            {...register('cedula', { required: true, pattern: /^[0-9]+$/i })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="celular" value="Celular" />
            {errors.celular && (
              <Badge className="text-xs" color="failure">
                {errors.celular.type === 'required' && 'Campo requerido'}
                {errors.celular.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="celular"
            placeholder=""
            defaultValue={customerSelected && customerSelected.celular}
            icon={HiMiniDevicePhoneMobile}
            {...register('celular', { required: true, pattern: /^[0-9]+$/i })}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="nombres" value="Nombres" />
            {errors.nombres && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="nombres"
            placeholder=""
            defaultValue={customerSelected && customerSelected.nombres}
            icon={HiMiniUserCircle}
            {...register('nombres', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apellidos" value="Apellidos" />
            {errors.apellidos && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="apellidos"
            placeholder=""
            defaultValue={customerSelected && customerSelected.apellidos}
            icon={HiMiniUserCircle}
            {...register('apellidos', { required: true })}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email" value="Email" />
            {errors.email && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="email"
            placeholder=""
            defaultValue={customerSelected && customerSelected.email}
            icon={HiMiniEnvelope}
            {...register('email', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion" value="Dirección" />
          <TextInput
            id="direccion"
            placeholder=""
            defaultValue={customerSelected && customerSelected.direccion}
            icon={HiMapPin}
            {...register('direccion')}
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
