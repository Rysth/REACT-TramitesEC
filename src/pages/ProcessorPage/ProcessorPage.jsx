import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getProcessors, processorActions, generateExcelFile } from '../../redux/slices/ProcessorSlice'
import ProcessorForm from './components/ProcessorForm'
import ProcessorTable from './components/ProcessorTable'

function ProcessorPage() {
  const {
    entitiesArray: processorsArray,
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
  } = useEntityManagement(getProcessors, 'processor', 'processorsArray')

  return (
    <SectionLayout
      title="Trámitadores"
      subtitle="Información General de los Trámitadores"
      excelMethod={generateExcelFile}
    >
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={ProcessorForm}
        refetchFunction={refetchEntities}
        slice="processor"
        title="Trámitador"
        setEntitySelected={processorActions.setProcessorSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Trámitadores"
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <TableLayout>
            {Array.isArray(processorsArray) ? (
              <ProcessorTable
                currentItems={processorsArray}
                currentPage={currentPage}
                itemsPerPage={15}
                showModal={showModal}
                handleDelete={handleDelete}
              />
            ) : (
              <Loading /> // Placeholder for loading or empty state
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

export default ProcessorPage
