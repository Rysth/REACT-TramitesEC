import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import { 
  generateProcedureExcelFile, 
  getProcedures, 
  procedureActions 
} from '../../redux/slices/ProcedureSlice'
import ProcedureForm from './components/ProcedureForm'
import ProcedureTable from './components/ProcedureTable'

function ProcedurePage({ routeName }) {
  const dispatch = useDispatch(); // Add this line to get the dispatch function
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
    showUnpaid,
    setShowUnpaid,
    showPrimeraVez, // Add this
    setShowPrimeraVez, // Add this
    hasLicenses,
  } = useEntityManagement(getProcedures, 'procedure', 'proceduresArray')

  const { procedureSelected, loading } = useSelector((store) => store.procedure)
  const location = useLocation()
  const isTramitesPage =
    location.pathname.includes('tramites/licencias') || location.pathname.includes('tramites/vehiculares')

  // Effect to set hasLicenses based on routeName
  useEffect(() => {
    setHasLicenses(routeName === 'licencias')
    
    // Reset showPrimeraVez when switching routes
    if (routeName !== 'licencias') {
      setShowPrimeraVez(false)
      // Also dispatch the reset action to ensure Redux state is reset
      dispatch(procedureActions.resetFilters())
    }
  }, [routeName, setHasLicenses, setShowPrimeraVez, dispatch])
  
  // Create a custom close modal function that also clears the selected procedure
  const handleCloseModal = () => {
    dispatch(procedureActions.setProcedureSelected(''));
    closeModal();
  }

  return (
    <SectionLayout
      title={hasLicenses ? 'Trámites de Licencias' : 'Trámites Vehiculares'}
      subtitle="Gestión de Trámites"
      excelMethod={generateProcedureExcelFile}
      showUnpaid={showUnpaid}
      setShowUnpaid={setShowUnpaid}
      showPrimeraVez={hasLicenses ? showPrimeraVez : undefined} // Only show in licencias view
      setShowPrimeraVez={hasLicenses ? setShowPrimeraVez : undefined} // Only show in licencias view
    >
      <TableModal
        openModal={openModal}
        closeModal={handleCloseModal} // Use our custom close function
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
            {loading ? (
              <Loading />
            ) : (
              <ProcedureTable
                currentItems={proceduresArray}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModal}
                handleDelete={handleDelete}
                hasLicenses={routeName === 'licencias'}
              />
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
