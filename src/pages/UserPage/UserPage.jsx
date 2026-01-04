import { Card } from '@tremor/react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loading from '../../components/Loading/Loading'
import TableHeader from '../../components/Table/TableHeader'
import TableModal from '../../components/Table/TableModal'
import TablePaginate from '../../components/Table/TablePaginate'
import useEntityManagement from '../../hooks/useEntityManagement'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import TableLayout from '../../layouts/TableLayout'
import { getUsers, userActions } from '../../redux/slices/UserSlice'
import UserForm from './components/UserForm'
import UserTable from './components/UserTable'

function UserPage() {
  const { activeUser } = useSelector((store) => store.authentication)

  // Only admins can access this page
  if (!activeUser?.is_admin) {
    return <Navigate to="/" replace />
  }

  const {
    entitiesArray: usersArray,
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
  } = useEntityManagement(getUsers, 'users', 'usersArray')

  return (
    <SectionLayout title="Usuarios" subtitle="Gestión de Usuarios">
      <TableModal
        openModal={openModal}
        closeModal={closeModal}
        formComponent={UserForm}
        refetchFunction={refetchEntities}
        slice="users"
        title="Usuario"
        setEntitySelected={userActions.setUserSelected}
      />
      <MainLayout>
        <Card className="p-0 mt-4">
          <TableHeader
            title="Listado de Usuarios"
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
            {Array.isArray(usersArray) ? (
              <UserTable
                currentItems={usersArray}
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

export default UserPage
