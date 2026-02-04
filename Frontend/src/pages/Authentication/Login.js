import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Form,
  Alert,
  Input,
  FormFeedback,
} from "reactstrap";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from "components/Common/withRouter";
import { useUser } from "Authenticator/Usercontext";

const Login = () => {
  document.title = "Login | VerbalEdge";
  const navigate = useNavigate();
  const { login } = useUser();
  const [error, seterror] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      const result = await login(values);
      if (result.ok) {
        navigate("/dashboard");
      } else {
        seterror(result.message);
      }
      setSubmitting(false);
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
                  <div className="auth-title">Welcome back</div>
                  <div className="auth-subtitle">
                    Sign in to continue your speaking journey.
                  </div>
                  <Form
                    className="form-horizontal mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {error ? <Alert color="danger">{error}</Alert> : null}
                    <div className="mb-3">
                      <Label htmlFor="username">Email</Label>
                      <Input
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
                      <Label htmlFor="userpassword">Password</Label>
                      <Input
                        name="password"
                        value={validation.values.password || ""}
                        type="password"
                        placeholder="Enter Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
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
                    <Row className="mb-3 mt-4">
                      <div className="col-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="customControlInline"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="customControlInline"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-6 text-end">
                        <button
                          className="btn btn-primary w-md waves-effect waves-light"
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Signing in..." : "Log In"}
                        </button>
                      </div>
                    </Row>
                    <Row className="form-group mb-0">
                      <Link to="/forgot-password" className="text-muted">
                        <i className="mdi mdi-lock"></i> Forgot your password?
                      </Link>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
              <div className="auth-footer">
                <p>
                  Don't have an account ?{" "}
                  <Link to="/register" className="text-primary">
                    Signup Now
                  </Link>
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

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
