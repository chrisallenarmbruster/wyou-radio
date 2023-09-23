import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'

import { setCurrentStation } from '../store/stationsSlice'
import { clearCurrentTrack } from '../store/playerSlice'
import { useNavigate } from 'react-router-dom'
import { Container, Col, Row, Image, Button } from 'react-bootstrap'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import './stationsStyle.css'
import 'swiper/swiper-bundle.css'

// SwiperCore.use([EffectCoverflow, Pagination])

export function Stations(props) {
  const {
    stations,
    playContext,
    setCurrentStation,
    pauseSpotify,
    clearCurrentTrack,
  } = props

  const [swiperHeight, setSwiperHeight] = useState(400)
  const wrapperRef = useRef()

  useEffect(() => {
    setTimeout(() => {
      // sliderRef.current.swiper.slideTo(1)
    }, 100)
  }, [])

  // useEffect(() => {
  //   // Calculate the height of the wrapper div and set it to state
  //   if (wrapperRef.current) {
  //     setSwiperHeight(wrapperRef.current.clientHeight)
  //   }
  // }, [])

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
    <Col>
      <Row className="text-light title">
        <h1 className="h3 mt-3">Select Your Music</h1>
      </Row>
      <Row
      // style={{
      //   maxHeight: '400px',
      //   maxWidth: '100%',
      //   width: '100%',
      //   objectFit: 'contain',
      // }}
      >
        <Col
          onWheel={handleMouseScroll}
          style={{
            overflow: 'hidden',
            maxHeight: '550px',
            objectFit: 'contain',
            justifyContent: 'center',
          }}
        >
          <Row style={{ maxHeight: ' 400px' }}>
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
              // scrollbar={{ draggable: true }}
              // onSlideChange={(swiperCore) => {
              //   const { activeIndex, snapIndex, previousIndex, realIndex } =
              //     swiperCore
              //   console.log({
              //     activeIndex,
              //     snapIndex,
              //     previousIndex,
              //     realIndex,
              //   })
              // }}
              style={{ maxHeight: '400px' }}
            >
              {/* <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide> */}
              {stations.length > 0 ? (
                stations.map((station) => (
                  <SwiperSlide key={station.id}>
                    <img
                      src={station.images[0].url}
                      onClick={() => {
                        // pauseSpotify()
                        clearCurrentTrack()
                        setCurrentStation(station)
                        playContext({ uri: station.uri })
                        navigate('/radio/player')
                      }}
                      style={{
                        maxHeight: '400px',
                        maxWidth: '400px',
                      }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <div>No stations available</div>
              )}
            </Swiper>
          </Row>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations)
