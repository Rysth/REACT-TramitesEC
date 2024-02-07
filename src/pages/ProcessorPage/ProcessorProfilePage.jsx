import { Card, Col, Grid, Text, Title, DonutChart, BarChart } from '@tremor/react'
import { Button } from 'flowbite-react'
import React, { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import MainLayout from '../../layouts/MainLayout'
import SectionLayout from '../../layouts/SectionLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchClientsSentLast7Days } from '../../redux/slices/ProcessorSlice'
import { HiUserCircle } from 'react-icons/hi2'

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
          <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
            <HiUserCircle className="text-8xl" />
            <h2 className="text-2xl sm:text-4xl ">John Palacios</h2>
          </header>
          <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
            <Col numColSpanLg={3}>
              <Card className="h-full">
                <Title className="text-lg font-bold">Desempeño con Clientes</Title>
                <Text>Clientes envíados en los últimos 5 meses</Text>
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
                <Text>Trámites hechos en los últimos 5 meses</Text>
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
