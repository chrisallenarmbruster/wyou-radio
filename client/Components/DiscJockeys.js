import React, { useRef, useState, useEffect } from "react"
import { connect } from "react-redux"
import { setCurrentDj } from "../store/djsSlice"
import { Swiper, SwiperSlide } from "swiper/react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"

import "./djsStyle.css"

import { EffectFade, Navigation, Pagination } from "swiper/modules"

let djAudioGreeting = new Audio()

export function DiscJockeys(props) {
  useEffect(() => {
    return () => {
      djAudioGreeting.pause()
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      // sliderRef.current.swiper.slideTo(0)
    }, 100)
  }, [])

  const navigate = useNavigate()

  const sliderRef = useRef()

  function handleDjAudioGreeting(dj) {
    console.log("dj", dj)
    djAudioGreeting.src =
      dj.details?.audio ||
      "audio/ElevenLabs_2023-09-01T23_59_37_Donny - very deep_gen_s50_sb75_se0_b_m2.mp3"
    djAudioGreeting.play()
  }

  function handleSelectDj(dj) {
    props.setCurrentDj(dj)
    if (props.currentStation) {
      navigate(`/radio/player`)
    } else {
      navigate(`/radio/stations`)
    }
  }

  return (
    <>
      <div className="text-light">
        <h1 className="h3 mt-3">Select Disc Jockey</h1>
      </div>
      <Swiper
        ref={sliderRef}
        spaceBetween={30}
        autoHeight={true}
        slidesPerView={1}
        // initialSlide={0}
        effect={"fade"}
        // grabCursor={true}
        centeredSlides={true}
        navigation={true}
        loop={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
        onSlideChange={() => {
          djAudioGreeting.pause()
        }}
      >
        {props.djs.map((dj, idx) => (
          <SwiperSlide key={`dj-${idx}`} className="bg-dark text-light">
            <Row className=" bg-dark text-light">
              <Col sm={12} md={6} className="px-5">
                <Image src={dj.details?.image} />
              </Col>
              <Col
                sm={12}
                md={6}
                className="px-5 text-start bg-dark mt-sm-3 mt-md-0"
              >
                <h2 className="h3 ">
                  {dj.djName}
                  <Button
                    className="ms-3"
                    size="sm"
                    onClick={() => handleDjAudioGreeting(dj)}
                  >
                    Greeting
                  </Button>
                  <Button
                    className="mx-3"
                    size="sm"
                    onClick={() => handleSelectDj(dj)}
                  >
                    Select
                  </Button>
                </h2>
                <p>{dj.details?.context}</p>
              </Col>
            </Row>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    djs: state.djs.allDjs,
    currentStation: state.stations.currentStation,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentDj: (dj) => dispatch(setCurrentDj(dj)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscJockeys)
