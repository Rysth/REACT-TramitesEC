import {
  BarList,
  Card,
  Col,
  DonutChart,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from '@tremor/react'
import { Badge, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaFileContract, FaCircleCheck } from 'react-icons/fa6'
import { HiUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import TablePaginate from '../../components/Table/TablePaginate'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import { fetchLatestProcedures } from '../../redux/slices/CustomerSlice'

const CustomerProfilePage = () => {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { customerProcedures, customerData, customerStats, loading, totalPages, currentPage } = useSelector(
    (store) => store.customer,
  )
  const [page, setPage] = useState(0)
  const params = useParams()

  useEffect(() => {
    const customerID = params.id
    dispatch(fetchLatestProcedures({ activeToken, customerID, page }))
  }, [dispatch, params, activeToken, page])

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1)
  }

  return (
    <>
      <SectionLayout>
        <header className="mb-4">
          <Button className="w-max" color="failure" href="/clientes">
            <FaArrowLeft className="block mr-2" />
            <span className="block">Regresar</span>
          </Button>
        </header>
        <MainLayout>
          <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
            <HiUserCircle className="text-8xl" />
            <h2 className="text-2xl sm:text-4xl ">
              {customerData.nombres} {customerData.apellidos}
            </h2>
          </header>
          <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="text-lg font-bold">Desempeño General</Title>
                <Text>Visualización del total de trámites hechos y finalizados.</Text>
                <BarList
                  data={[
                    {
                      name: 'Trámites Hechos',
                      value: customerStats.tramites || 0,
                      icon: () => <FaFileContract className="mr-1.5" />,
                    },
                    {
                      name: 'Trámites Finalizados',
                      value: customerStats.tramites_finalizados || 0,
                      icon: () => <FaCircleCheck className="mr-1.5" />,
                    },
                  ]}
                  className="mt-6"
                  showAnimation
                />
              </Card>
            </Col>
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="text-lg font-bold">Desempeño en Trámites</Title>
                <Text>Visualización de valores pagados y ganancias generadas.</Text>
                <DonutChart
                  className="mt-6 h-60"
                  data={[
                    { name: 'Valores', value: customerStats.valores || 0 },
                    { name: 'Ganancias', value: customerStats.ganancias || 0 },
                  ]}
                  category="value" // Set the category to "name"
                  index="name"
                  valueFormatter={(value) => `$${new Intl.NumberFormat('us').format(value).toString()}`} // Adjust the value formatter as needed
                  colors={['blue', 'indigo']} // Adjust colors as needed
                  variant="pie"
                  showAnimation
                />
              </Card>
            </Col>
            <Col numColSpanLg={6}>
              <Card className="h-full space-y-4">
                <Title className="text-lg font-bold">Listado de Trámites</Title>
                <Table>
                  <TableHead>
                    <TableRow className="border-b border-x-0">
                      <TableHeaderCell className="w-[10%]">Fecha</TableHeaderCell>
                      <TableHeaderCell className="w-[20%]">Cliente</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Estado</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Tipo de Trámite</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Trámitador</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Usuario</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading &&
                      customerProcedures.map((procedure) => (
                        <TableRow key={procedure.id} className="text-xs">
                          <TableCell>{procedure.fecha}</TableCell>
                          <TableCell>
                            {procedure.customer.nombres} {procedure.customer.apellidos}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                procedure.status.id === 1 ? 'gray' : procedure.status.id === 2 ? 'indigo' : 'success'
                              }
                              className="grid place-items-center"
                            >
                              {procedure.status.nombre}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge color="purple" className="grid place-items-center">
                              {procedure.type.nombre}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-1 truncate">
                            <Badge
                              color="info"
                              className="grid place-items-center"
                              href={`/tramitadores/${procedure.processor.id}`}
                            >
                              {`${procedure.processor.nombres} ${procedure.processor.apellidos}`}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-1 truncate">
                            <Badge color="indigo" className="grid place-items-center">
                              {procedure.user.username}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePaginate currentPage={currentPage} pageCount={totalPages} handlePageChange={handlePageChange} />
              </Card>
            </Col>
          </Grid>
        </MainLayout>
      </SectionLayout>
    </>
  )
}

export default CustomerProfilePage
