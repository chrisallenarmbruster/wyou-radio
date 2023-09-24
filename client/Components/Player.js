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
    const updateImageHeight = () => {
      if (image1Ref.current && image2Ref.current) {
        const height1 = image1Ref.current.clientHeight
        image2Ref.current.style.height = `${height1}px`
        image2Ref.current.style.minHeight = `${height1}px`
      }
    }

    updateImageHeight()

    // Add a resize event listener to the window object to update the height when the window is resized
    window.addEventListener('resize', updateImageHeight)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateImageHeight)
    }
  }, [])

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
          flex: 1,
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
                ref={image1Ref} // Attach ref to first image
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
                ref={image2Ref}
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
