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

  return (
    <>
      <div className="text-light">
        <h1 className="h4 mt-3">Select Your Disc Jockey</h1>
      </div>
      <Swiper
        ref={sliderRef}
        spaceBetween={20}
        slidesPerView={1}
        effect="fade"
        centeredSlides
        navigation
        loop
        modules={[EffectFade, Navigation]}
        className="mySwiper"
        onSlideChange={() => {
          djAudioGreeting.pause();
        }}
      >
        {props.djs.map((dj, idx) => (
          <SwiperSlide key={`dj-${idx}`} className="bg-dark text-light">
            <Row className="bg-dark text-light p-3">
              <Col sm={12} md={6} className="pl-5">
                <Image
                  src={dj.details?.image}
                  fluid
                  className="rounded-image"
                />
              </Col>
              <Col
                sm={12}
                md={6}
                className="pr-5 text-start bg-dark mt-2 mt-md-0"
              >
                <h2 className="h5 dj-name-container">
                  <span className="dj-name">{dj.djName}</span>
                  <div className="buttons-container">
                    <FaMicrophone
                      size={15}
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
                      className="select-button"
                      onClick={() => handleSelectDj(dj)}
                    >
                      Select
                    </button>
                  </div>
                </h2>

                <p style={{ textAlign: "justify" }}>{dj.details?.context}</p>
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
