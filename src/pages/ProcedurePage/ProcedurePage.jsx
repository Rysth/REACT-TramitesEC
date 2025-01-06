import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { generateProcedureExcelFile, getProcedures, procedureActions } from '../../redux/slices/ProcedureSlice'
import ProcedureForm from './components/ProcedureForm'
import ProcedureTable from './components/ProcedureTable'

function ProcedurePage({ routeName }) {
  const {
    entitiesArray: proceduresArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    setSearch,
    setSelectedUserId,
    setSelectedProcessorId,
    setSelectedStatusId,
    setSelectedProcedureTypeId,
    setHasLicenses,
    handleDelete,
    refetchEntities,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntityManagement(getProcedures, 'procedure', 'proceduresArray')

  const { procedureSelected } = useSelector((store) => store.procedure)
  const [showUnpaid, setShowUnpaid] = useState(false)
  const location = useLocation()
  const isTramitesPage =
    location.pathname.includes('tramites/licencias') || location.pathname.includes('tramites/vehiculares')

  const filteredProcedures = showUnpaid ? proceduresArray.filter((procedure) => !procedure.is_paid) : proceduresArray

  useEffect(() => {
    setHasLicenses(routeName === 'licencias')
  }, [routeName, setHasLicenses])

  return (
    <SectionLayout
      title="Trámites"
      subtitle="Gestión de Trámites"
      excelMethod={generateProcedureExcelFile}
      showUnpaid={showUnpaid}
      setShowUnpaid={setShowUnpaid}
    >
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcedureForm}
        refetchFunction={refetchEntities}
        slice="procedure"
        title="Trámite"
        modalSize={procedureSelected ? 'large' : 'small'}
        setEntitySelected={procedureActions.setProcedureSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámites"
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            setSelectedStatusId={setSelectedStatusId}
            setSelectedProcedureTypeId={setSelectedProcedureTypeId}
            showUserFilter={false}
            showProcessorFilter
            showStatusFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            showUnpaidFilter={isTramitesPage}
            setShowUnpaid={setShowUnpaid}
          />
          <TableLayout>
            {Array.isArray(proceduresArray) ? (
              <ProcedureTable
                currentItems={filteredProcedures}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModal}
                handleDelete={handleDelete}
              />
            ) : (
              <Loading />
            )}
          </TableLayout>
          <TablePaginate
            currentPage={currentPage - 1}
            pageCount={totalPages}
            handlePageChange={handlePageChange}
            showModal={showModal}
          />
        </Card>
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcedurePage
