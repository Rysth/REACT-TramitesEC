import { Button, TextInput } from '@tremor/react'
import { Badge, Label } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDevicePhoneMobile, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createProcessor, updateProcessor } from '../../../redux/slices/ProcessorSlice'

function ProcessorForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorSelected } = useSelector((store) => store.processor)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (processorData) => {
    if (processorSelected) {
      // Check if the processorData is different from processorSelected
      const isDifferent = Object.keys(processorData).some((key) => {
        // Skip the 'user' object
        if (key === 'user') return false
        // Check if the key exists in processorSelected and if their values are different
        return processorSelected.hasOwnProperty(key) && processorData[key] !== processorSelected[key]
      })

      if (isDifferent) {
        dispatch(updateProcessor({ activeToken, processorData: { ...processorData, id: processorSelected.id } }))
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        // No need to update if the data is the same
        closeModal()
      }
    } else {
      dispatch(createProcessor({ activeToken, processorData }))
        .then(() => {
          refetchFunction()
          reset() // Reset the form fields after creating a new processor
        })
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (processorSelected) {
      // Populate the form with the selected processor's data
      Object.keys(processorSelected).forEach((key) => {
        setValue(key, processorSelected[key])
      })
    } else {
      reset() // Reset the form if no processor is selected
    }
  }, [processorSelected, reset, setValue])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue={processorSelected && processorSelected.first_name}
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
              defaultValue={processorSelected && processorSelected.last_name}
              {...register('last_name', { required: true })}
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
              defaultValue={processorSelected && processorSelected.phone}
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

ProcessorForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcessorForm
