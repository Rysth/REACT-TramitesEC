import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getSchools, schoolActions } from '../../redux/slices/SchoolSlice'
import SchoolForm from './components/SchoolForm'
import SchoolTable from './components/SchoolTable'

function SchoolPage() {
  const {
    entitiesArray: schoolsArray,
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
    handleDelete,
    refetchEntities,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntityManagement(getSchools, 'school', 'schoolsArray')

  return (
    <SectionLayout title="Escuelas" subtitle="Gestión de Escuelas">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={SchoolForm}
        refetchFunction={refetchEntities}
        slice="school"
        title="Escuela"
        setEntitySelected={schoolActions.setSchoolSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Escuelas"
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            setSelectedProcessorId={setSelectedProcessorId}
            setSelectedStatusId={setSelectedStatusId}
            setSelectedProcedureTypeId={setSelectedProcedureTypeId}
            showUserFilter={false}
            showProcessorFilter={false}
            showStatusFilter={false}
            showProcedureTypeFilter={false}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <TableLayout>
            {Array.isArray(schoolsArray) ? (
              <SchoolTable
                currentItems={schoolsArray}
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

export default SchoolPage
