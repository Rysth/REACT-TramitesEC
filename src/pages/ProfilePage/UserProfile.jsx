import React, { useEffect, useState } from 'react'
import SectionLayout from '../../layouts/SectionLayout'
import { useDispatch, useSelector } from 'react-redux'
import { HiUserCircle } from 'react-icons/hi2'
import { Card, Title, Text, Grid, Col, BarChart } from '@tremor/react'
import axios from 'axios'
import { getProfileStats } from '../../redux/slices/ProfileSlice'
import { useParams } from 'react-router-dom'

function UserProfile() {
  const dispatch = useDispatch()
  const {
    activeToken,
    activeUser: { username },
  } = useSelector((store) => store.authentication)
  const { userData } = useSelector((store) => store.profile)
  const params = useParams()

  useEffect(() => {
    dispatch(getProfileStats({ activeToken, userID: params.id }))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
        <HiUserCircle className="text-8xl" />
        <h2 className="text-2xl sm:text-4xl ">{username}</h2>
      </header>
      <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <Title>Rendimiento Generales (Últimos 6 Meses)</Title>
            <Text>Comparación entre Trámitadores y Clientes</Text>
            <BarChart
              className="mt-4 h-80"
              data={userData}
              index="Meses"
              categories={['Trámitadores', 'Clientes']}
              colors={['blue', 'indigo']}
              stack={false}
              yAxisWidth={60}
            />
          </Card>
        </Col>
        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <div className="h-24" />
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
          </div>
        </Col>
      </Grid>
    </SectionLayout>
  )
}

export default UserProfile
