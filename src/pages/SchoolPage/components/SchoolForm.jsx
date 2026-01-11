import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDocumentText } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createSchool, updateSchool } from '../../../redux/slices/SchoolSlice'
import { getSchools as getSchoolsShared } from '../../../redux/slices/SharedSlice'

function SchoolForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { schoolSelected } = useSelector((store) => store.school)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { active: true },
  })

  const onSubmit = (schoolData) => {
    schoolData.active = Boolean(schoolData.active)

    const refreshSharedSchools = () => dispatch(getSchoolsShared(activeToken))

    if (schoolSelected) {
      const isDifferent = ['name', 'active'].some((key) => schoolData[key] !== schoolSelected[key])

      if (isDifferent) {
        dispatch(updateSchool({ activeToken, schoolData: { ...schoolData, id: schoolSelected.id } }))
          .then(() => refreshSharedSchools())
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        closeModal()
      }
    } else {
      dispatch(createSchool({ activeToken, schoolData }))
        .then(() => {
          return refreshSharedSchools()
        })
        .then(() => {
          refetchFunction()
          reset({ name: '', active: true })
        })
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (schoolSelected) {
      Object.keys(schoolSelected).forEach((key) => {
        setValue(key, schoolSelected[key])
      })
    } else {
      reset({ name: '', active: true })
    }
  }, [schoolSelected, reset, setValue])

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
              {...register('name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="active" className="label-text">
              Activo
            </label>
            {errors.active && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              className="toggle toggle-success"
              {...register('active')}
              checked={watch('active')}
              onChange={(e) => setValue('active', e.target.checked)}
            />
            <span className="text-sm">Disponible para asignar</span>
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

SchoolForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default SchoolForm
