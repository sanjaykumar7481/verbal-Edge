import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, Button, Spinner, Badge, Container, Row, Col, Progress } from 'reactstrap';
import Knob from 'pages/AllCharts/knob/knob';
import CollapsibleList from './Collapse-list';
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux"
import { useUser } from 'Authenticator/Usercontext';
import { useNavigate } from 'react-router-dom';
import { time } from 'echarts';
const WrittenTest = (props) => {
    const {user}=useUser();
    const navigator=useNavigate();
    const [Testcount,setTestCount]=useState({
      'userId':'',
      'TestType':''
    })
    // console.log(user);
    useEffect(() => {
      if(user)
      setTestCount({
        'userId':user._id,
        'TestType':'Written'
      })
    }, [user]);
    const [question, setQuestion] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [timer, setTimer] = useState(300); // 10 minutes in seconds
    const [testStarted, setTestStarted] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [value_cur,setvalue_cur]=useState(0);
    const [results, setResults] = useState(null);
    const breadcrumbItems = [
        { title: "SpeakEZ", link: "#" },
        { title: "Written Test", link: "#" },
        { title: "WET", link: "#" },
    ]
    useEffect(() => {
        props.setBreadcrumbItems('Written test', breadcrumbItems);
    }, [props])
    const timerStyle = {
      fontSize:'20px',
      fontWeight:'bold',
      color: timer < 150 ? 'red' : 'black' // Change to red color when less than 1 minute left
  };
    useEffect(() => {

        if (testStarted) {
            // Start the timer when the test starts
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Clear interval when timer reaches 0
            if (timer === 0) {
                // setLoadingResults(true);
                handleSubmit();
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [testStarted, timer]);
    const fetchQuestion = () => {
        axios.get('http://localhost:4000/ai/WET-random-question')
            .then(response => {
                setQuestion(response.data.question);
                console.log(response.data.question);
            })
            .catch(error => {
                console.error('Error fetching question:', error);
            });
    };

    const handleChange = event => {
        setUserResponse(event.target.value);
        // adjustTextAreaHeight(event.target);
    };

    

    const handleSubmit = () => {
        // console.log("time over",timer);
        setLoadingResults(true);
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
              setvalue_cur(i);
            }, i * 100); // Increment value every 10 milliseconds
          }
          const singleParagraphResponse = userResponse.replace(/\n/g, ' ').trim();
        axios.post(`http://localhost:4000/ai/English-Score`, { userResponse:singleParagraphResponse })
            .then(response => {
                console.log(response.data)
                setResults(response.data); // Assuming response.data contains the results you want to display
                setTestStarted(false); // Optionally reset testStarted if the test is concluded
            })
            .catch(error => {
                console.error('Error submitting response:', error);
                setLoadingResults(false); // Ensure loading state is reset on error
            });
            setLoadingResults(false)
    };

    // Format timer in minutes and seconds
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTest = () => {
        setTestStarted(true);
        fetchQuestion();
    };
    const handleChangecursor = newValue => {
        setvalue_cur(newValue)
      }
    const getWordCount = (value) => {
        if (!value) return 0;
        return value.trim().split(/\s+/).filter(Boolean).length;
    };
    const remainingPercent = Math.max(0, Math.min(100, Math.round((timer / 300) * 100)));
    const Update_test_result=async()=>{
        const response=await axios.post(`http://localhost:4000/api/TestCount`,Testcount);
        if(response.data)
        {
            navigator('/dashboard')
        }
    }
    return (
        <Container fluid className="py-3">
            {!testStarted && !loadingResults && !results && (
                <Row className="justify-content-center">
                    <Col lg="8">
                        <Card>
                            <CardBody>
                                <h4 className="mb-2">Written Test</h4>
                                <p className="text-muted mb-3">
                                    You will receive one prompt and have 5 minutes to respond. Focus on clarity, structure, and grammar.
                                </p>
                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <Badge color="info">5 minutes</Badge>
                                    <Badge color="secondary">1 prompt</Badge>
                                </div>
                                <div className="mt-4">
                                    <Button color="primary" onClick={startTest}>Start Test</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {testStarted && !loadingResults && timer && (
                question === '' ? (
                    <div className="text-center mt-4">
                        <Spinner color="primary" className='mb-2' />
                        <br />
                        <span>Loading question...</span>
                    </div>
                ) : !loadingResults &&(
                    <Row className="g-3">
                        <Col lg="8">
                            <Card className="h-100">
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h4 className="mb-1">Written Test</h4>
                                            <small className="text-muted">Draft your response below.</small>
                                        </div>
                                        <div className="text-end">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="ion ion-md-alarm" style={{fontSize:'20px', fontWeight:'bold'}}></i>
                                                <span style={timerStyle}>{formatTime()}</span>
                                            </div>
                                            <Progress className="mt-2" value={remainingPercent} style={{ height: '6px' }} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <Badge color="primary" className="me-2">Prompt</Badge>
                                        <span style={{ fontSize: '16px' }}>{question}</span>
                                    </div>
                                    <Card className="bg-light border">
                                        <CardBody>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>Response</strong>
                                                <Badge color="secondary">{getWordCount(userResponse)} words</Badge>
                                            </div>
                                            <textarea
                                                className="form-control mt-2"
                                                value={userResponse}
                                                onChange={handleChange}
                                                style={{ minHeight: '320px' }}
                                            />
                                        </CardBody>
                                    </Card>
                                    <div className="text-end mt-3">
                                        <Button color="primary" onClick={()=>{handleSubmit();setLoadingResults(true)}}>Submit</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card className="h-100">
                                <CardBody>
                                    <h6 className="mb-2">Writing Tips</h6>
                                    <ul className="mb-3">
                                        <li>Start with a clear thesis or main idea.</li>
                                        <li>Use short paragraphs for readability.</li>
                                        <li>Keep grammar and spelling clean.</li>
                                    </ul>
                                    <div className="text-muted small">Your score reflects structure, clarity, and correctness.</div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            )}

            {(timer===0 || loadingResults)  && !results && (
                <div className="overlay">
                    <div className="text-center" dir="ltr">
                        <h5 className="font-size-14 mb-3">Loading results</h5>
                        <Knob
                            value={value_cur}
                            height={200}
                            width={150}
                            fgColor="#4ac18e"
                            cursor={true}
                            displayCustom={() => {
                                return false
                            }}
                            onChange={handleChangecursor}
                        />
                    </div>
                </div>
            )}

               {results && (
                    <>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <h4 className="mb-0">Written Test Report</h4>
                                <small className="text-muted">Language quality summary and corrections</small>
                            </Col>
                            <Col className="text-end">
                                <Button color="primary" onClick={()=>{Update_test_result()}}>Save test</Button>
                            </Col>
                        </Row>
                        <Row className="g-3">
                            <Col lg="6">
                                <Card className="h-100">
                                    <CardBody>
                                        <h5 className="mb-3">Misspelled Words</h5>
                                        {results.misspelledWords.length === 0 ? (
                                            <div className="text-muted">No spelling issues found.</div>
                                        ) : (
                                            <ul className="mb-0">
                                                {results.misspelledWords.map((word, index) => (
                                                    <li key={index}><s>{word.word}</s> &nbsp;{word.suggested}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6">
                                <Card className="h-100">
                                    <CardBody>
                                        <h5 className="mb-3">Summary</h5>
                                        <ul className="mb-0">
                                            {results.summary.map((value,index)=>(
                                                <li key={index}>{value}</li>
                                            ))}
                                        </ul>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <h6 className="mb-2">Next Step</h6>
                                        <p className="text-muted mb-3">Save the test to record your progress and return to the dashboard.</p>
                                        <Button color="primary" onClick={()=>{Update_test_result()}}>Save test</Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}

                
        </Container>
            
            
        
    );
};

export default connect(null, { setBreadcrumbItems })(WrittenTest);
