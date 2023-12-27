import React, { useEffect, useState } from 'react'
import SectionLayout from '../../layouts/SectionLayout'
import { useSelector } from 'react-redux'
import { HiUserCircle } from 'react-icons/hi2'
import { Card, Title, Text, Grid, Col, BarChart } from '@tremor/react'
import axios from 'axios'

function UserProfile() {
  const API_URL = import.meta.env.VITE_API_URL

  const {
    activeToken,
    activeUser: { username },
  } = useSelector((store) => store.authentication)
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/processors/1`, {
          headers: {
            Authorization: activeToken,
          },
          withCredentials: true,
        })
        setUserData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <SectionLayout>
      <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
        <HiUserCircle className="text-8xl" />
        <h2 className="text-2xl sm:text-4xl ">{username}</h2>
      </header>
      <Grid numItemsLg={6} className="gap-6 pb-10 mt-6">
        {/* Main section */}
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <Title>Rendimiento Generales (Últimos 6 Meses)</Title>
            <Text>Comparación entre Trámitadores y Clientes</Text>
            <BarChart
              className="mt-4 h-80"
              data={userData}
              index="Meses"
              categories={['Trámitadores', 'Clientes']}
              colors={['indigo', 'fuchsia']}
              stack={false}
              yAxisWidth={60}
            />
          </Card>
        </Col>
        {/* KPI sidebar */}
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
