import { Box, Container } from '@chakra-ui/react'
import { getHomeLayout } from '~components/layout/DefaultLayout'
import { MotionScroll } from '~components/motion'
import { Underline } from '~components/Underline'
import Hero from '~components/home/Hero'
import Intro from '~components/home/Intro'
import Features from '~components/home/Features'
import Learn from '~components/home/Learn'
import Mode from '~components/home/Mode'
import Activity from '~components/home/Activity'
import FunWiki from '~components/home/FunWiki'
import Cta from '~components/home/Cta'
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <>
      <Hero />
      <Container maxW="container.max" px={0} color="background">
        <MotionScroll distance={800} mb="-600">
          <Intro />
          <Features />
        </MotionScroll>
      </Container>
      <Underline fill="secondary.200" fillTopDots="brand.800" fillBottomDots="brand.900" />
      <Learn />
      <Container maxW="container.max" px={0}>
        <MotionScroll distance={400} mt="-100">
          <Mode />
        </MotionScroll>
      </Container>
      <Activity />
      <Container maxW="container.max" px={0}>
        <FunWiki />
      </Container>
      <Underline fill="brand.500" fillTopDots="secondary.200" fillBottomDots="secondary.300" />
      <Cta />
      <Box h="100vh" />
      <Analytics />
    </>
  )
}

Home.getLayout = getHomeLayout
