import React, { useRef, useState } from "react"
import { connect } from "react-redux"
import { setCurrentDj } from "../store/djsSlice"
import { Swiper, SwiperSlide } from "swiper/react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"

import "./djsStyle.css"

import { EffectFade, Navigation, Pagination } from "swiper/modules"

export function DiscJockeys(props) {
  return (
    <>
      <div className="text-light">
        <h1 className="h3 my-3">Select Disc Jockey</h1>
      </div>
      <Swiper
        spaceBetween={30}
        autoHeight={true}
        effect={"fade"}
        grabCursor={true}
        centeredSlides={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        {props.djs.map((dj, idx) => (
          <SwiperSlide
            key={`dj-${idx}`}
            className="bg-dark text-light"
            onClick={() => props.setCurrentDj(dj)}
          >
            <Row className="g-5">
              <Col sm={12} md={6}>
                {dj.name} Photo
              </Col>
              <Col sm={12} md={6}>
                <h2 className="h3">{dj.djName}</h2>
              </Col>
            </Row>
          </SwiperSlide>
        ))}
        {/* <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide> */}
      </Swiper>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    djs: state.djs.allDjs,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentDj: (dj) => dispatch(setCurrentDj(dj)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscJockeys)
