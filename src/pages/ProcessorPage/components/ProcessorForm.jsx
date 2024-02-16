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
        .then(() => refetchFunction())
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
            <Label htmlFor="nombres" value="Nombres" />
            {errors.first_name && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="first_name"
            placeholder=""
            defaultValue={processorSelected && processorSelected.first_name}
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
            defaultValue={processorSelected && processorSelected.apellidos}
            icon={HiMiniUserCircle}
            {...register('last_name', { required: true })}
          />
        </div>
      </fieldset>
      <fieldset className="grid">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="celular" value="Teléfono" />
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
            defaultValue={processorSelected && processorSelected.celular}
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

ProcessorForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcessorForm
