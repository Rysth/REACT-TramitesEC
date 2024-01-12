import { Button, Label, TextInput } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDevicePhoneMobile, HiMiniUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
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
    }

    if (processorSelected) {
      const oldProcessor = {
        id: processorSelected.id,
        ...processorData,
      }
      dispatch(updateProcessor({ activeToken, oldProcessor })).then(() => closeModal())
      return
    }

    const newProccessorData = {
      ...newProcessor,
      user_id,
    }

    dispatch(createProcessor({ activeToken, newProcessor: newProccessorData })).then(() => closeModal())
  }

  const onSubmit = (processorData) => {
    handleCreateOrUpdate(processorData)
  }

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <form className="grid space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-2">
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
      </fieldset>
      <fieldset className="grid">
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
        <Button color="blue" type="submit" className="mt-3 ">
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
