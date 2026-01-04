import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import usePlate from '../../../hooks/usePlate'
import { fetchCustomerOptions } from '../../../redux/slices/CustomerSlice'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'
import { sharedActions } from '../../../redux/slices/SharedSlice'
import { fetchSupplierOptions } from '../../../redux/slices/SupplierSlice'
import ProcedurePaymentForm from './ProcedurePaymentForm'
import { procedureActions } from '../../../redux/slices/ProcedureSlice'
import { toast } from 'react-toastify'

function ProcedureForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { typesOriginal, licensesOriginal, statusOriginal, selectedProcedureType, paymentsOriginal, agenciesOriginal, coursesOriginal } =
    useSelector((store) => store.shared)
  const { procedureSelected, loading } = useSelector((store) => store.procedure)
  const [disableProcessor, setDisableProcessor] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false) // Add this state to track when data is fully loaded
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      created_at: new Date().toISOString().split('T')[0],
      cost: '',
      cost_pending: '',
      profit: '',
      profit_pending: '',
      comments: '',
      plate: '',
      notification_days: '',
      // Don't set these default values here, we'll set them in the useEffect after data loading
      // status_id: '',
      // procedure_type_id: '',
      // license_id: ''
    },
  })
  const [selectedProcessor, setSelectedProcessor] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState([])
  const [hasPayments, setHasPayments] = useState(false)
  // Add a state to track if the current procedure is "Primera Vez"
  const [isPrimeraVez, setIsPrimeraVez] = useState(false)

  // Function to handle changes in the cost field
  const handleCostChange = (e) => {
    // Parse value as number but validate to ensure it's greater than zero
    const cost = Number(e.target.value)
    
    // If there are payments, we need to calculate the pending cost differently
    if (hasPayments && paymentsOriginal) {
      const totalPayments = paymentsOriginal.reduce((sum, payment) => sum + parseFloat(payment.value || 0), 0)
      const newCostPending = Math.max(0, cost - totalPayments).toFixed(2)
      setValue('cost_pending', newCostPending)
    } else {
      // Set cost_pending to same as cost
      setValue('cost_pending', cost.toFixed(2))
    }
  }

  // Update handleProfitChange to be more robust
  const handleProfitChange = (e) => {
    try {
      // Allow zero values by using Number() instead of parseFloat
      const profit = Number(e.target.value)

      // If there are payments, we need to calculate the pending profit differently
      if (hasPayments && paymentsOriginal) {
        const totalPayments = paymentsOriginal.reduce((sum, payment) => sum + parseFloat(payment.value || 0), 0)
        const cost = Number(getValues('cost') || 0)

        // Calculate what percentage of the cost has been paid
        const paymentRatio = cost === 0 ? 0 : totalPayments / cost

        // Calculate pending profit based on the payment ratio
        const pendingProfit = Math.max(0, profit * (1 - paymentRatio)).toFixed(2)
        setValue('profit_pending', pendingProfit)
      } else {
        // Handle zero values properly
        setValue('profit_pending', profit.toFixed(2))
      }
    } catch (error) {
      console.error('Error updating profit_pending:', error)
    }
  }

  // Function to check if the selected procedure type is "Primera Vez"
  const checkIsPrimeraVez = (procedureTypeId) => {
    if (!procedureTypeId || !typesOriginal || !Array.isArray(typesOriginal)) return false

    const procedureType = typesOriginal.find((pt) => pt.id === parseInt(procedureTypeId))
    return procedureType?.name === 'Primera Vez'
  }

  // Handle procedure type selection change
  const handleProcedureSelectedChange = (e) => {
    const procedureTypeID = parseInt(e.target.value)
    dispatch(sharedActions.setProcedureTypeSelected(procedureTypeID))

    // Check if the selected procedure type is "Primera Vez"
    setIsPrimeraVez(checkIsPrimeraVez(procedureTypeID))
  }

  // Check if the procedure type is "Primera Vez" when the component mounts or when the selected procedure changes
  useEffect(() => {
    if (procedureSelected?.procedure_type_id) {
      setIsPrimeraVez(checkIsPrimeraVez(procedureSelected.procedure_type_id))
    }
  }, [procedureSelected, typesOriginal])

  // Update onSubmit to handle validation errors
  const onSubmit = (procedureData) => {
    // Check if necessary data is loaded
    if (statusOriginal?.length === 0 || newFilterArray?.length === 0) {
      toast.error('Por favor espere mientras se cargan los datos necesarios.', { theme: 'colored' });
      return;
    }
    
    // More visible error for zero cost
    if (Number(procedureData.cost) <= 0) {
      toast.error('El valor del trámite debe ser mayor que cero.', { theme: 'colored' });
      document.getElementById('cost').focus();
      setValue('cost', procedureData.cost, { shouldValidate: true });
      return;
    }
    
    // Ensure numeric fields are properly parsed as numbers
    const numericFields = ['cost', 'cost_pending', 'profit', 'profit_pending', 'supplier_amount'];
    numericFields.forEach(field => {
      if (procedureData[field] !== undefined) {
        procedureData[field] = Number(procedureData[field] || 0);
      }
    });

    // Handle notification_days - convert to number or null
    if (procedureData.notification_days === '' || procedureData.notification_days === undefined) {
      procedureData.notification_days = null;
    } else {
      procedureData.notification_days = Number(procedureData.notification_days);
    }

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
          return parseInt(procedureData[key]) !== parseInt(procedureSelected[key])
        }

        return procedureSelected.hasOwnProperty(key) && procedureData[key] !== procedureSelected[key]
      })

      if (isDifferent) {
        dispatch(updateProcedure({ activeToken, procedureData: { ...procedureData, id: procedureSelected.id } }))
        .then(() => {
          refetchFunction()
          closeModal()
          setDisableProcessor(false)
        })
        .catch((error) => {
          console.error('Error updating procedure:', error)
          
          // If it's a plate validation error, close the modal
          if (error?.shouldCloseModal && error?.isPlateError) {
            setTimeout(() => {
              closeModal()
              refetchFunction() // Refresh the list
            }, 2000) // Wait 2 seconds for user to read the error message
            return
          }
          
          // For other errors, focus on the plate field if there's a plate error
          if (error?.field_errors?.plate) {
            const plateField = document.getElementById('plate');
            if (plateField) {
              plateField.focus();
              plateField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        })
      } else {
        closeModal()
      }
    } else {
      dispatch(createProcedure({ activeToken, procedureData }))
      .unwrap()
      .then(() => {
        refetchFunction()
        closeModal()
        reset()
        setDisableProcessor(false)
      })
      .catch((error) => {
        console.error('Error creating procedure:', error)
        
        // If it's a plate validation error, close the modal
        if (error?.shouldCloseModal && error?.isPlateError) {
          setTimeout(() => {
            closeModal()
            refetchFunction() // Refresh the list
          }, 2000) // Wait 2 seconds for user to read the error message
          return
        }
        
        // For other errors, focus on the plate field if there's a plate error
        if (error?.field_errors?.plate) {
          const plateField = document.getElementById('plate');
          if (plateField) {
            plateField.focus();
            plateField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      })
    }
    setSelectedProcessor([])
    setSelectedCustomer([])
    setSelectedSupplier([])
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
  }, 300)

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
  }, 300)

  // Load supplier options
  const loadSupplierOptions = debounce((inputValue, callback) => {
    dispatch(fetchSupplierOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((supplier) => ({
          label: `${supplier.identification} - ${supplier.name}`,
          value: supplier.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 300)

  useEffect(() => {
    if (procedureSelected) {
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
      if (procedureSelected.processor) {
        setSelectedProcessor([
          {
            label: `${procedureSelected.processor.code} - ${procedureSelected.processor.first_name} ${procedureSelected.processor.last_name}`,
            value: procedureSelected.processor.id,
          },
        ])
      }
      if (procedureSelected.customer) {
        setSelectedCustomer([
          {
            label: `${procedureSelected.customer.identification} - ${procedureSelected.customer.first_name} ${procedureSelected.customer.last_name}`,
            value: procedureSelected.customer.id,
          },
        ])
      }
      if (procedureSelected.supplier) {
        setSelectedSupplier([
          {
            label: `${procedureSelected.supplier.identification} - ${procedureSelected.supplier.name}`,
            value: procedureSelected.supplier.id,
          },
        ])
      }
    } else {
      dispatch(sharedActions.setProcedureTypeSelected(0))
    }
  }, [procedureSelected, setValue])

  // Check if the procedure has payments
  useEffect(() => {
    if (paymentsOriginal && paymentsOriginal.length > 0) {
      setHasPayments(true)
    } else {
      setHasPayments(false)
    }
  }, [paymentsOriginal])

  // Handle procedureSelected changes
  useEffect(() => {
    if (procedureSelected) {
      try {
        dispatch(sharedActions.setProcedureTypeSelected(procedureSelected.procedure_type.id))
        Object.keys(procedureSelected).forEach((key) => {
          if (key === 'created_at') {
            const formattedDate = new Date(procedureSelected[key]).toISOString().split('T')[0]
            setValue(key, formattedDate, { shouldValidate: true })
          } else {
            setValue(key, procedureSelected[key], { shouldValidate: true })
          }
        })
      } catch (error) {
        console.error('Error setting procedure values:', error)
      }
    }
  }, [procedureSelected, setValue, dispatch])

  const isCompleted = procedureSelected?.status.id === 3 || procedureSelected?.status.id === 4
  const isNotPending = procedureSelected?.is_paid
  const shouldUsePlate = usePlate(selectedProcedureType)

  const routeName = useLocation().pathname
  const isRouteLicenses = routeName.includes('licencias')

  const newFilterArray = Array.isArray(typesOriginal)
    ? isRouteLicenses
      ? typesOriginal.filter((item) => item.has_licenses)
      : typesOriginal.filter((item) => !item.has_licenses)
    : []

  // Add filtered agencies based on procedure type
  const filteredAgencies = agenciesOriginal.filter((agency) => agency.has_licenses === isRouteLicenses)

  const handleCancel = () => {
    reset({
      created_at: new Date().toISOString().split('T')[0],
      cost: '',
      cost_pending: '',
      profit: '',
      profit_pending: '',
      comments: '',
      plate: '',
      course_id: '',
    });
    setSelectedProcessor([]);
    setSelectedCustomer([]);
    setSelectedSupplier([]);
    setDisableProcessor(false);
    setHasPayments(false);
    setIsPrimeraVez(false);
    dispatch(procedureActions.setProcedureSelected(''));  // Make sure to clear this
    closeModal()
  }

  const onInvalid = (errors) => {
    console.error(errors);
    
    // Show toast with specific validation errors
    if (errors.cost?.type === 'validate') {
      toast.error(errors.cost.message, { theme: 'colored' });
    } else if (errors.cost) {
      toast.error('El valor del trámite debe ser mayor que cero.', { theme: 'colored' });
    } else {
      toast.error('Por favor, complete todos los campos requeridos.', { theme: 'colored' });
    }
  }

  // Add cleanup effect
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // When procedureSelected is null (creating new procedure), fully reset the form
  useEffect(() => {
    if (!procedureSelected) {
      reset({
        created_at: new Date().toISOString().split('T')[0],
        cost: '',
        cost_pending: '',
        profit: '',
        profit_pending: '',
        comments: '',
        plate: '',
        processor_id: '',
        customer_id: '',
        supplier_id: '',
        supplier_amount: '',
        status_id: statusOriginal?.[0]?.id || '',
        procedure_type_id: newFilterArray?.[0]?.id || '',
        license_id: licensesOriginal?.[0]?.id || '',
        agency_id: '',
        course_id: '',
      });
      setSelectedProcessor([]);
      setSelectedCustomer([]);
      setSelectedSupplier([]);
      setDisableProcessor(false);
      setHasPayments(false);
      setIsPrimeraVez(false);
    }
  }, [procedureSelected]);

  // Check when all required data is loaded
  useEffect(() => {
    const hasStatus = statusOriginal && statusOriginal.length > 0;
    const hasTypes = typesOriginal && typesOriginal.length > 0;
    const hasLicenses = licensesOriginal && licensesOriginal.length > 0;
    const hasAgencies = agenciesOriginal && agenciesOriginal.length > 0;
    
    // Set dataLoaded when all required data is available
    setDataLoaded(hasStatus && hasTypes && hasAgencies);
  }, [statusOriginal, typesOriginal, licensesOriginal, agenciesOriginal]);

  // Set default values when data is loaded and we're creating a new procedure
  useEffect(() => {
    if (!procedureSelected && dataLoaded) {
      const routeName = location.pathname;
      const isRouteLicenses = routeName.includes('licencias');
      
      // Filter procedure types based on license type
      const filteredTypes = typesOriginal.filter(item => 
        isRouteLicenses ? item.has_licenses : !item.has_licenses
      );
      
      // Check if we have filtered types
      if (filteredTypes.length > 0) {
        // Set default procedure type
        setValue('procedure_type_id', filteredTypes[0].id, { 
          shouldValidate: true, 
          shouldDirty: false 
        });
        
        // Check if selected type is "Primera Vez"
        setIsPrimeraVez(filteredTypes[0].name === 'Primera Vez');
        
        // Set the selected procedure type in the store
        dispatch(sharedActions.setProcedureTypeSelected(filteredTypes[0].id));
      }
      
      // Set default status
      if (statusOriginal.length > 0) {
        setValue('status_id', statusOriginal[0].id, { 
          shouldValidate: true, 
          shouldDirty: false 
        });
      }
      
      // Set default license for license procedures
      if (isRouteLicenses && licensesOriginal.length > 0) {
        setValue('license_id', licensesOriginal[0].id, { 
          shouldValidate: true, 
          shouldDirty: false 
        });
      }
      
      // Set today's date as the default created_at
      setValue('created_at', new Date().toISOString().split('T')[0], {
        shouldValidate: true,
        shouldDirty: false
      });
    }
  }, [procedureSelected, dataLoaded, statusOriginal, typesOriginal, licensesOriginal, setValue, dispatch, location.pathname]);

  // Add this function for numbers-only input validation
  const handleNumberInput = (e) => {
    // Only allow digits and decimal point
    const value = e.target.value;
    
    // Replace any character that is not a digit or dot
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    if ((sanitizedValue.match(/\./g) || []).length > 1) {
      e.target.value = sanitizedValue.substr(0, sanitizedValue.lastIndexOf('.'));
    } else {
      e.target.value = sanitizedValue;
    }
  };

  return (
    <div className={`grid gap-4 ${procedureSelected && 'md:grid-cols-[42.5%_1fr]'}`}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="grid space-y-4">
          <fieldset className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="created_at" className="label label-text">
                  Fecha del Trámite
                </label>
                {errors.created_at && (
                  <span className="text-xs badge badge-error">
                    {errors.created_at.type === 'required' && 'Campo requerido'}
                  </span>
                )}
              </div>
              <input
                id="created_at"
                className="w-full input input-bordered"
                {...register('created_at', {
                  required: true,
                  validate: (value) => {
                    const date = new Date(value)
                    return !isNaN(date.getTime()) || 'Invalid date'
                  },
                })}
                type="date"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="status_id" className="label label-text">
                  Estado
                </label>
                {errors.status_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <select
                id="status_id"
                className="w-full select select-bordered"
                {...register('status_id', { required: true })}
                disabled={!dataLoaded}
              >
                {!dataLoaded || !statusOriginal || statusOriginal.length === 0 ? (
                  <option value="">Cargando estados...</option>
                ) : (
                  statusOriginal.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </fieldset>
          <fieldset className={`grid gap-4  ${isRouteLicenses && 'sm:grid-cols-2'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="procedure_type_id" className="label label-text">
                  Tipo Trámite
                </label>
                {errors.procedure_type_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <select
                id="procedure_type_id"
                className="w-full select select-bordered"
                {...register('procedure_type_id', { required: true })}
                onChange={(e) => handleProcedureSelectedChange(e)}
                disabled={procedureSelected && (isCompleted || isNotPending) || !dataLoaded}
              >
                {!dataLoaded || newFilterArray.length === 0 ? (
                  <option value="">Cargando tipos de trámite...</option>
                ) : (
                  newFilterArray.map((procedure_type) => (
                    <option key={procedure_type.id} value={procedure_type.id}>
                      {procedure_type.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {isRouteLicenses && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="license_id" className="label label-text">
                    Licencia
                  </label>
                  {errors.license_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
                </div>
                <select
                  id="license_id"
                  className="w-full select select-bordered "
                  {...register('license_id')}
                  disabled={procedureSelected && (isCompleted || isNotPending)}
                  required
                >
                  {licensesOriginal.map((license) => (
                    <option key={license.id} value={license.id}>
                      {license.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>
          {/* Course selector - only visible for "Primera Vez" license procedures */}
          {isRouteLicenses && isPrimeraVez && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="course_id" className="label label-text">
                  Curso
                </label>
                {errors.course_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <select
                id="course_id"
                className="w-full select select-bordered"
                {...register('course_id')}
                disabled={procedureSelected && (isCompleted || isNotPending)}
              >
                <option value="">Seleccionar Curso</option>
                {coursesOriginal && coursesOriginal.filter(course => course.active).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Notification selector - only visible for "Primera Vez" license procedures */}
          {isRouteLicenses && isPrimeraVez && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="notification_days" className="label label-text">
                  🔔 Notificar en
                </label>
                {procedureSelected?.notification_sent && (
                  <span className="text-xs badge badge-success">
                    ✓ Notificación enviada
                  </span>
                )}
                {procedureSelected?.notification_scheduled_at && !procedureSelected?.notification_sent && (
                  <span className="text-xs badge badge-warning">
                    Programada: {new Date(procedureSelected.notification_scheduled_at).toLocaleDateString('es-EC')}
                  </span>
                )}
              </div>
              <select
                id="notification_days"
                className="w-full select select-bordered"
                {...register('notification_days')}
                disabled={procedureSelected && (isCompleted || isNotPending || procedureSelected?.notification_sent)}
              >
                <option value="">Sin notificación</option>
                <option value="1">1 día</option>
                <option value="7">7 días</option>
                <option value="15">15 días</option>
                <option value="30">1 mes</option>
              </select>
              {!procedureSelected?.customer?.email && procedureSelected && (
                <p className="text-xs text-warning">⚠️ El cliente no tiene email registrado</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="agency_id" className="label label-text">
                Agencia
              </label>
              {errors.agency_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
            </div>
            <select
              id="agency_id"
              className="w-full select select-bordered"
              {...register('agency_id')}
              disabled={procedureSelected && (isCompleted || isNotPending)}
            >
              <option value="">Seleccionar Agencia</option>
              {filteredAgencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="processor_id" className="label label-text">
                  Trámitador
                </label>
                {errors.processor_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <AsyncSelect
                cacheOptions
                id="processor_id"
                loadOptions={loadProcessorOptions}
                defaultOptions
                placeholder="Buscar Trámitador..."
                onChange={(selectedOption) => {
                  setValue('processor_id', selectedOption.value)
                  setSelectedProcessor([selectedOption])
                }}
                value={selectedProcessor}
                className="text-sm shadow shadow-gray-200"
                isDisabled={isCompleted || isNotPending || disableProcessor}
                required={!shouldUsePlate || !disableProcessor}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="customer_id" className="label label-text">
                  Cliente
                </label>
                {errors.customer_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <AsyncSelect
                cacheOptions
                loadOptions={loadCustomerOptions}
                defaultOptions
                placeholder="Buscar Cliente..."
                onChange={(selectedOption) => {
                  setValue('customer_id', selectedOption.value)
                  if (selectedOption && selectedOption.isDirect) {
                    setValue('processor_id', null)
                    setSelectedCustomer([selectedOption])
                    setSelectedProcessor([])
                    setDisableProcessor(true)
                  } else {
                    setSelectedCustomer([selectedOption])
                    setDisableProcessor(false)
                  }
                }}
                value={selectedCustomer}
                isDisabled={isCompleted || isNotPending}
                className="text-sm shadow shadow-gray-200"
                required={isRouteLicenses}
              />
            </div>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cost" className="label label-text">
                  Valor
                </label>
                {/* Improve error display to show all error types */}
                {errors.cost && (
                  <span className="text-xs badge badge-error">
                    {errors.cost.type === 'required' && 'Campo requerido'}
                    {errors.cost.type === 'pattern' && 'Solo números'}
                    {errors.cost.type === 'validate' && errors.cost.message}
                  </span>
                )}
                {/* Add a warning badge to always show the requirement */}
                {hasPayments && !isPrimeraVez && (
                  <span className="text-xs badge badge-info">Tiene pagos</span>
                )}
              </div>
              <input
                id="cost"
                className="w-full input input-bordered"
                {...register('cost', { 
                  required: true, 
                  pattern: /^[0-9.]+$/i,
                  validate: (value) => {
                    const numValue = Number(value);
                    return numValue > 0 || "Debe ser mayor que cero";
                  }
                })}
                placeholder="0.00"
                onChange={(e) => {
                  handleNumberInput(e); // Apply number validation first
                  handleCostChange(e);  // Then apply your existing logic
                }}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter, decimal point
                  if (![8, 46, 9, 27, 13, 110, 190].includes(e.keyCode) && 
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      !(e.keyCode === 65 && e.ctrlKey === true) && 
                      !(e.keyCode === 67 && e.ctrlKey === true) && 
                      !(e.keyCode === 86 && e.ctrlKey === true) && 
                      !(e.keyCode === 88 && e.ctrlKey === true) && 
                      // Allow: home, end, left, right
                      !(e.keyCode >= 35 && e.keyCode <= 39) &&
                      // Allow numbers
                      !/[0-9.]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={
                  procedureSelected &&
                  (isCompleted || isNotPending || (hasPayments && !isPrimeraVez))
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cost_pending" className="label label-text">
                  Valor Pendiente
                </label>
              </div>
              <input
                id="cost_pending"
                className="w-full input input-bordered"
                {...register('cost_pending', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                disabled
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="profit" className="label label-text">
                  Ganancia
                </label>
                {errors.profit && (
                  <span className="text-xs badge badge-error">
                    {errors.profit.type === 'required' && 'Campo requerido'}
                    {errors.profit.type === 'pattern' && 'Solo números'}
                  </span>
                )}
                {hasPayments && !isPrimeraVez && (
                  <span className="text-xs badge badge-info">Tiene pagos</span>
                )}
              </div>
              <input
                id="profit"
                className="w-full input input-bordered"
                {...register('profit', {
                  required: true,
                  pattern: /^[0-9.]+$/i,
                  onChange: (e) => {
                    handleNumberInput(e); // Apply number validation
                    handleProfitChange(e); // Your existing handler
                  },
                  validate: (value) => Number(value) >= 0 || "Valor debe ser mayor o igual a 0"
                })}
                placeholder="0.00"
                onKeyDown={(e) => {
                  // Same key validation as above
                  if (![8, 46, 9, 27, 13, 110, 190].includes(e.keyCode) && 
                      !(e.keyCode === 65 && e.ctrlKey === true) && 
                      !(e.keyCode === 67 && e.ctrlKey === true) && 
                      !(e.keyCode === 86 && e.ctrlKey === true) && 
                      !(e.keyCode === 88 && e.ctrlKey === true) && 
                      !(e.keyCode >= 35 && e.keyCode <= 39) &&
                      !/[0-9.]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={
                  procedureSelected &&
                  (isCompleted || isNotPending || (hasPayments && !isPrimeraVez))
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="profit_pending" className="label label-text">
                  Ganancia Pendiente
                </label>
              </div>
              <input
                id="profit_pending"
                className="w-full input input-bordered"
                {...register('profit_pending', { required: true, pattern: /^[0-9.]+$/i })}
                placeholder=""
                disabled
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="supplier_amount" className="label label-text">
                  Valor a Proveedor
                </label>
                {errors.supplier_amount && (
                  <span className="text-xs badge badge-error">
                    {errors.supplier_amount.type === 'required' && 'Campo requerido'}
                    {errors.supplier_amount.type === 'pattern' && 'Solo números'}
                  </span>
                )}
                
              </div>
              <input
                id="supplier_amount"
                className="w-full input input-bordered"
                {...register('supplier_amount', { 
                  required: false, 
                  pattern: /^[0-9.]+$/i,
                  validate: (value) => !value || Number(value) >= 0 || "Valor debe ser mayor o igual a 0"
                })}
                placeholder="0.00"
                onChange={handleNumberInput}
                onKeyDown={(e) => {
                  // Same key validation as above
                  if (![8, 46, 9, 27, 13, 110, 190].includes(e.keyCode) && 
                      !(e.keyCode === 65 && e.ctrlKey === true) && 
                      !(e.keyCode === 67 && e.ctrlKey === true) && 
                      !(e.keyCode === 86 && e.ctrlKey === true) && 
                      !(e.keyCode === 88 && e.ctrlKey === true) && 
                      !(e.keyCode >= 35 && e.keyCode <= 39) &&
                      !/[0-9.]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={procedureSelected && (isCompleted || isNotPending)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="supplier_id" className="label label-text">
                  Proveedor
                </label>
                {errors.supplier_id && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <AsyncSelect
                cacheOptions
                id="supplier_id"
                loadOptions={loadSupplierOptions}
                defaultOptions
                placeholder="Buscar Proveedor..."
                onChange={(selectedOption) => {
                  setValue('supplier_id', selectedOption.value)
                  setSelectedSupplier([selectedOption])
                }}
                value={selectedSupplier}
                className="text-sm shadow shadow-gray-200"
                isDisabled={isCompleted || isNotPending}
              />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="comments" className="label label-text ">
                  Comentarios
                </label>
              </div>
              <input id="comments" className="w-full input input-bordered " placeholder="" {...register('comments')} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="plate" className="label label-text">
                  Placa
                </label>
                {errors.plate && <span className="text-xs badge badge-error">Campo Requerido</span>}
              </div>
              <input
                id="plate"
                className="w-full input input-bordered "
                placeholder=""
                disabled={isCompleted || isNotPending || isRouteLicenses}
                {...register('plate', { 
                  required: !isRouteLicenses,
                  validate: {
                    notEmpty: value => isRouteLicenses || value.trim() !== '' || 'La placa no puede estar vacía'
                  }
                })}
              />
              {errors.plate && (
                <div className="mt-1 text-xs text-red-600">
                  {errors.plate.type === 'required' && 'Campo Requerido'}
                  {errors.plate.type === 'validate' && errors.plate.message}
                </div>
              )}
            </div>
          </fieldset>
        </div>
        <fieldset className="flex items-center justify-end gap-2 px-0 pb-6 mt-4">
          <button className="btn btn-success btn-sm" type="submit" disabled={loading || !dataLoaded}>
            Guardar
          </button>
          <button className="btn btn-error btn-sm" type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </fieldset>
      </form>
      <div>
        {procedureSelected && <ProcedurePaymentForm refetchFunction={refetchFunction} closeModal={closeModal} />}
      </div>
    </div>
  )
}

ProcedureForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcedureForm
