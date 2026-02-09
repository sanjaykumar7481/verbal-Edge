import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, Button, Spinner } from 'reactstrap';
import Knob from 'pages/AllCharts/knob/knob';
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useUser } from 'Authenticator/Usercontext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './vocaltest.css';
const API_BASE_URL = process.env.REACT_APP_API_URL;
const VocalTest = (props) => {
    const [userResponse, setUserResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [testStarted, setTestStarted] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [value_cur, setvalue_cur] = useState(0);
    const [results, setResults] = useState(null);
    const [mismatchCount, setMismatchCount] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const { transcript, listening, resetTranscript } = useSpeechRecognition({
        recognitionOptions: {
            continuous: true,
            interimResults: true,
            timeout: 40000,
        },
    });
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
          'TestType':'Voice'
        })
      }, [user]);
    const startTest = () => {
        setTestStarted(true);
        fetchQuestion();
    };

    const handleChangecursor = newValue => {
        setvalue_cur(newValue);
    };

    const startListeningToUser = () => {
        resetTranscript();
        SpeechRecognition.startListening(); 
    };

    const breadcrumbItems = [
        { title: "SpeakEZ", link: "#" },
        { title: "Vocal Test", link: "#" },
    ];

    useEffect(() => {
        props.setBreadcrumbItems('Vocal test', breadcrumbItems);
    }, [props]);

    const stopListeningAndHandleSubmit = () => {
        SpeechRecognition.stopListening();
        handleSubmit();
    };

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (testStarted) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            if (timer === 0) {
                clearInterval(interval);
                handleSubmit();
            }

            return () => clearInterval(interval);
        }
    }, [testStarted, timer]);

    const fetchQuestion = () => {
        axios.get(`${API_BASE_URL}/ai/Random-text`)
            .then(response => {
                setQuestion(response.data.Random_Text);
            })
            .catch(error => {
                console.error('Error fetching question:', error);
            });
    };

    const cleanAndSplit = (text) => {
        return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/); // Split by any amount of spaces
    };
    useEffect(() => {
        if (!listening) {
            setUserResponse(prev => prev + transcript);
        }
    }, [listening, transcript]);

    const handleSubmit = () => {
        setLoadingResults(true);
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
              setvalue_cur(i);
              if (i === 100) {
                setLoadingResults(false); 
                }
            }, i * 50); // Increment value every 10 milliseconds
          }
        const singleParagraphResponse = userResponse.replace(/\n/g, ' ').trim();
        console.log(singleParagraphResponse);
        axios.post(`${API_BASE_URL}/ai/Vocal-Score`, { 
            actualText: question,
            transcribedText: singleParagraphResponse })
            .then(response => {
                console.log(response.data);
                setResults(response.data)
                setTestStarted(false); // Optionally reset testStarted if the test is concluded
            })
            .catch(error => {
                console.error('Error submitting response:', error);
                setLoadingResults(false); // Ensure loading state is reset on error
            });
    };
    const Update_test_result=async()=>{
        const response=await axios.post(`${API_BASE_URL}/api/TestCount`,Testcount);
        if(response.data)
        {
            navigator('/dashboard')
        }
    }
    return (
        <div className="vocal-test">
            {!testStarted && !loadingResults && !results &&(
                <div className="vocal-test__hero">
                    <Card className="vocal-test__card">
                        <CardBody className="text-center">
                            <div className="vocal-test__title">Vocal Fluency Test</div>
                            <div className="vocal-test__subtitle">
                                Read the prompt aloud and we will analyze accuracy against the original text.
                            </div>
                            <Button color="primary" className="vocal-test__cta" onClick={startTest}>
                                Start Test
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            )}
            {testStarted && !loadingResults && (
                question === '' ? (
                    <div className="text-center mt-4">
                        <Spinner color="primary" className='mb-2' />
                        <br />
                        <span>Loading text...</span>
                    </div>
                ) : (
                    <div className="vocal-test__stage">
                        <div className="vocal-test__header">
                            <div>
                                <div className="vocal-test__eyebrow">SpeakEZ</div>
                                <h2 className="vocal-test__heading">Voice Test</h2>
                                <div className="vocal-test__help">Speak clearly and at a steady pace.</div>
                            </div>
                            <div className={`vocal-test__timer ${timer < 60 ? 'is-urgent' : ''}`}>
                                <i className="ion ion-md-alarm mr-2"></i>
                                {formatTime()}
                            </div>
                        </div>
                        <div className="vocal-test__grid">
                            <Card className="vocal-test__card">
                                <CardBody>
                                    <div className="vocal-test__label">Prompt</div>
                                    <div className="vocal-test__prompt">
                                        <ReactMarkdown>{question}</ReactMarkdown>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="vocal-test__card">
                                <CardBody>
                                    <div className="vocal-test__label">Speech Controls</div>
                                    <div className="vocal-test__controls">
                                        {!listening ? (
                                            <Button color="primary" onClick={startListeningToUser}>
                                                Start Speaking
                                            </Button>
                                        ) : (
                                            <Button color="danger" onClick={stopListeningAndHandleSubmit}>
                                                Stop and Submit
                                            </Button>
                                        )}
                                        <div className={`vocal-test__listening ${listening ? 'is-on' : ''}`}>
                                            <span className="vocal-test__dot" />
                                            {listening ? 'Listening…' : 'Not listening'}
                                        </div>
                                    </div>
                                    <div className="vocal-test__label vocal-test__label--spaced">Live Transcript</div>
                                    <textarea
                                        rows="8"
                                        className="vocal-test__textarea"
                                        value={listening ? userResponse + transcript : userResponse}
                                        readOnly
                                        placeholder="Your spoken words will appear here…"
                                    />
                                    <div className="text-center">
                                        <Button color="secondary" onClick={stopListeningAndHandleSubmit}>
                                            Submit
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                )
            )}
            {loadingResults && (
                <div className="vocal-test__overlay">
                    <div className="vocal-test__overlay-card text-center" dir="ltr">
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
            {results && value_cur === 100 && !loadingResults && (
            <div className="vocal-test__results">
                <Card className="vocal-test__card">
                    <CardBody>
                        <div className="vocal-test__label">Results</div>
                        <div className="vocal-test__score">
                            <div className="vocal-test__score-value">{results.accuracy}%</div>
                            <div className="vocal-test__score-meta">
                                Matched: {results.matchedCount} · Mismatched: {results.mismatchedCount}
                            </div>
                        </div>
                        <div className="vocal-test__label vocal-test__label--spaced">Matched Words</div>
                        <div className="vocal-test__tags">
                            {results.matchedWords.map((word, index) => (
                                <span className="vocal-test__tag vocal-test__tag--good" key={`m-${index}`}>
                                    {word}
                                </span>
                            ))}
                        </div>
                        <div className="text-center">
                            <Button color="primary" className="mt-2" onClick={() => { Update_test_result() }}>
                                Save Test
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )}
        </div>
    );
};

export default connect(null, { setBreadcrumbItems })(VocalTest);
