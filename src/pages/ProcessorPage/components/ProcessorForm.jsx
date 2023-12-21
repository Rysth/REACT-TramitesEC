import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { Button, Label, TextInput } from 'flowbite-react'
import { HiIdentification, HiMiniUserCircle, HiMiniDevicePhoneMobile } from 'react-icons/hi2'
import { createProcessor, updateProcessor } from '../../../redux/slices/ProcessorSlice'

function ProcessorForm({ closeModal }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { id: user_id } = useSelector((store) => store.authentication.activeUser)
  const { processorSelected } = useSelector((store) => store.processor)
  const { register, handleSubmit, reset } = useForm()

  const handleCreateOrUpdate = (newProcessor) => {
    const processorData = {
      ...newProcessor,
      user_id,
    }

    if (processorSelected) {
      const oldProcessor = {
        id: processorSelected.id,
        ...processorData,
      }
      dispatch(updateProcessor({ activeToken, oldProcessor })).then(() => closeModal())
      return
    }

    dispatch(createProcessor({ activeToken, newProcessor: processorData })).then(() => closeModal())
  }

  const onSubmit = (processorData) => {
    handleCreateOrUpdate(processorData)
  }

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cedula" value="Cédula" />
          <TextInput
            id="cedula"
            placeholder="0985736265"
            defaultValue={processorSelected && processorSelected.cedula}
            icon={HiIdentification}
            {...register('cedula')}
            required
          />
        </div>
        <div>
          <Label htmlFor="nombres" value="Nombres" />
          <TextInput
            id="nombres"
            placeholder="John Doe"
            defaultValue={processorSelected && processorSelected.nombres}
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
            placeholder="Sánchez Castro"
            defaultValue={processorSelected && processorSelected.apellidos}
            icon={HiMiniUserCircle}
            {...register('apellidos')}
            required
          />
        </div>
        <div>
          <Label htmlFor="celular" value="Celular" />
          <TextInput
            id="celular"
            placeholder="0966553564"
            defaultValue={processorSelected && processorSelected.celular}
            icon={HiMiniDevicePhoneMobile}
            {...register('celular')}
            required
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 mt-10">
        <Button color="blue" type="submit" className="mt-3">
          Guardar
        </Button>
        <Button color="failure" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

ProcessorForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default ProcessorForm
