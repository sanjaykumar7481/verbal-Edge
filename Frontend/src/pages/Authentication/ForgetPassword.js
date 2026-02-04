import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import withRouter from "components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import api from "../../services/api";

const ForgetPasswordPage = () => {
  document.title = "Forget Password";

  const [error, seterror] = useState(null);
  const [passwordChangedmsg, setpasswordChangedmsg] = useState(null);
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
      try {
        setSubmitting(true);
        const response = await api.post("/auth/ForgetPassword", values);
        const passwordChanged = response.data.passwordChanged;
        if (!passwordChanged) {
          seterror(response.data.message);
          setpasswordChangedmsg(null);
        } else {
          seterror(null);
          setpasswordChangedmsg(response.data.message);
        }
      } catch (err) {
        console.log(err);
        seterror("Something went wrong. Please try again.");
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
                  <div className="auth-title">Reset your password</div>
                  <div className="auth-subtitle">
                    Enter your email and a new password to continue.
                  </div>

                  {error ? (
                    <Alert color="danger" style={{ marginTop: "13px" }}>
                      {error}
                    </Alert>
                  ) : null}
                  {passwordChangedmsg ? (
                    <Alert color="success" style={{ marginTop: "13px" }}>
                      {passwordChangedmsg}
                    </Alert>
                  ) : null}

                  <form
                    className="form-horizontal mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label htmlFor="useremail">Email</Label>
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
                      <Label htmlFor="userpassword">New Password</Label>
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
                    <Row className="mb-3">
                      <div className="col-12 text-end">
                        <button
                          className="btn btn-primary w-md waves-effect waves-light"
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Updating..." : "Reset"}
                        </button>
                      </div>
                    </Row>
                  </form>
                </CardBody>
              </Card>
              <div className="auth-footer">
                <p>
                  Remember it ?{" "}
                  <Link to="/login" className="text-primary">
                    Sign in here
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
