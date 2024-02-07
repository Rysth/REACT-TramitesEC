import { Card, Col, Grid, Text, Title, DonutChart, BarChart } from '@tremor/react'
import { Button } from 'flowbite-react'
import React, { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchClientsSentLast7Days } from '../../redux/slices/ProcessorSlice'

const ProcessorProfilePage = () => {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorCustomers } = useSelector((store) => store.processor)
  const params = useParams()

  useEffect(() => {
    const processorID = params.id
    dispatch(fetchClientsSentLast7Days({ activeToken, processorID })).then(() => {
      console.log(processorCustomers)
    })
  }, [dispatch, params])

  useEffect(() => {}, [processorCustomers])

  return (
    <>
      <SectionLayout>
        <header className="mb-4">
          <Button href="/" className="w-max" color="failure">
            <FaArrowLeft className="block mr-2" />
            <span className="block">Regresar</span>
          </Button>
        </header>
        <MainLayout>
          <header className="p-4 border rounded-lg">
            <h3 className="text-center bg-[var(--CL-primary)] py-2 rounded text-white text-xl sm:text-2xl md:py-4">
              Datos del Trámitador
            </h3>
            <div className="grid gap-2 pt-4 sm:grid-cols-2 md:grid-cols-4">
              <p className="text-sm">
                <span className="font-bold">Cédula:</span> 0931237663
              </p>
              <p className="text-sm">
                <span className="font-bold">Nombres:</span> John Andrés
              </p>
              <p className="text-sm">
                <span className="font-bold">Apellidos:</span> Palacios Tutiven
              </p>
            </div>
          </header>
          <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="text-lg font-bold">Desempeño con Clientes</Title>
                <Text>Clientes envíados en los últimos 4 meses</Text>
                <BarChart
                  className="mt-4 h-72"
                  data={processorCustomers}
                  index="Mes"
                  categories={['Clientes']}
                  colors={['blue']}
                  yAxisWidth={30}
                />
              </Card>
            </Col>
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="font-bold">Desempeño con Trámites</Title>
                <Text>Trámites hechos en los últimos 4 meses</Text>
                <BarChart
                  className="mt-4 h-72"
                  data={processorCustomers}
                  index="Mes"
                  categories={['Tramites']}
                  colors={['indigo']}
                  yAxisWidth={30}
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
