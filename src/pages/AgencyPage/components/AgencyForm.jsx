import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDocumentText } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createAgency, updateAgency } from '../../../redux/slices/AgencySlice'

function AgencyForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { agencySelected } = useSelector((store) => store.agency)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const handleCancel = () => {
    reset()
    closeModal()
  }

  const onSubmit = (agencyData) => {
    // Convert type to has_licenses
    agencyData.has_licenses = agencyData.type === 'Licencias'

    if (agencySelected) {
      const isDifferent = Object.keys(agencyData).some((key) => {
        return agencySelected.hasOwnProperty(key) && agencyData[key] !== agencySelected[key]
      })

      if (isDifferent) {
        dispatch(
          updateAgency({
            activeToken,
            agencyData: { ...agencyData, id: agencySelected.id },
          }),
        ).then(() => {
          refetchFunction()
          reset()
          closeModal()
        })
      } else {
        reset()
        closeModal()
      }
    } else {
      dispatch(createAgency({ activeToken, agencyData })).then(() => {
        refetchFunction()
        reset()
        closeModal()
      })
    }
  }

  useEffect(() => {
    if (agencySelected) {
      Object.keys(agencySelected).forEach((key) => {
        setValue(key, agencySelected[key])
      })
      setValue('type', agencySelected.has_licenses ? 'Licencias' : 'Vehicular')
    } else {
      reset()
    }
  }, [agencySelected, reset, setValue])

  // Add cleanup effect
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

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
            <HiMiniDocumentText className="w-4 h-4 opacity-70" />
            <input
              id="name"
              type="text"
              placeholder=""
              defaultValue={agencySelected && agencySelected.name}
              {...register('name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="type" className="label-text">
              Tipo
            </label>
            {errors.type && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2">
            <select
              id="type"
              defaultValue={agencySelected && (agencySelected.has_licenses ? 'Licencias' : 'Vehicular')}
              {...register('type', { required: true })}
              className="grow select select-bordered"
            >
              <option value="Vehicular">Vehicular</option>
              <option value="Licencias">Licencias</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 p-4 px-0 pt-0">
        <button type="submit" className="btn btn-success btn-sm">
          Guardar
        </button>
        <button type="button" className="btn btn-error btn-sm" onClick={handleCancel}>
          Cancelar
        </button>
      </fieldset>
    </form>
  )
}

AgencyForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default AgencyForm
