import { Button, TextInput } from '@tremor/react'
import { Badge, Label, Select, Table } from 'flowbite-react'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiCurrencyDollar, HiDocument, HiDocumentCheck, HiMiniTrash } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { procedureActions } from '../../../redux/slices/ProcedureSlice'
import { createPayment, deletePayment, getPayments } from '../../../redux/slices/SharedSlice'

const ProcedurePaymentForm = ({ refetchFunction, closeModal }) => {
  const { procedureSelected } = useSelector((store) => store.procedure)
  const { paymentsTypeOriginal, paymentsOriginal } = useSelector((store) => store.shared)
  const dispatch = useDispatch()
  const { activeToken } = useSelector((state) => state.authentication)
  const [paymentType, setPaymentType] = useState(1)
  const [costPending, setCostPending] = useState(0) // State to store cost_pending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (paymentData) => {
    const procedure_id = procedureSelected?.id // Get procedure_id from procedureSelected
    const updatedPaymentData = { ...paymentData, procedure_id } // Include procedure_id in paymentData
    dispatch(createPayment({ activeToken, paymentData: updatedPaymentData }))
      .then(() => {
        dispatch(getPayments({ activeToken, procedureID: procedureSelected.id }))
          .then(() => refetchFunction())
          .then(() => dispatch(procedureActions.setProcedureSelected(procedureSelected.id)))
          .then(() => reset())
      })
      .catch((error) => {
        // Display error message if payment creation fails
        toast.error('Error al crear el pago. Por favor, inténtalo de nuevo.', { autoClose: 2000 })
        console.error('Error creating payment:', error)
      })
  }

  const handleDeletePayment = (paymentID) => {
    dispatch(deletePayment({ activeToken, paymentID }))
      .then(() => refetchFunction())
      .then(() => dispatch(procedureActions.setProcedureSelected(procedureSelected.id)))
      .then(() => reset())
  }

  useEffect(() => {
    dispatch(getPayments({ activeToken, procedureID: procedureSelected.id }))
    setCostPending(procedureSelected?.cost_pending || 0) // Set initial value of cost_pending
  }, [])

  useEffect(() => {
    setValue('payment_type_id', 1)
  }, [setValue])

  const isNotPending = procedureSelected?.is_paid

  return (
    <div className="space-y-4">
      <fieldset className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="payment_type_id" value="Tipo de Pago" />
            {errors.payment_type_id && (
              <Badge className="text-xs" color="failure">
                {errors.payment_type_id.type === 'required' && 'Campo requerido'}
                {errors.payment_type_id.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <Select
            icon={HiDocument}
            id="payment_type_id"
            {...register('payment_type_id')}
            defaultValue={1}
            onChange={(e) => setPaymentType(parseInt(e.target.value))}
            required
            disabled={isNotPending}
          >
            {paymentsTypeOriginal.length > 0 &&
              paymentsTypeOriginal.map((payment_type) => (
                <option key={payment_type.id} value={payment_type.id}>
                  {payment_type.name}
                </option>
              ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="value" value="Valor" />
            {errors.value && (
              <Badge className="text-xs" color="failure">
                {errors.value.type === 'required' && 'Campo requerido'}
                {errors.value.type === 'pattern' && 'Solo números'}
                {errors.value.type === 'positive' && 'Solo valores positivos'}
                {errors.value.type === 'max' && 'Solo valores menores al valor pendiente'}
              </Badge>
            )}
          </div>
          <TextInput
            id="value"
            defaultValue={procedureSelected && procedureSelected.value}
            icon={HiCurrencyDollar}
            {...register('value', {
              required: true,
              pattern: /^[0-9.]+$/i,
              validate: {
                positive: (value) => parseFloat(value) >= 0 || 'Solo valores positivos',
                max: (value) =>
                  parseFloat(value) <= procedureSelected.cost_pending || 'Solo valores menores al valor pendiente',
              },
            })}
            placeholder=""
            disabled={isNotPending}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="receipt_number" value="Comprobante" />
            {errors.receipt_number && (
              <Badge className="text-xs" color="failure">
                {errors.receipt_number.type === 'required' && 'Campo requerido'}
              </Badge>
            )}
          </div>
          <TextInput
            id="receipt_number"
            defaultValue={procedureSelected && procedureSelected.value}
            icon={HiDocumentCheck}
            {...register('receipt_number', { required: paymentType !== 1 })}
            disabled={paymentType === 1}
            placeholder=""
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end">
        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isNotPending}>
          Guardar
        </Button>
      </fieldset>
      <fieldset className="relative overflow-x-auto max-h-64">
        <Table>
          <Table.Head className="sticky top-0">
            <Table.HeadCell className="w-[5%]">Fecha</Table.HeadCell>
            <Table.HeadCell className="w-full">Tipo de Pago</Table.HeadCell>
            <Table.HeadCell className="w-[5%]">Valor</Table.HeadCell>
            <Table.HeadCell className="w-[15%]">Comprobante</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="text-xs divide-y">
            {paymentsOriginal.length > 0 &&
              paymentsOriginal.map((payment) => (
                <Table.Row key={payment.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white  !py-1">
                    {payment.date}
                  </Table.Cell>
                  <Table.Cell className="truncate">{payment.payment_type.name}</Table.Cell>
                  <Table.Cell>${payment.value}</Table.Cell>
                  <Table.Cell>{payment?.receipt_number}</Table.Cell>
                  <Table.Cell className="!py-1">
                    <Button
                      type="button"
                      className="!text-xs"
                      onClick={() => handleDeletePayment(payment.id)}
                      size="xs"
                      color="red"
                    >
                      <span className="sr-only">Eliminar</span>
                      <HiMiniTrash />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </fieldset>
    </div>
  )
}

ProcedurePaymentForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcedurePaymentForm
