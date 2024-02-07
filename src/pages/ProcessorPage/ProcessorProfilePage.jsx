import {
  BarChart,
  Card,
  Col,
  Grid,
  Text,
  Title,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react'
import { Badge, Button } from 'flowbite-react'
import React, { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { HiUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import { fetchLatestProcedures } from '../../redux/slices/ProcessorSlice'

const ProcessorProfilePage = () => {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorProcedures, processorData, loading } = useSelector((store) => store.processor)
  const params = useParams()

  useEffect(() => {
    const processorID = params.id
    dispatch(fetchLatestProcedures({ activeToken, processorID }))
  }, [dispatch, params])

  useEffect(() => {}, [processorProcedures])

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
              {processorData.nombres} {processorData.apellidos}
            </h2>
          </header>
          <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
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
                  <TableBody>
                    {!loading &&
                      processorProcedures.map((procedure) => (
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
                            <Badge color="info" className="grid place-items-center">
                              {procedure.type.nombre}
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
              </Card>
            </Col>
          </Grid>
        </MainLayout>
      </SectionLayout>
    </>
  )
}

export default ProcessorProfilePage
