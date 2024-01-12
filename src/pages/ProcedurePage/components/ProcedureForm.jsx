import { Button, TextInput } from '@tremor/react'
import { Label, Select } from 'flowbite-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiChatBubbleBottomCenterText,
  HiCurrencyDollar,
  HiDocument,
  HiIdentification,
  HiListBullet,
  HiUser,
} from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { LicenseActions } from '../../../redux/slices/LicenseSlice'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'

function CustomerForm({ closeModal }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((store) => store.authentication)
  const { processorOriginal } = useSelector((store) => store.processor)
  const { customersOriginal } = useSelector((store) => store.customer)
  const { typesOriginal } = useSelector((store) => store.type)
  const { licensesArray } = useSelector((store) => store.license)
  const { statusOriginal } = useSelector((store) => store.status)
  const { procedureSelected } = useSelector((store) => store.procedure)
  const { register, handleSubmit, reset } = useForm()
  //Form
  const [typeID, setTypeID] = useState(1)

  const handleCreateOrUpdate = (newProcedure) => {
    const procedureData = {
      ...newProcedure,
    }

    if (procedureSelected) {
      const oldProcedure = {
        id: procedureSelected.id,
        ...procedureData,
      }
      dispatch(updateProcedure({ activeToken, oldProcedure })).then(() => closeModal())
      return
    }
    dispatch(createProcedure({ activeToken, newProcedure: { user_id: activeUser.id, ...procedureData } })).then(() =>
      closeModal(),
    )
  }

  const onSubmit = (procedureData) => {
    handleCreateOrUpdate(procedureData)
  }

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    dispatch(LicenseActions.filterLicenses(typeID))
  }, [typeID, dispatch])

  useEffect(() => {
    if (procedureSelected) {
      dispatch(LicenseActions.filterLicenses(procedureSelected.type.id))
    }
  }, [procedureSelected, dispatch])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="type_id" value="Tipo Trámite" />
          <Select
            icon={HiDocument}
            id="type_id"
            {...register('type_id')}
            defaultValue={procedureSelected && procedureSelected.type.id}
            onChange={(event) => setTypeID(parseInt(event.target.value))}
            required
          >
            {typesOriginal.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="license_id" value="Licencia" />
          <Select
            icon={HiIdentification}
            id="license_id"
            {...register('license_id')}
            defaultValue={procedureSelected && procedureSelected.license.id}
            required
          >
            {licensesArray.map((license) => (
              <option key={license.id} value={license.id}>
                {license.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status_id" value="Estado" />
          <Select
            icon={HiListBullet}
            id="status_id"
            {...register('status_id')}
            defaultValue={procedureSelected && procedureSelected.status.id}
            required
          >
            {statusOriginal.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nombre}
              </option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="processor_id" value="Trámitador" />
          <Select
            icon={HiUser}
            id="processor_id"
            {...register('processor_id')}
            defaultValue={procedureSelected && procedureSelected.processor.id}
            required
          >
            {processorOriginal.map((processor) => (
              <option key={processor.id} value={processor.id}>{`${processor.nombres} ${processor.apellidos}`}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="customer_id" value="Cliente" />
          <Select
            className="!bg-white"
            icon={HiUser}
            id="customer_id"
            {...register('customer_id')}
            defaultValue={procedureSelected && procedureSelected.customer.id}
            required
          >
            {customersOriginal.map((customer) => (
              <option key={customer.id} value={customer.id}>{`${customer.nombres} ${customer.apellidos}`}</option>
            ))}
          </Select>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="valor" value="Valor" />
          <TextInput
            id="valor"
            defaultValue={procedureSelected && procedureSelected.valor}
            icon={HiCurrencyDollar}
            {...register('valor')}
            placeholder=""
            required
          />
        </div>
        <div>
          <Label htmlFor="valor_pendiente" value="Valor Pendiente" />
          <TextInput
            id="valor_pendiente"
            defaultValue={procedureSelected && procedureSelected.valor_pendiente}
            icon={HiCurrencyDollar}
            {...register('valor_pendiente')}
            required
            placeholder=""
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ganancia" value="Ganancia" />
          <TextInput
            id="ganancia"
            defaultValue={procedureSelected && procedureSelected.ganancia}
            icon={HiCurrencyDollar}
            {...register('ganancia')}
            placeholder=""
            required
          />
        </div>
        <div>
          <Label htmlFor="ganancia_pendiente" value="Ganancia Pendiente" />
          <TextInput
            id="ganancia_pendiente"
            defaultValue={procedureSelected && procedureSelected.ganancia_pendiente}
            icon={HiCurrencyDollar}
            {...register('ganancia_pendiente')}
            placeholder=""
            required
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="placa" value="Placa" />
          <TextInput
            id="placa"
            defaultValue={procedureSelected && procedureSelected.placa}
            icon={HiIdentification}
            placeholder=""
            {...register('placa')}
          />
        </div>
        <div>
          <Label htmlFor="observaciones" value="Observaciones" />
          <TextInput
            id="observaciones"
            defaultValue={procedureSelected && procedureSelected.observaciones}
            icon={HiChatBubbleBottomCenterText}
            placeholder=""
            {...register('observaciones')}
          />
        </div>
      </fieldset>

      <fieldset className="flex items-center justify-end gap-2 mt-10">
        <Button color="blue" type="submit" className="mt-3">
          Guardar
        </Button>
        <Button color="red" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default CustomerForm
