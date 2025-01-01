import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDocumentText } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createProcedureType, updateProcedureType } from '../../../redux/slices/ProcedureTypeSlice'

function ProcedureTypeForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { procedureTypeSelected } = useSelector((store) => store.procedureType)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (procedureTypeData) => {
    if (procedureTypeSelected) {
      // Check if the procedureTypeData is different from procedureTypeSelected
      const isDifferent = Object.keys(procedureTypeData).some((key) => {
        return procedureTypeSelected.hasOwnProperty(key) && procedureTypeData[key] !== procedureTypeSelected[key]
      })

      if (isDifferent) {
        dispatch(
          updateProcedureType({
            activeToken,
            procedureTypeData: { ...procedureTypeData, id: procedureTypeSelected.id },
          }),
        )
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        // No need to update if the data is the same
        closeModal()
      }
    } else {
      dispatch(createProcedureType({ activeToken, procedureTypeData }))
        .then(() => {
          refetchFunction()
          reset() // Reset the form fields after creating a new procedure type
        })
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (procedureTypeSelected) {
      // Populate the form with the selected procedure type's data
      Object.keys(procedureTypeSelected).forEach((key) => {
        setValue(key, procedureTypeSelected[key])
      })
    } else {
      reset() // Reset the form if no procedure type is selected
    }
  }, [procedureTypeSelected, reset, setValue])

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
              defaultValue={procedureTypeSelected && procedureTypeSelected.name}
              {...register('name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="label-text">
              Descripción
            </label>
            {errors.description && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniDocumentText className="w-4 h-4 opacity-70" />
            <input
              id="description"
              type="text"
              placeholder=""
              defaultValue={procedureTypeSelected && procedureTypeSelected.description}
              {...register('description', { required: true })}
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

ProcedureTypeForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcedureTypeForm
