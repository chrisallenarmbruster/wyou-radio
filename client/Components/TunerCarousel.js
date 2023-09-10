import React, { useRef, useState } from "react"
import { connect } from "react-redux"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"

import "./styles.css"

// import required modules
import { EffectCoverflow, Navigation } from "swiper/modules"

export function TunerCarousel(props) {
  const { stations, playContext } = props

  return (
    <div className="swiper">
      <Swiper
        effect={"coverflow"}
        autoHeight={true}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        loop={true}
        navigation
        modules={[EffectCoverflow, Navigation]}
        className="mySwiper"
        onSlideChange={(swiperCore) => {
          const { activeIndex, snapIndex, previousIndex, realIndex } =
            swiperCore
          console.log({ activeIndex, snapIndex, previousIndex, realIndex })
        }}
      >
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        {stations.length &&
          stations.map((station) => {
            return (
              <SwiperSlide key={station.id}>
                <img
                  src={station.images[0].url}
                  onClick={() => playContext({ uri: station.uri })}
                />
              </SwiperSlide>
            )
          })}
      </Swiper>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    stations: state.tuner.stations,
  }
}

export default connect(mapStateToProps)(TunerCarousel)
