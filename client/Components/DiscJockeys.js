import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { setCurrentDj } from "../store/djsSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Col, Row, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { MdSmartButton } from "react-icons/md";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./djsStyle.css";

import { EffectFade, Navigation } from "swiper/modules";

let djAudioGreeting = new Audio();

export function DiscJockeys(props) {
  useEffect(() => {
    return () => {
      djAudioGreeting.pause();
    };
  }, []);

  const navigate = useNavigate();
  const sliderRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);

  function handleDjAudioGreeting(dj) {
    if (
      djAudioGreeting.src !==
      (dj.details?.audio ||
        window.location.origin + "/audio/default_audio_path.mp3")
    ) {
      djAudioGreeting.src =
        dj.details?.audio || "/audio/default_audio_path.mp3";
    }

    djAudioGreeting.onplay = () => setIsPlaying(true);
    djAudioGreeting.onended = () => setIsPlaying(false);
    djAudioGreeting.onpause = () => setIsPlaying("paused");

    if (djAudioGreeting.paused) {
      if (isPlaying === "paused") {
        djAudioGreeting.play();
      } else {
        djAudioGreeting.currentTime = 0;
        djAudioGreeting.play();
      }
    } else {
      djAudioGreeting.pause();
    }
  }

  function handleSelectDj(dj) {
    props.selectDj(dj);
    navigate(props.currentStation ? `/radio/player` : `/radio/stations`);
  }

  // Inside your component
  const [imageHeight, setImageHeight] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (imageRef.current) {
        setImageHeight(imageRef.current.clientHeight);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageRef]);

  return (
    <>
      <div className="title">
        <h1>Select Your Disc Jockey</h1>
      </div>
      <Swiper
        ref={sliderRef}
        style={{ height: imageHeight }}
        spaceBetween={20}
        slidesPerView={1}
        effect="fade"
        centeredSlides
        navigation
        loop
        modules={[EffectFade, Navigation]}
        onSlideChange={() => {
          djAudioGreeting.pause();
        }}
        className="mySwiper"
      >
        {props.djs.map((dj, idx) => (
          <SwiperSlide
            key={`dj-${idx}`}
            className="bg-dark text-light swiper-slide"
            style={{ height: imageHeight }}
          >
            <Row
              style={{ height: imageHeight, display: "flex", flexWrap: "wrap" }}
            >
              <Col xs={12} md={6} style={{ height: imageHeight }}>
                <Image
                  ref={imageRef}
                  src={dj.details?.image}
                  className="rounded-image"
                />
              </Col>
              <Col
                xs={12}
                md={6}
                className="content-column"
                style={{ height: imageHeight }}
              >
                <Row className="content-row-header">
                  <Col className="dj-name-container">
                    <span className="dj-name">{dj.djName}</span>
                  </Col>
                  <Col className="buttons-container">
                    <FaMicrophone
                      className={`microphone-icon ${
                        isPlaying === true
                          ? "playing"
                          : isPlaying === "paused"
                          ? "paused"
                          : ""
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
                  <p className="content">{dj.details?.context}</p>
                </Row>
              </Col>
            </Row>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    djs: state.djs.allDjs,
    currentStation: state.stations.currentStation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentDj: (dj) => dispatch(setCurrentDj(dj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscJockeys);
