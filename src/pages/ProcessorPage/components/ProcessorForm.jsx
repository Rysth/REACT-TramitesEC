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
      dispatch(updateProcessor({ activeToken, processorData: { ...processorData, id: processorSelected.id } }))
        .then(() => refetchFunction())
        .then(() => closeModal())
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
            {errors.nombres && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <TextInput
            id="nombres"
            placeholder=""
            defaultValue={processorSelected && processorSelected.nombres}
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
            defaultValue={processorSelected && processorSelected.apellidos}
            icon={HiMiniUserCircle}
            {...register('apellidos', { required: true })}
          />
        </div>
      </fieldset>
      <fieldset className="grid">
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
            defaultValue={processorSelected && processorSelected.celular}
            icon={HiMiniDevicePhoneMobile}
            {...register('celular', { required: true, pattern: /^[0-9]+$/i })}
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 mt-10">
        <Button color="blue" type="submit" className="mt-3 ">
          Guardar
        </Button>
        <Button color="red" onClick={closeModal} className="mt-3">
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
