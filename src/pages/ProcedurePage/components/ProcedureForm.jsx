import { Button, TextInput } from '@tremor/react'
import { Badge, Label, Select } from 'flowbite-react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiChatBubbleBottomCenterText,
  HiCurrencyDollar,
  HiDocument,
  HiIdentification,
  HiListBullet,
} from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { fetchCustomerOptions } from '../../../redux/slices/CustomerSlice'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'
import { sharedActions } from '../../../redux/slices/SharedSlice'
import ProcedurePaymentForm from './ProcedurePaymentForm'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { typesOriginal, licensesOriginal, statusOriginal, selectedProcedureType, paymentsOriginal } = useSelector(
    (store) => store.shared,
  )
  const { procedureSelected } = useSelector((store) => store.procedure)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

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
      dispatch(updateProcedure({ activeToken, procedureData: { ...procedureData, id: procedureSelected.id } }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    } else {
      console.table(procedureData)
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
          label: `${processor.code} - ${processor.first_name} ${processor.last_name}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 800)

  // Load customer options
  const loadCustomerOptions = debounce((inputValue, callback) => {
    dispatch(fetchCustomerOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((customer) => ({
          label: `${customer.identification} - ${customer.first_name} ${customer.last_name}`,
          value: customer.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 800)

  const handleProcedureSelectedChange = (e) => {
    const procedureTypeID = parseInt(e.target.value)
    dispatch(sharedActions.setProcedureTypeSelected(procedureTypeID))
  }

  useEffect(() => {
    if (procedureSelected) {
      dispatch(sharedActions.setProcedureTypeSelected(procedureSelected.procedure_type.id))
      Object.keys(procedureSelected).forEach((key) => {
        setValue(key, procedureSelected[key])
      })
    } else {
      reset() // Reset the form if no procedure is selected
    }
  }, [procedureSelected, reset, setValue])

  const isCompleted = procedureSelected?.status.id === 3 || procedureSelected?.status.id === 4
  const isNotPending = procedureSelected?.cost_pending === 0

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={`grid gap-4 ${procedureSelected && 'md:grid-cols-[45%_1fr]'}`}>
        <div className="grid space-y-4">
          <fieldset className="grid gap-4 sm:grid-cols-2">
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
                defaultValue={procedureSelected && procedureSelected.procedure_type.id}
                disabled={isCompleted}
                required
              >
                {typesOriginal.map((procedure_type) => (
                  <option key={procedure_type.id} value={procedure_type.id}>
                    {procedure_type.name}
                  </option>
                ))}
              </Select>
            </div>
            {selectedProcedureType && selectedProcedureType.has_licenses && (
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
                  defaultValue={procedureSelected && procedureSelected.license?.id}
                  disabled={isCompleted}
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
          <fieldset>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="status_id" value="Estado" />
                {errors.status_id && (
                  <Badge className="text-xs" color="failure">
                    Campo Requerido
                  </Badge>
                )}
              </div>
              <Select
                icon={HiListBullet}
                id="status_id"
                {...register('status_id')}
                defaultValue={procedureSelected && procedureSelected.status.id}
                required
              >
                {statusOriginal.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </Select>
            </div>
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
                loadOptions={loadProcessorOptions}
                defaultOptions
                placeholder="Buscar Trámitador..."
                onChange={(selectedOption) => setValue('processor_id', selectedOption.value)}
                defaultValue={
                  procedureSelected && procedureSelected.processor
                    ? {
                        label: `${procedureSelected.processor.code} - ${procedureSelected.processor.first_name} ${procedureSelected.processor.last_name}`,
                        value: procedureSelected.processor.id,
                      }
                    : undefined
                }
                className="text-sm shadow shadow-gray-200"
                isDisabled={isCompleted}
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
                onChange={(selectedOption) => setValue('customer_id', selectedOption.value)}
                defaultValue={
                  procedureSelected && procedureSelected.customer
                    ? {
                        label: `${procedureSelected.customer.identification} - ${procedureSelected.customer.first_name} ${procedureSelected.customer.last_name}`,
                        value: procedureSelected.customer.id,
                      }
                    : undefined
                }
                isDisabled={isCompleted}
                className="text-sm shadow shadow-gray-200"
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
                defaultValue={procedureSelected && procedureSelected.cost}
                icon={HiCurrencyDollar}
                {...register('cost', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                onChange={handleCostChange}
                disabled={isCompleted && isNotPending}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cost_pending" value="Valor Pendiente" />
                {errors.cost_pending && (
                  <Badge className="text-xs" color="failure">
                    {errors.cost_pending.type === 'required' && 'Campo requerido'}
                    {errors.cost_pending.type === 'pattern' && 'Solo números'}
                  </Badge>
                )}
              </div>
              <TextInput
                id="cost_pending"
                defaultValue={procedureSelected && procedureSelected.cost_pending}
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
                defaultValue={procedureSelected && procedureSelected.profit}
                icon={HiCurrencyDollar}
                {...register('profit', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                onChange={handleProfitChange}
                disabled={isCompleted && isNotPending}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profit_pending" value="Ganancia Pendiente" />
                {errors.profit_pending && (
                  <Badge className="text-xs" color="failure">
                    {errors.profit_pending.type === 'required' && 'Campo requerido'}
                    {errors.profit_pending.type === 'pattern' && 'Solo números'}
                  </Badge>
                )}
              </div>
              <TextInput
                id="profit_pending"
                defaultValue={procedureSelected && procedureSelected.profit_pending}
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
              <TextInput
                id="comments"
                defaultValue={procedureSelected && procedureSelected.comments}
                icon={HiChatBubbleBottomCenterText}
                placeholder=""
                {...register('comments')}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="plate" value="Placa" />
              </div>
              <TextInput
                id="plate"
                defaultValue={procedureSelected && procedureSelected.plate}
                icon={HiIdentification}
                placeholder=""
                disabled={selectedProcedureType?.id !== 2}
                {...register('plate')}
              />
            </div>
          </fieldset>
        </div>
        {procedureSelected && <ProcedurePaymentForm refetchFunction={refetchFunction} closeModal={closeModal} />}
      </div>
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

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CustomerForm
