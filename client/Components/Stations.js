import React, { useRef } from 'react'
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
  // Centered loop mode at the widest breakpoint needs five visible slots
  // (Swiper rounds four up to an odd number) plus three buffered slides.
  const canLoop = stations.length >= 8
  const handleMouseScroll = (e) => {
    const swiper = sliderRef.current?.swiper
    if (!swiper || swiper.destroyed) return

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
          {stations.length === 0 ? (
            <div>No stations available</div>
          ) : (
          <Swiper
            key={canLoop ? 'loop' : 'rewind'}
            ref={sliderRef}
            className="mySwiper2"
            modules={[EffectCoverflow, Pagination]}
            effect={'coverflow'}
            autoHeight={true}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            speed={600}
            coverflowEffect={{
              rotate: 20, //50
              stretch: -10, //-75
              depth: 300, //300
              modifier: 1.5, //1
              slideShadows: true,
            }}
            loop={canLoop}
            rewind={!canLoop}
            pagination={{
              type: 'bullets',
              clickable: true,
            }}
            breakpoints={{
              337: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: Math.min(3, stations.length),
              },
              977: {
                slidesPerView: Math.min(4, stations.length),
              },
            }}
          >
            {stations.map((station) => (
                <SwiperSlide key={station.id}>
                  <button
                    type="button"
                    className="station-select"
                    aria-label={`Play ${station.name}`}
                    onClick={() => {
                      clearCurrentTrack()
                      setCurrentStation(station)
                      setJamSessionId()
                      playContext({ uri: station.uri })
                      navigate('/radio/player')
                    }}
                  >
                    {station.images?.[0]?.url ? (
                      <img src={station.images[0].url} alt={station.name} draggable={false} />
                    ) : (
                      <span>{station.name}</span>
                    )}
                  </button>
                </SwiperSlide>
              ))}
          </Swiper>
          )}
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
