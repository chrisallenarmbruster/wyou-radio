import React from "react"
import Modal from "react-bootstrap/Modal"
import { connect } from "react-redux"
import { showProfile, hideProfile, clearUser } from "../store/userSlice"
import { Formik, Field, ErrorMessage } from "formik"
import Form from "react-bootstrap/Form"
import * as Yup from "yup"
import { updateProfile } from "../store/userSlice"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const UserProfile = (props) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("First Name is required"),
    zip: Yup.string()
      .matches(/^[0-9]{5}$/, "Zip Code must be a 5-digit number")
      .required("Zip Code is required"),
  })

  const onSubmit = (values) => {
    props.updateProfile(values)
  }

  return (
    <>
      <Modal
        show={props.modal}
        onHide={props.hideProfile}
        backdrop="static"
        keyboard={false}
        className="bg-dark text-light "
      >
        <div className="border border-secondary">
          <Modal.Header className="bg-primary text-light border border-primary">
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              zip: props.profile?.zip || "",
              name: props.profile?.name || "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              isSubmitting,
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form
                noValidate
                onSubmit={handleSubmit}
                className="bg-dark text-light mb-0"
              >
                <Modal.Body className="bg-dark text-light">
                  <Form.Group controlId="name" className="mb-3">
                    <div className="mb-3">
                      These fields are required to personalize your experience.
                    </div>
                    <Form.Label>First Name</Form.Label>

                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter first name"
                      value={values.name || ""}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                      isInvalid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="zip" className="mb-3">
                    <Form.Label>Zip Code</Form.Label>

                    <Form.Control
                      type="text"
                      name="zip"
                      placeholder="Enter zip code"
                      value={values.zip || ""}
                      onChange={handleChange}
                      isValid={touched.zip && !errors.zip}
                      isInvalid={touched.zip && !!errors.zip}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zip}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer className="bg-dark text-light">
                  {props.profile?.zip && props.profile?.name ? (
                    <Button
                      variant="secondary"
                      onClick={() => props.hideProfile()}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <a href="/">
                      <Button
                        variant="secondary"
                        onClick={() => props.logout()}
                      >
                        Log Out
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    title="Submit Product"
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  modal: state.user?.showProfile,
  profile: state.user?.profile,
})

const mapDispatchToProps = (dispatch) => ({
  showProfile: () => dispatch(showProfile()),
  hideProfile: () => dispatch(hideProfile()),
  updateProfile: (profile) => dispatch(updateProfile(profile)),
  logout: () => clearUser(),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
