import {
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
  BarChart,
  BarList,
} from '@tremor/react'
import { Badge, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaPerson, FaFileContract } from 'react-icons/fa6'
import { HiUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import TablePaginate from '../../components/Table/TablePaginate'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import { fetchLatestProcedures } from '../../redux/slices/ProcessorSlice'

const ProcessorProfilePage = () => {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorProcedures, processorData, processorStats, loading, totalPages, currentPage } = useSelector(
    (store) => store.processor,
  )
  const [page, setPage] = useState(1)
  const params = useParams()

  useEffect(() => {
    const processorID = params.id
    dispatch(fetchLatestProcedures({ activeToken, processorID, page }))
  }, [dispatch, params, activeToken, page])

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1)
  }

  return (
    <>
      <SectionLayout>
        <header className="mb-4">
          <Button className="w-max" color="failure" href="/">
            <FaArrowLeft className="block mr-2" />
            <span className="block">Regresar</span>
          </Button>
        </header>
        <MainLayout>
          <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
            <HiUserCircle className="text-8xl" />
            <h2 className="text-2xl sm:text-4xl ">
              {processorData.first_name} {processorData.last_name}
            </h2>
          </header>
          <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="text-lg font-bold">Desempeño General</Title>
                <p className="flex items-center justify-between mt-4 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  <span>Título</span>
                  <span>Cantidad</span>
                </p>
                <BarList
                  data={[
                    {
                      name: 'Cantidad de Trámites Realizados',
                      value: processorStats.tramites || 0,
                      icon: () => <FaFileContract className="mr-1.5" />,
                      color: 'indigo',
                    },
                    {
                      name: 'Trámites en Proceso',
                      value: processorStats.tramites_proceso || 0,
                      icon: () => <FaFileContract className="mr-1.5" />,
                      color: 'gray',
                    },
                    {
                      name: 'Trámites entregado Proveedor',
                      value: processorStats.tramites_proveedor || 0,
                      icon: () => <FaFileContract className="mr-1.5" />,
                      color: 'purple',
                    },
                    {
                      name: 'Trámites Finalizados',
                      value: processorStats.tramites_finalizados || 0,
                      icon: () => <FaFileContract className="mr-1.5" />,
                      color: 'green',
                    },
                    {
                      name: 'Clientes',
                      value: processorStats.clientes || 0,
                      icon: () => <FaPerson className="mr-1.5" />,
                    },
                  ]}
                  className="mt-2"
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
                    { name: 'Valores', value: processorStats.valores || 0 },
                    { name: 'Ganancias', value: processorStats.ganancias || 0 },
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
                      <TableHeaderCell className="w-[30%]">Cliente</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Estado</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Tipo de Trámite</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Usuario</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="min-h-[24rem]">
                    {!loading &&
                      processorProcedures.map((procedure) => (
                        <TableRow key={procedure.id} className="text-xs">
                          <TableCell>{procedure.date}</TableCell>
                          <TableCell>
                            <a
                              href={`/clientes/${procedure.customer.id}`}
                              className="transition hover:text-blue-500 hover:underline"
                            >
                              {procedure.customer.first_name} {procedure.customer.last_name}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                procedure.status.id === 1
                                  ? 'gray'
                                  : procedure.status.id === 2
                                    ? 'indigo'
                                    : procedure.status.id === 3
                                      ? 'purple'
                                      : 'success'
                              }
                              className="grid place-items-center"
                            >
                              {procedure.status.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge color="info" className="grid place-items-center">
                              {procedure.procedure_type.name}
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
                <TablePaginate
                  currentPage={currentPage - 1}
                  pageCount={totalPages}
                  handlePageChange={handlePageChange}
                />
              </Card>
            </Col>
          </Grid>
        </MainLayout>
      </SectionLayout>
    </>
  )
}

export default ProcessorProfilePage
