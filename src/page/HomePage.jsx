import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Spin, Row, Col, Card, message } from 'antd';
import { UserOutlined, RightOutlined, TrophyOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const HomePage = () => {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://bio-ontop.vercel.app/api/quiz?subject=superbio')
      .then(response => {
        const uniqueSubjects = [...new Set(response.data.map(q => q.subject))];
        setSubjects(uniqueSubjects);
        setLoading(false);
      })
      .catch(error => {
        message.error('Failed to load subjects. Please try again later.');
        setLoading(false);
      });
  }, []);

  const selectSubject = (subject) => {
    if (name.length >= 5) {
      navigate(`/quiz/${subject}`, { state: { name } });
    } else {
      message.warning('Please enter a name with at least 5 characters.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
      <Title level={1} style={{ textAlign: 'center', fontFamily: 'Kanit', marginBottom: '40px' }}>
        <TrophyOutlined style={{ marginRight: '10px', color: '#ffd700' }} />
        MeowMeow QUIZ
      </Title>

      <Card style={{ marginBottom: '40px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Input
          size="large"
          placeholder="Enter your name"
          prefix={<UserOutlined />}
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        {name.length < 5 && (
          <Text type="danger" style={{ display: 'block' }}>
            Name must be at least 5 characters long.
          </Text>
        )}
      </Card>

      <Title level={3} style={{ textAlign: 'center', fontFamily: 'Kanit', marginBottom: '20px' }}>
        Select a Subject to Start
      </Title>

      <Row gutter={[16, 16]}>
        {subjects.map(subject => (
          <Col xs={24} sm={12} md={8} key={subject}>
            <Card
              hoverable
              style={{ 
                cursor: name.length >= 5 ? 'pointer' : 'not-allowed',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              onClick={() => selectSubject(subject)}
            >
              <Title level={4}>{subject}</Title>
              <Button 
                type="primary" 
                shape="circle" 
                icon={<RightOutlined />} 
                size="large"
                disabled={name.length < 5}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;