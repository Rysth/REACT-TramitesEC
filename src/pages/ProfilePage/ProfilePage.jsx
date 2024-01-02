import { BarChart, Card, Col, Grid, Metric, Text, Title } from '@tremor/react'
import React, { useEffect } from 'react'
import { HiUserCircle } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import SectionLayout from '../../layouts/SectionLayout'
import { getProfileStats } from '../../redux/slices/ProfileSlice'

function ProfilePage() {
  const dispatch = useDispatch()
  const {
    activeToken,
    activeUser: { username, id },
  } = useSelector((store) => store.authentication)
  const { userData } = useSelector((store) => store.profile)

  useEffect(() => {
    dispatch(getProfileStats({ activeToken, userID: id }))
  }, [dispatch, activeToken, id])

  return (
    <SectionLayout>
      <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
        <HiUserCircle className="text-8xl" />
        <h2 className="text-2xl sm:text-4xl ">{username}</h2>
      </header>
      <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
        <Col numColSpanLg={2}>
          <div className="flex flex-col justify-between h-full">
            <Card decoration="top" decorationColor="indigo">
              <Text>EN PROCESO</Text>
              <Metric>{userData.status_counts.en_proceso}</Metric>
            </Card>
            <Card decoration="top" decorationColor="purple">
              <Text>ENTREGADOS POR EL PROVEEDOR</Text>
              <Metric>{userData.status_counts.entregado_proveedor}</Metric>
            </Card>
            <Card decoration="top" decorationColor="blue">
              <Text>ENTREGADOS AL CLIENTE</Text>
              <Metric>{userData.status_counts.entregado_cliente}</Metric>
            </Card>
          </div>
        </Col>
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <Title>Rendimiento Generales (Últimos 6 Meses)</Title>
            <Text>Comparación entre Trámitadores, Clientes y Trámites</Text>
            <BarChart
              className="mt-4 h-80"
              data={userData.quantity_and_months}
              index="Meses"
              categories={['Tramitadores', 'Clientes', 'Tramites']}
              colors={['blue', 'indigo', 'purple']}
              stack={false}
              yAxisWidth={60}
            />
          </Card>
        </Col>
      </Grid>
    </SectionLayout>
  )
}

export default ProfilePage
