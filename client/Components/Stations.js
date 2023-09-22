import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { setCurrentStation } from "../store/stationsSlice";
import { clearCurrentTrack } from "../store/playerSlice";
import { useNavigate } from "react-router-dom";
import { Pagination, Scrollbar, A11y } from "swiper/modules";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import "./stationsStyle.css";

// import required modules
import { EffectCoverflow, Navigation } from "swiper/modules";

export function Stations(props) {
  const {
    stations,
    playContext,
    setCurrentStation,
    pauseSpotify,
    clearCurrentTrack,
  } = props;

  useEffect(() => {
    setTimeout(() => {
      // sliderRef.current.swiper.slideTo(1)
    }, 100);
  }, []);

  const navigate = useNavigate();

  const sliderRef = useRef();
  const handleMouseScroll = (e) => {
    const swiper = sliderRef.current.swiper;

    if (e.deltaX > 0 || e.deltaY > 0) {
      swiper.slideNext();
    } else if (e.deltaX < 0 || e.deltaY < 0) {
      swiper.slidePrev();
    }
  };

  return (
    <Container style={{ display: "flex", maxWidth: "100vw" }}>
      <Col>
        <Row>
          <div className="text-light">
            <h1 className="h3 mt-3">Select Your Music</h1>
          </div>
        </Row>
        <Row>
          <div onWheel={handleMouseScroll}>
            <Swiper
              style={{ display: "flex", maxWidth: "100vw" }}
              ref={sliderRef}
              effect={"coverflow"}
              autoHeight={true}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              speed={600}
              // freeMode={true}
              // mousewheel={{ releaseOnEdges: true }}
              // for stacked cards effect, try {rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows : true}
              // for rotating cards effect, try {rotate: 50, stretch: -75, depth: 300, modifier: 1, slideShadows : true}
              coverflowEffect={{
                rotate: 20, //50
                stretch: -10, //-75
                depth: 200, //300
                modifier: 1.5, //1
                slideShadows: true,
              }}
              loop={true}
              loopedSlides={2}
              navigation
              modules={[EffectCoverflow, Navigation, Scrollbar]}
              scrollbar={{ draggable: true }}
              className="mySwiper"
              onSlideChange={(swiperCore) => {
                const { activeIndex, snapIndex, previousIndex, realIndex } =
                  swiperCore;
                console.log({
                  activeIndex,
                  snapIndex,
                  previousIndex,
                  realIndex,
                });
              }}
            >
              {/* <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide> */}
              {stations.length &&
                stations.map((station) => {
                  return (
                    <SwiperSlide key={station.id}>
                      <img
                        src={station.images[0].url}
                        onClick={() => {
                          // pauseSpotify()
                          clearCurrentTrack();
                          setCurrentStation(station);
                          playContext({ uri: station.uri });
                          navigate("/radio/player");
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </Row>
      </Col>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    stations: state.stations.allStations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentStation: (station) => dispatch(setCurrentStation(station)),
    clearCurrentTrack: () => dispatch(clearCurrentTrack()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
