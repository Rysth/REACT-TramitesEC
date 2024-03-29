import { Button, TextInput } from '@tremor/react'
import { Badge, Label, Select } from 'flowbite-react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiChatBubbleBottomCenterText,
  HiCurrencyDollar,
  HiDocument,
  HiIdentification,
  HiListBullet,
} from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import usePlate from '../../../hooks/usePlate'
import { fetchCustomerOptions } from '../../../redux/slices/CustomerSlice'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'
import { sharedActions } from '../../../redux/slices/SharedSlice'
import ProcedurePaymentForm from './ProcedurePaymentForm'
import { HiCalendar } from 'react-icons/hi'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { typesOriginal, licensesOriginal, statusOriginal, selectedProcedureType, paymentsOriginal } = useSelector(
    (store) => store.shared,
  )
  const { procedureSelected, loading } = useSelector((store) => store.procedure)
  const [disableProcessor, setDisableProcessor] = useState()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  // Function to handle changes in the cost field
  const handleCostChange = (e) => {
    const cost = e.target.value
    setValue('cost_pending', cost)
  }

  const handleProfitChange = (e) => {
    const profit = e.target.value
    setValue('profit_pending', profit)
  }

  const onSubmit = (procedureData) => {
    if (procedureSelected) {
      // Check if the processorData is different from processorSelected
      const isDifferent = Object.keys(procedureSelected).some((key) => {
        if (
          key === 'user' ||
          key === 'processor' ||
          key === 'status' ||
          key === 'procedure_type' ||
          key === 'license' ||
          key === 'customer'
        ) {
          return false
        }

        if (key === 'status_id') {
          console.log(parseInt(procedureData[key]) !== parseInt(procedureSelected[key]))
          return parseInt(procedureData[key]) !== parseInt(procedureSelected[key])
        }

        // Check if the key exists in processorSelected and if their values are different
        return procedureSelected.hasOwnProperty(key) && procedureData[key] !== procedureSelected[key]
      })

      if (isDifferent) {
        dispatch(updateProcedure({ activeToken, procedureData: { ...procedureData, id: procedureSelected.id } }))
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        closeModal()
      }
    } else {
      dispatch(createProcedure({ activeToken, procedureData }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    }
  }

  // Load processor options
  const loadProcessorOptions = debounce((inputValue, callback) => {
    dispatch(fetchProcessorOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((processor) => ({
          label: `${processor.code} - ${processor.first_name.split(' ')[0]} ${processor.last_name.split(' ')[0]}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 700)

  // Load customer options
  const loadCustomerOptions = debounce((inputValue, callback) => {
    dispatch(fetchCustomerOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((customer) => ({
          label: `${customer.is_direct ? 'CD - ' : ''}${customer.identification} - ${customer.first_name.split(' ')[0]} ${customer.last_name.split(' ')[0]} `,
          value: customer.id,
          isDirect: customer.is_direct,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 700)

  const handleProcedureSelectedChange = (e) => {
    const procedureTypeID = parseInt(e.target.value)
    dispatch(sharedActions.setProcedureTypeSelected(procedureTypeID))
  }

  useEffect(() => {
    if (procedureSelected) {
      console.log(procedureSelected)
      dispatch(sharedActions.setProcedureTypeSelected(procedureSelected.procedure_type.id))
      Object.keys(procedureSelected).forEach((key) => {
        if (key === 'created_at') {
          const formattedDate = new Date(procedureSelected[key]).toISOString().split('T')[0]
          setValue(key, formattedDate)
        } else {
          setValue(key, procedureSelected[key])
        }
      })
      if (procedureSelected.customer?.is_direct) setDisableProcessor(true)
    } else {
      dispatch(sharedActions.setProcedureTypeSelected(0))
      reset()
    }
  }, [procedureSelected, reset, setValue])

  const isCompleted = procedureSelected?.status.id === 3 || procedureSelected?.status.id === 4
  const isNotPending = procedureSelected?.is_paid
  const hasPayments = procedureSelected && paymentsOriginal.length > 0
  const shouldUsePlate = usePlate(selectedProcedureType)

  const routeName = useLocation().pathname
  const isRouteLicenses = routeName.includes('licencias')

  const newFilterArray = isRouteLicenses
    ? typesOriginal.filter((item) => item.has_licenses)
    : typesOriginal.filter((item) => !item.has_licenses)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={`grid gap-4 ${procedureSelected && 'md:grid-cols-[42.5%_1fr]'}`}>
        <div className="grid space-y-4">
          <fieldset className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="created_at" value="Fecha del Trámite" />
                {errors.created_at && (
                  <Badge className="text-xs" color="failure">
                    {errors.created_at.type === 'required' && 'Campo requerido'}
                  </Badge>
                )}
              </div>
              <TextInput
                id="created_at"
                icon={HiCalendar}
                {...register('created_at', { required: true })}
                placeholder=""
                type="date"
                /* disabled={isCompleted} */
                defaultValue={
                  procedureSelected
                    ? String(procedureSelected.created_at).split('T')[0]
                    : new Date().toISOString().split('T')[0]
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="status_id" value="Estado" />
                {errors.status_id && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <Select icon={HiListBullet} id="status_id" {...register('status_id')} required>
                {statusOriginal.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </Select>
            </div>
          </fieldset>
          <fieldset className={`grid gap-4  ${isRouteLicenses && 'sm:grid-cols-2'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="procedure_type_id" value="Tipo Trámite" />
                {errors.procedure_type_id && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <Select
                icon={HiDocument}
                id="procedure_type_id"
                {...register('procedure_type_id')}
                onChange={(e) => handleProcedureSelectedChange(e)}
                disabled={procedureSelected && (isCompleted || hasPayments)}
                required
              >
                {newFilterArray.map((procedure_type) => (
                  <option key={procedure_type.id} value={procedure_type.id}>
                    {procedure_type.name}
                  </option>
                ))}
              </Select>
            </div>
            {isRouteLicenses && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="license_id" value="Licencia" />
                  {errors.license_id && (
                    <Badge className="text-xs" color="failure">
                      Campo Requerido
                    </Badge>
                  )}
                </div>
                <Select
                  icon={HiIdentification}
                  id="license_id"
                  {...register('license_id')}
                  disabled={procedureSelected && (isCompleted || hasPayments)}
                  required
                >
                  {licensesOriginal.map((license) => (
                    <option key={license.id} value={license.id}>
                      {license.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="processor_id" value="Trámitador" />
                {errors.processor_id && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <AsyncSelect
                cacheOptions
                id="processor_id"
                loadOptions={loadProcessorOptions}
                defaultOptions
                placeholder="Buscar Trámitador..."
                onChange={(selectedOption) => {
                  setValue('processor_id', selectedOption.value)
                }}
                defaultValue={
                  procedureSelected && procedureSelected.processor
                    ? {
                        label: `${procedureSelected.processor.code} - ${procedureSelected.processor.first_name} ${procedureSelected.processor.last_name}`,
                        value: procedureSelected.processor.id,
                      }
                    : undefined
                }
                className="text-sm shadow shadow-gray-200"
                isDisabled={isCompleted || hasPayments || disableProcessor}
                required={!shouldUsePlate || !disableProcessor}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customer_id" value="Cliente" />
                {errors.customer_id && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <AsyncSelect
                cacheOptions
                loadOptions={loadCustomerOptions}
                defaultOptions
                placeholder="Buscar Cliente..."
                onChange={(selectedOption) => {
                  setValue('customer_id', selectedOption.value)
                  // Check if the selected customer has is_direct set to true
                  if (selectedOption && selectedOption.isDirect) {
                    setValue('processor_id', null) // Set processor_id to null
                    setDisableProcessor(true)
                  } else {
                    // Enable the processor selector if the customer is not direct
                    setDisableProcessor(false)
                  }
                }}
                defaultValue={
                  procedureSelected && procedureSelected.customer
                    ? {
                        label: `${procedureSelected.customer.identification} - ${procedureSelected.customer.first_name} ${procedureSelected.customer.last_name}`,
                        value: procedureSelected.customer.id,
                      }
                    : undefined
                }
                isDisabled={isCompleted || hasPayments}
                className="text-sm shadow shadow-gray-200"
                required={isRouteLicenses}
              />
            </div>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cost" value="Valor" />
                {errors.cost && (
                  <Badge className="text-xs" color="failure">
                    {errors.cost.type === 'required' && 'Campo requerido'}
                    {errors.cost.type === 'pattern' && 'Solo números'}
                  </Badge>
                )}
              </div>
              <TextInput
                id="cost"
                icon={HiCurrencyDollar}
                {...register('cost', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                onChange={handleCostChange}
                disabled={procedureSelected && (isCompleted || isNotPending || hasPayments)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cost_pending" value="Valor Pendiente" />
              </div>
              <TextInput
                id="cost_pending"
                icon={HiCurrencyDollar}
                {...register('cost_pending', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                disabled
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profit" value="Ganancia" />
                {errors.profit && (
                  <Badge className="text-xs" color="failure">
                    {errors.profit.type === 'required' && 'Campo requerido'}
                    {errors.profit.type === 'pattern' && 'Solo números'}
                  </Badge>
                )}
              </div>
              <TextInput
                id="profit"
                icon={HiCurrencyDollar}
                {...register('profit', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                onChange={handleProfitChange}
                disabled={procedureSelected && (isCompleted || isNotPending || hasPayments)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profit_pending" value="Ganancia Pendiente" />
              </div>
              <TextInput
                id="profit_pending"
                icon={HiCurrencyDollar}
                {...register('profit_pending', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                disabled
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="comments" value="Comentarios" />
              </div>
              <TextInput id="comments" icon={HiChatBubbleBottomCenterText} placeholder="" {...register('comments')} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="plate" value="Placa" />
                {errors.plate && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <TextInput
                id="plate"
                icon={HiIdentification}
                placeholder=""
                disabled={isCompleted || isNotPending || hasPayments || isRouteLicenses}
                {...register('plate', { required: !isRouteLicenses })}
              />
            </div>
          </fieldset>
        </div>
        {procedureSelected && <ProcedurePaymentForm refetchFunction={refetchFunction} closeModal={closeModal} />}
      </div>
      <fieldset className="flex items-center justify-end gap-2 mt-4">
        <Button color="green" type="submit" disabled={loading}>
          Guardar
        </Button>
        <Button color="red" onClick={closeModal}>
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CustomerForm
