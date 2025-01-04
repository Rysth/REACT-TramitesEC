import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiIdentification, HiMapPin, HiMiniDevicePhoneMobile, HiMiniEnvelope, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { createCustomer, updateCustomer } from '../../../redux/slices/CustomerSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'
import { debounce } from 'lodash'

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
  const [selectedProcessor, setSelectedProcessor] = useState([])

  const handleCancel = () => {
    reset()
    setSelectedProcessor([])
    closeModal()
  }

  const onSubmit = (customerData) => {
    customerData.is_direct = isDirect // Ensure is_direct is correctly set

    if (customerSelected) {
      const isDifferent = Object.keys(customerData).some((key) => {
        if (key === 'user') return false
        if (key === 'is_direct' && customerSelected.is_direct) return false
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
        closeModal()
      }
    } else {
      dispatch(createCustomer({ activeToken, customerData }))
        .then(() => {
          refetchFunction()
          reset() // Reset the form fields after creating a new customer
          setIsDirect(false) // Reset the isDirect state
        })
        .then(() => closeModal())
    }
    setSelectedProcessor([])
  }

  const loadProcessorOptions = debounce((inputValue, callback) => {
    dispatch(fetchProcessorOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((processor) => ({
          label: `${processor.code} - ${processor.first_name.split(' ')[0]} ${processor.last_name.split(' ')[0]}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 300)

  useEffect(() => {
    if (customerSelected) {
      setIsDirect(customerSelected.is_direct)
      Object.keys(customerSelected).forEach((key) => {
        setValue(key, customerSelected[key])
      })
    } else {
      reset()
      setIsDirect(false) // Reset the isDirect state when no customer is selected
    }
  }, [customerSelected, reset, setValue])

  useEffect(() => {
    dispatch(fetchProcessorOptions({ activeToken, query: '' }))
  }, [dispatch, activeToken])

  useEffect(() => {
    if (customerSelected && customerSelected.processor) {
      setSelectedProcessor([
        {
          label: `${customerSelected.processor.code} - ${customerSelected.processor.first_name} ${customerSelected.processor.last_name}`,
          value: customerSelected.processor.id,
          phone: customerSelected.processor.phone,
        },
      ])
    }
  }, [customerSelected])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid">
        <div className="flex items-center justify-between gap-2 alert alert-info">
          <input
            type="checkbox"
            id="accept"
            checked={isDirect}
            onChange={() => setIsDirect(!isDirect)}
            disabled={customerSelected}
            className="checkbox checkbox-neutral"
          />
          <label htmlFor="accept" className="flex w-full cursor-pointer" disabled={customerSelected}>
            ¿Deseas crear un Cliente Directo?
          </label>
        </div>
      </fieldset>
      {!isDirect && (
        <fieldset className="grid">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="processor_id" className="label-text">
                Trámitador
              </label>
              {errors.processor_id && <span className="badge-sm badge badge-error">Campo Requerido</span>}
            </div>
            <AsyncSelect
              cacheOptions
              loadOptions={loadProcessorOptions}
              defaultOptions
              placeholder="Buscar..."
              onChange={(selectedOption) => {
                setValue('processor_id', selectedOption.value)
                setSelectedProcessor([selectedOption])
              }}
              value={selectedProcessor}
              className="text-sm shadow shadow-gray-200"
            />
          </div>
        </fieldset>
      )}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="identification" className="label-text">
              Cédula
            </label>
            {errors.identification && (
              <span className="badge-sm badge badge-error">
                {errors.identification.type === 'required' && 'Campo requerido'}
                {errors.identification.type === 'pattern' && 'Solo números'}
              </span>
            )}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiIdentification className="w-4 h-4 opacity-70" />
            <input
              id="identification"
              type="text"
              placeholder=""
              defaultValue={customerSelected && customerSelected.identification}
              {...register('identification', { required: true, pattern: /^[0-9]+$/i })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="label-text">
              Email
            </label>
            {errors.email && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniEnvelope className="w-4 h-4 opacity-70" />
            <input
              id="email"
              type="email"
              placeholder=""
              defaultValue={customerSelected && customerSelected.email}
              {...register('email', { required: true })}
              className="grow"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="first_name" className="label-text">
              Nombres
            </label>
            {errors.first_name && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniUserCircle className="w-4 h-4 opacity-70" />
            <input
              id="first_name"
              type="text"
              placeholder=""
              defaultValue={customerSelected && customerSelected.first_name}
              {...register('first_name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="last_name" className="label-text">
              Apellidos
            </label>
            {errors.last_name && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniUserCircle className="w-4 h-4 opacity-70" />
            <input
              id="last_name"
              type="text"
              placeholder=""
              defaultValue={customerSelected && customerSelected.last_name}
              {...register('last_name', { required: true })}
              className="grow"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="phone" className="label-text">
              Teléfono
            </label>
            {errors.phone && (
              <span className="badge-sm badge badge-error">
                {errors.phone.type === 'required' && 'Campo requerido'}
                {errors.phone.type === 'pattern' && 'Solo números'}
              </span>
            )}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniDevicePhoneMobile className="w-4 h-4 opacity-70" />
            <input
              id="phone"
              type="text"
              placeholder=""
              defaultValue={customerSelected && customerSelected.phone}
              {...register('phone', { required: isDirect, pattern: /^[0-9]+$/i })}
              className="grow"
              disabled={!isDirect || (customerSelected && !customerSelected.is_direct)}
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="address" className="label-text">
              Dirección
            </label>
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMapPin className="w-4 h-4 opacity-70" />
            <input
              id="address"
              type="text"
              placeholder=""
              defaultValue={customerSelected && customerSelected.address}
              {...register('address')}
              className="grow"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 p-4 px-0 pt-0">
        <button type="submit" className="btn btn-success" disabled={loading}>
          Guardar
        </button>
        <button type="button" className="btn btn-error" onClick={handleCancel}>
          Cancelar
        </button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CustomerForm
