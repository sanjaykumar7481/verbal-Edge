import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useUser } from "Authenticator/Usercontext";

const Register = () => {
  document.title = "Register | VerbalEdge";

  const navigate = useNavigate();
  const { register } = useUser();
  const [registrationError, setRegistrationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const validation = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      first_name: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const response = await register(values);
        if (response.loggedin) {
          setRegistered(true);
          navigate("/login");
        } else {
          setRegistrationError(response.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setRegistrationError(
          "An error occurred during registration. Please try again later."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="auth-shell">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="auth-card">
                <CardBody className="auth-card__body">
                  <div className="auth-brand">
                    <span className="auth-brand__mark">VE</span>
                    <span className="auth-brand__text">VerbalEdge</span>
                  </div>
                  <div className="auth-title">Create your account</div>
                  <div className="auth-subtitle">
                    Start practicing and track your progress.
                  </div>
                  <Form
                    className="form-horizontal mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {registered ? (
                      <Alert color="success">Registered successfully.</Alert>
                    ) : null}

                    {registrationError ? (
                      <Alert color="danger">{registrationError}</Alert>
                    ) : null}

                    <div className="mb-3">
                      <Label htmlFor="useremail">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        name="first_name"
                        type="text"
                        placeholder="Enter username"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.first_name || ""}
                        invalid={
                          validation.touched.first_name &&
                          validation.errors.first_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.first_name &&
                      validation.errors.first_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.first_name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="userpassword">Password</Label>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password || ""}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                      />
                      {validation.touched.password &&
                      validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3 row mt-4">
                      <div className="col-12 text-end">
                        <button
                          className="btn btn-primary w-md waves-effect waves-light"
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Creating..." : "Register"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-0 row">
                      <div className="col-12 mt-4">
                        <p className="text-muted mb-0 font-size-14">
                          By registering you agree to the VerbalEdge{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <div className="auth-footer">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="text-primary">
                    Login
                  </Link>{" "}
                </p>
                (c) {new Date().getFullYear()} VerbalEdge{" "}
                <span className="d-none d-sm-inline-block"> </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
