import React from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'

const Player = (props) => {
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
          flex:1,
        }}
      >
        <Col
          sm={12}
          md={6}
          className="px-5 d-flex align-items-center justify-content-end"
        >
          <div style={{ textAlign: 'center' }}>
            <div>
              <Image
                src={props.dj.details?.image}
                style={{
                  // maxHeight: '500px',
                  maxWidth: '100%',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div>
              <h4 className="h5 mt-2 mb-0">DJ {props.dj?.djName}</h4>
            </div>
            <div>
              <p>{props.station?.name}</p>
            </div>
          </div>
        </Col>
        <Col sm={12} md={6} className="px-5 d-flex align-items-center">
          <div style={{ textAlign: 'center' }}>
            <div>
              <Image
                src={props.track?.image}
                style={{
                  // maxHeight: '500px',
                  maxWidth: '100%',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div>
              <h4 className="h5 mt-2 mb-0">{props.track?.name}</h4>
            </div>
            <div>
              <p>
                {props.track?.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </div>
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
