import { Card } from '@tremor/react'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { generateExcelFile, getSuppliers, supplierActions } from '../../redux/slices/SupplierSlice'
import SupplierForm from './components/SupplierForm'
import SupplierTable from './components/SupplierTable'

function SupplierPage() {
  const {
    entitiesArray: suppliersArray,
    totalPages,
    currentPage,
    openModal,
    showModal,
    closeModal,
    handlePageChange,
    resetToFirstPage,
    setSearch,
    setSelectedUserId,
    handleDelete,
  } = useEntityManagement(getSuppliers, 'supplier', 'suppliersArray')

  return (
    <SectionLayout
      title="Proveedores"
      subtitle="Información General de los Proveedores"
      excelMethod={generateExcelFile}
    >
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={SupplierForm}
        refetchFunction={resetToFirstPage}
        slice="supplier"
        title="Proveedor"
        setEntitySelected={supplierActions.setSupplierSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Proveedores"
            restartCurrentPage={resetToFirstPage}
            setSearch={setSearch}
            setSelectedUserId={setSelectedUserId}
          />
          <TableLayout>
            {Array.isArray(suppliersArray) ? (
              <SupplierTable
                currentItems={suppliersArray}
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

export default SupplierPage
