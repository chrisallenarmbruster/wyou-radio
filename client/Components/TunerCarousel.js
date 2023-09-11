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
        // for stacked cards effect, try {rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows : true}
        // for rotating cards effect, try {rotate: 50, stretch: -75, depth: 300, modifier: 1, slideShadows : true}
        coverflowEffect={{
          rotate: 0, //50
          stretch: 0, //-75
          depth: 100, //300
          modifier: 2.5, //1
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
