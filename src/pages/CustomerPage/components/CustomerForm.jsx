import { TextInput, Button } from '@tremor/react'
import { Badge, Label, Checkbox } from 'flowbite-react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiIdentification, HiMapPin, HiMiniDevicePhoneMobile, HiMiniEnvelope, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { createCustomer, updateCustomer } from '../../../redux/slices/CustomerSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customerSelected, loading } = useSelector((store) => store.customer)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const [isDirect, setIsDirect] = useState(false)

  const onSubmit = (customerData) => {
    if (customerSelected) {
      const isDifferent = Object.keys(customerData).some((key) => {
        // Exclude the 'user' key from comparison
        if (key === 'user') return false

        // Skip comparison for Processor data if the customer is direct
        if (key === 'is_direct' && customerSelected.is_direct) return false

        // Check if the value is different
        return customerData[key] !== customerSelected[key]
      })

      if (isDifferent) {
        dispatch(updateCustomer({ activeToken, customerData: { ...customerData, id: customerSelected.id } })).then(
          () => {
            refetchFunction()
            closeModal()
          },
        )
      } else {
        // No need to update if the data is the same
        closeModal()
      }
    } else {
      dispatch(createCustomer({ activeToken, customerData })).then(() => {
        refetchFunction()
        closeModal()
      })
    }
  }

  const loadProcessorOptions = debounce((inputValue, callback) => {
    dispatch(fetchProcessorOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((processor) => ({
          label: `${processor.code} - ${processor.first_name.split(' ')[0]} ${processor.last_name.split(' ')[0]} ${processor.last_name.split(' ')[1]}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 700)

  useEffect(() => {
    if (customerSelected) {
      setIsDirect(customerSelected.is_direct)
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
        <div className="flex items-center justify-center gap-2">
          <Checkbox
            id="accept"
            onClick={() => setIsDirect(!isDirect)}
            {...register('is_direct')}
            disabled={customerSelected}
            color="blue"
          />
          <Label htmlFor="accept" className="flex" disabled={customerSelected}>
            ¿Deseas crear un Cliente Directo?
          </Label>
        </div>
      </fieldset>
      {!isDirect && (
        <fieldset className="grid">
          {/* Render AsyncSelect only if isDirect is false */}
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
              onChange={(selectedOption) => {
                setValue('processor_id', selectedOption.value)
              }}
              defaultValue={
                customerSelected && customerSelected.processor
                  ? {
                      label: `${customerSelected.processor.code} - ${customerSelected.processor.first_name} ${customerSelected.processor.last_name}`,
                      value: customerSelected.processor.id,
                      phone: customerSelected.processor.phone,
                    }
                  : undefined
              }
              className="text-sm shadow shadow-gray-200"
            />
          </div>
        </fieldset>
      )}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cedula" value="Cédula" />
            {errors.identification && (
              <Badge className="text-xs" color="failure">
                {errors.identification.type === 'required' && 'Campo requerido'}
                {errors.identification.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="identification"
            placeholder=""
            defaultValue={customerSelected && customerSelected.identification}
            icon={HiIdentification}
            {...register('identification', { required: true, pattern: /^[0-9]+$/i })}
          />
        </div>
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
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="first_name" value="Nombres" />
            {errors.first_name && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="first_name"
            placeholder=""
            defaultValue={customerSelected && customerSelected.first_name}
            icon={HiMiniUserCircle}
            {...register('first_name', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="last_name" value="Apellidos" />
            {errors.last_name && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="last_name"
            placeholder=""
            defaultValue={customerSelected && customerSelected.last_name}
            icon={HiMiniUserCircle}
            {...register('last_name', { required: true })}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone" value="Teléfono" />
            {errors.phone && (
              <Badge className="text-xs" color="failure">
                {errors.phone.type === 'required' && 'Campo requerido'}
                {errors.phone.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="phone"
            placeholder=""
            defaultValue={customerSelected && customerSelected.phone}
            icon={HiMiniDevicePhoneMobile}
            {...register('phone', { required: isDirect, pattern: /^[0-9]+$/i })}
            disabled={!isDirect || (customerSelected && !customerSelected.is_direct)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" value="Dirección" />
          <TextInput
            id="address"
            placeholder=""
            defaultValue={customerSelected && customerSelected.address}
            icon={HiMapPin}
            {...register('address')}
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 mt-4">
        <Button color="green" type="submit" disabled={loading}>
          Guardar
        </Button>
        <Button color="red" onClick={closeModal}>
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
