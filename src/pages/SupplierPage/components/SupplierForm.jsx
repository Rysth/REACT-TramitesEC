// SupplierForm.js
import { Button, TextInput } from '@tremor/react'
import { Badge, Label } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDevicePhoneMobile, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createSupplier, updateSupplier } from '../../../redux/slices/SupplierSlice'

function SupplierForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { supplierSelected } = useSelector((store) => store.supplier)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (supplierData) => {
    if (supplierSelected) {
      const isDifferent = Object.keys(supplierData).some((key) => {
        if (key === 'user') return false
        return supplierSelected.hasOwnProperty(key) && supplierData[key] !== supplierSelected[key]
      })

      if (isDifferent) {
        dispatch(updateSupplier({ activeToken, supplierData: { ...supplierData, id: supplierSelected.id } }))
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        closeModal()
      }
    } else {
      dispatch(createSupplier({ activeToken, supplierData }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (supplierSelected) {
      Object.keys(supplierSelected).forEach((key) => {
        setValue(key, supplierSelected[key])
      })
    } else {
      reset()
    }
  }, [supplierSelected, reset, setValue])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name" value="Nombre" />
            {errors.name && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="name"
            placeholder=""
            defaultValue={supplierSelected && supplierSelected.name}
            icon={HiMiniUserCircle}
            {...register('name', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="identification" value="Identificación" />
            {errors.identification && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="identification"
            placeholder=""
            defaultValue={supplierSelected && supplierSelected.identification}
            icon={HiMiniUserCircle}
            {...register('identification', { required: true })}
          />
        </div>
      </fieldset>
      <fieldset className="grid">
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
            defaultValue={supplierSelected && supplierSelected.phone}
            icon={HiMiniDevicePhoneMobile}
            {...register('phone', { required: true, pattern: /^[0-9]+$/i })}
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 mt-4">
        <Button color="green" type="submit">
          Guardar
        </Button>
        <Button color="red" onClick={closeModal}>
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

SupplierForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default SupplierForm
