import TableHeader from '../../components/Table/TableHeader'
import HeaderLayout from '../../layouts/HeaderLayout'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'

function ProcessorPage() {
  return (
    <SectionLayout>
      <HeaderLayout />
      <MainLayout>
        <TableHeader
          title="Listado de Trámitadores"
          searchMethod={() => {}}
          restartCurrentPage={() => {}}
          showModal={() => {}}
        />
      </MainLayout>
    </SectionLayout>
  )
}

export default ProcessorPage
