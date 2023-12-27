import React from 'react'
import SectionLayout from '../../layouts/SectionLayout'
import { useSelector } from 'react-redux'
import { HiUserCircle } from 'react-icons/hi2'
import { Card, Title, Text, Grid, Col } from '@tremor/react'

function UserProfile() {
  const { username } = useSelector((store) => store.authentication.activeUser)

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
            <div className="h-60" />
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
