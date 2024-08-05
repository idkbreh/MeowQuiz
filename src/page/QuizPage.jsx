// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Radio, Spin, Typography, Alert, Progress, message, Tag, Space, Statistic } from 'antd';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TrophyOutlined } from '@ant-design/icons';

const { Title } = Typography;
const maxQuestions = 30;
const timePerQuestion = 15;

const QuizPage = () => {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [smoothTimeLeft, setSmoothTimeLeft] = useState(timePerQuestion * 10); // 10 times more granular
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [animateChoices, setAnimateChoices] = useState('');
  const navigate = useNavigate();
  const { subject } = useParams();
  const location = useLocation();
  const { name } = location.state || { name: '' };

  useEffect(() => {
    axios.get(`https://bio-ontop.vercel.app/api/quiz?subject=${subject}&numQuestions=${maxQuestions}`)
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
        resetTimer();
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [subject]);

  useEffect(() => {
    if (smoothTimeLeft > 0) {
      const timer = setTimeout(() => setSmoothTimeLeft(smoothTimeLeft - 1), 100); // Update every 0.1 second
      return () => clearTimeout(timer);
    } else {
      handleTimeUp();
    }
  }, [smoothTimeLeft]);

  useEffect(() => {
    if (currentQuestionIndex >= 5 && currentQuestionIndex <= 10) {
      const randomEffect = Math.random();
      if (randomEffect > 0.5) {
        setAnimateChoices('choice-move');
      } else {
        setAnimateChoices('choice-spin');
      }
      setTimeout(() => setAnimateChoices(''), 2000);
    }
  }, [currentQuestionIndex]);

  const resetTimer = () => {
    setSmoothTimeLeft(timePerQuestion * 10);
  };

  const handleAnswerChange = e => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setScore(score + 1);
      setIsQuizCompleted(true);
      return;
    }

    if (questions[currentQuestionIndex].answer === selectedAnswer) {
      setScore(prevScore => prevScore + (smoothTimeLeft / 10 * 3));
    }
    setShowAnswer(true);
    setTimeout(async () => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        resetTimer();
      } else {
        setIsQuizCompleted(true);
        try {
          await axios.post('https://bio-ontop.vercel.app/api/rank', { name, score, time: timePerQuestion * maxQuestions - (currentQuestionIndex * timePerQuestion + smoothTimeLeft / 10) });
          message.success('Your score has been saved!');
        } catch (error) {
          message.error('Failed to save your score.');
        }
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        resetTimer();
      } else {
        setIsQuizCompleted(true);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isQuizCompleted) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
        <Card>
          <Title level={2}>Quiz Completed</Title>
          <p>{name}, your score is: {score}</p>
          <Button type="primary" onClick={() => navigate('/start')} style={{ width: '100%', marginTop: '16px' }}>
            Go back
          </Button>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>No questions available for the selected subject.</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Card
        title={<Title level={2}>Meow</Title>}
        extra={<Tag color="blue">{subject}</Tag>}
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Progress 
            percent={(currentQuestionIndex / questions.length) * 100} 
            format={() => `${currentQuestionIndex + 1}/${questions.length}`}
            status="active"
          />
          
          <Typography.Title level={4}>{questions[currentQuestionIndex].question}</Typography.Title>
          
          <Progress 
            percent={(smoothTimeLeft / (timePerQuestion * 10)) * 100} 
            status="active"
            strokeColor={{
                from: '#108ee9',
                to: '#87d068',
            }}
            showInfo={false}
          />
                        
          <Radio.Group 
            onChange={handleAnswerChange} 
            value={selectedAnswer} 
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {[0, 1, 2, 3].map((choice) => (
                <Radio.Button
                  key={choice}
                  value={choice}
                  className={animateChoices}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: '10px',
                    backgroundColor: showAnswer && questions[currentQuestionIndex].answer === choice ? '#52c41a' : '',
                    color: showAnswer && questions[currentQuestionIndex].answer === choice ? 'white' : '',
                  }}
                >
                  {questions[currentQuestionIndex][`choice${choice + 1}`]}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
  
          {showAnswer && selectedAnswer !== null && selectedAnswer !== questions[currentQuestionIndex].answer && (
            <Alert
              message="Incorrect!"
              description={`The correct answer is: ${questions[currentQuestionIndex][`choice${questions[currentQuestionIndex].answer + 1}`]}`}
              type="error"
              showIcon
            />
          )}
  
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            disabled={selectedAnswer === null} 
            size="large"
            block
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
  
          <Statistic title="Score" value={score} prefix={<TrophyOutlined />} />
        </Space>
      </Card>
    </div>
  );
};

export default QuizPage;
