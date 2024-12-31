// SupplierForm.js
import { Button, TextInput } from '@tremor/react'
import { Badge, Label } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDevicePhoneMobile, HiMiniUserCircle, HiIdentification } from 'react-icons/hi2'
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
        .then(() => {
          refetchFunction()
          reset()
        })
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
            <label htmlFor="name" className="label-text">
              Nombre
            </label>
            {errors.name && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniUserCircle className="w-4 h-4 opacity-70" />
            <input
              id="name"
              type="text"
              placeholder=""
              defaultValue={supplierSelected && supplierSelected.name}
              {...register('name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="identification" className="label-text">
              Cédula/RUC
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
              defaultValue={supplierSelected && supplierSelected.identification}
              {...register('identification', { required: true, pattern: /^[0-9]+$/i })}
              className="grow"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="grid">
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
              defaultValue={supplierSelected && supplierSelected.phone}
              {...register('phone', { required: true, pattern: /^[0-9]+$/i })}
              className="grow"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 p-4 px-0 pt-0">
        <button type="submit" className="btn btn-success">
          Guardar
        </button>
        <button type="button" className="btn btn-error" onClick={closeModal}>
          Cancelar
        </button>
      </fieldset>
    </form>
  )
}

SupplierForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default SupplierForm
