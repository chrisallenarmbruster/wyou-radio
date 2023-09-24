import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'

const Player = (props) => {
  const image1Ref = useRef(null)
  const image2Ref = useRef(null)

  useEffect(() => {
    // When component mounts, set the height of the second image to be the same as the first image
    if (image1Ref.current && image2Ref.current) {
      const height1 = image1Ref.current.clientHeight
      image2Ref.current.style.maxHeight = `${height1}px`
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <Col>
      <Row className="text-light title">
        <h1 className="h3 mt-3">Now Playing</h1>
      </Row>
      <Row
        className="g-5 bg-dark text-light"
        style={{
          overflow: 'hidden',
          objectFit: 'contain',
          justifyContent: 'center',
        }}
      >
        <Col sm={12} md={6} className="px-5">
          <Row>
            <Image
              src={props.dj.details?.image}
              style={{
                maxHeight: '500px',
                maxWidth: '100%',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <h4 className="h5 mt-2 mb-0">DJ {props.dj?.djName}</h4>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <p>{props.station?.name}</p>
          </Row>
        </Col>
        <Col sm={12} md={6} className="px-5">
          <Row>
            <Image
              src={props.track?.image}
              style={{
                maxHeight: '500px',
                maxWidth: '100%',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <h4 className="h5 mt-2 mb-0">{props.track?.name}</h4>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <p>
              {props.track?.artists.map((artist) => artist.name).join(', ')}
            </p>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}

const mapStateToProps = (state) => {
  return {
    track: state.player.currentTrack,
    station: state.stations.currentStation,
    dj: state.djs.currentDj,
  }
}

export default connect(mapStateToProps)(Player)
