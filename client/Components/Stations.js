import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'

import { setCurrentStation } from '../store/stationsSlice'
import { clearCurrentTrack } from '../store/playerSlice'
import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/swiper-bundle.css'
import { setJamSessionId } from '../store/jamSessionSlice'
import './stationsStyle.css'

export function Stations(props) {
  const {
    stations,
    playContext,
    setCurrentStation,
    pauseSpotify,
    clearCurrentTrack,
    setJamSessionId,
  } = props

  const navigate = useNavigate()

  const sliderRef = useRef()
  const handleMouseScroll = (e) => {
    const swiper = sliderRef.current.swiper

    if (e.deltaX > 0 || e.deltaY > 0) {
      swiper.slideNext()
    } else if (e.deltaX < 0 || e.deltaY < 0) {
      swiper.slidePrev()
    }
  }

  return (
    <Col className="text-center">
      <Row className="text-light title2 justify-content-center">
        <h1 className="h3 mt-3">Select Your Music</h1>
      </Row>
      <Row>
        <Col
          onWheel={handleMouseScroll}
          style={{
            overflow: 'hidden',
            objectFit: 'contain',
          }}
        >
          <Swiper
            ref={sliderRef}
            className="mySwiper2"
            modules={[EffectCoverflow, Pagination]}
            effect={'coverflow'}
            autoHeight={true}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={4}
            speed={600}
            coverflowEffect={{
              rotate: 20, //50
              stretch: -10, //-75
              depth: 300, //300
              modifier: 1.5, //1
              slideShadows: true,
            }}
            loop={true}
            loopedSlides={2}
            pagination={{
              type: 'bullets',
              clickable: true,
            }}
            breakpoints={{
              337: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 3,
              },
              977: {
                slidesPerView: 4,
              },
            }}
          >
            {stations.length > 0 ? (
              stations.map((station) => (
                <SwiperSlide key={station.id}>
                  <img
                    src={station.images[0].url}
                    onClick={() => {
                      // pauseSpotify()
                      clearCurrentTrack()
                      setCurrentStation(station)
                      setJamSessionId()
                      playContext({ uri: station.uri })
                      navigate('/radio/player')
                    }}
                    style={{
                      float: 'left',
                      width: '100%',
                      // height: '100%',
                      imageFit: 'cover',
                    }}
                  />
                </SwiperSlide>
              ))
            ) : (
              <div>No stations available</div>
            )}
          </Swiper>
        </Col>
      </Row>
    </Col>
  )
}

const mapStateToProps = (state) => {
  return {
    stations: state.stations.allStations,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentStation: (station) => dispatch(setCurrentStation(station)),
    clearCurrentTrack: () => dispatch(clearCurrentTrack()),
    setJamSessionId: (id) => dispatch(setJamSessionId(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations)
