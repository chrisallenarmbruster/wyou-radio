import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setCurrentDj } from '../store/djsSlice'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Container, Col, Row, Image, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaMicrophone } from 'react-icons/fa'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './djsStyle.css'

import { EffectFade, Navigation } from 'swiper/modules'

let djAudioGreeting = new Audio()

export function DiscJockeys(props) {
  useEffect(() => {
    return () => {
      djAudioGreeting.pause()
    }
  }, [])

  const navigate = useNavigate()
  const sliderRef = useRef()

  const [isPlaying, setIsPlaying] = useState(false)

  function handleDjAudioGreeting(dj) {
    if (
      djAudioGreeting.src !==
      (dj.details?.audio ||
        window.location.origin + '/audio/default_audio_path.mp3')
    ) {
      djAudioGreeting.src = dj.details?.audio || '/audio/default_audio_path.mp3'
    }

    djAudioGreeting.onplay = () => setIsPlaying(true)
    djAudioGreeting.onended = () => setIsPlaying(false)
    djAudioGreeting.onpause = () => setIsPlaying('paused')

    if (djAudioGreeting.paused) {
      if (isPlaying === 'paused') {
        djAudioGreeting.play()
      } else {
        djAudioGreeting.currentTime = 0
        djAudioGreeting.play()
      }
    } else {
      djAudioGreeting.pause()
    }
  }

  function handleSelectDj(dj) {
    props.selectDj(dj)
    navigate(props.currentStation ? `/radio/player` : `/radio/stations`)
  }

  // Inside your component
  const [imageHeight, setImageHeight] = useState(null)
  const imageRef = useRef(null)

  function handleResize() {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [imageRef])

  // const sliderRef = useRef()
  const handleMouseScroll = (e) => {
    const swiper = sliderRef.current.swiper

    if (e.deltaX > 0 || e.deltaY > 0) {
      swiper.slideNext()
    } else if (
      e.deltaX < 0 ||
      (e.deltaY < 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX))
    ) {
      swiper.slidePrev()
    }
  }

  return (
    <Col>
      <Row className="text-light title">
        <h1 className="h3 mt-3">Select Your Disc Jockey</h1>
      </Row>
      <Row>
        <div
          className="swiper-container"
          // onWheel={handleMouseScroll}
        >
          <Swiper
            ref={sliderRef}
            // style={{ height: imageHeight }}
            autoHeight={true}
            spaceBetween={20}
            slidesPerView={1}
            effect="fade"
            centeredSlides
            navigation
            loop
            modules={[EffectFade, Navigation]}
            onSlideChange={() => {
              djAudioGreeting.pause()
            }}
            className="mySwiper"
          >
            {props.djs.map((dj, idx) => (
              <SwiperSlide
                key={`dj-${idx}`}
                className="bg-dark text-light swiper-slide"
                style={{ height: imageHeight }}
              >
                <Row className="content-row">
                  <Col xs={12} md={6} lg={6} className="image-container">
                    <Image
                      ref={imageRef}
                      src={dj.details?.image}
                      className="rounded-image"
                      onLoad={() => {
                        setImageHeight(imageRef.current.clientHeight)
                      }}
                    />
                  </Col>

                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    className="content-column"
                    style={{
                      height: imageHeight,
                      width: imageHeight,
                      // textAlign: 'top',
                      // justifyContent: 'flex-start',
                    }}
                  >
                    <Row
                      className="content-row-header"
                      style={{
                        width: imageHeight,
                        backgroundColor: '#212529',
                      }}
                    >
                      <Col className="dj-name-container">
                        <span className="dj-name">{dj.djName}</span>
                      </Col>
                      <Col className="buttons-container">
                        <FaMicrophone
                          className={`microphone-icon ${
                            isPlaying === true
                              ? 'playing'
                              : isPlaying === 'paused'
                              ? 'paused'
                              : ''
                          }`}
                          onClick={() => handleDjAudioGreeting(dj)}
                        />
                        <button
                          onClick={() => handleSelectDj(dj)}
                          className="select-button"
                        >
                          Select
                        </button>
                      </Col>
                    </Row>
                    <Row className="content-container">
                      <p
                        className="content"
                        style={{
                          width: imageHeight,
                          backgroundColor: '#212529',
                        }}
                      >
                        {dj.details?.context}
                      </p>
                    </Row>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Row>
    </Col>
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
