import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getAgencies, agencyActions, generateExcelFile } from '../../redux/slices/AgencySlice'
import AgencyForm from './components/AgencyForm'
import AgencyTable from './components/AgencyTable'

function AgencyPage() {
  const {
    entitiesArray: agenciesArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    setSearch,
    setSelectedUserId,
    handleDelete,
    refetchEntities,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEntityManagement(getAgencies, 'agency', 'agenciesArray')

  return (
    <SectionLayout title="Agencias" subtitle="Información General de las Agencias" excelMethod={generateExcelFile}>
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={AgencyForm}
        refetchFunction={refetchEntities}
        slice="agency"
        title="Agencia"
        setEntitySelected={agencyActions.setAgencySelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Agencias"
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            showUserFilter={false}
          />
          <TableLayout>
            {Array.isArray(agenciesArray) ? (
              <AgencyTable
                currentItems={agenciesArray}
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

export default AgencyPage
