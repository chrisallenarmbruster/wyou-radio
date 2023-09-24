import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { connect } from 'react-redux'

export function Home(props) {
  return (
    <>
      <Container
        className="text-light text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '75vh' }}
      >
        <h1 className="mb-3">Caution: Extremely Awesome</h1>
        {props.user && props.djs?.length > 0 && props.stations?.length > 0 ? (
          <Link to="/radio/djs">
            <Button variant="success" className="btn-lg">
              I'm Ready
            </Button>
          </Link>
        ) : (
          <Button className="btn-lg invisible disabled">Loading</Button>
        )}
      </Container>
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.profile,
  djs: state.djs.allDjs,
  stations: state.stations.allStations,
})

export default connect(mapStateToProps)(Home)
