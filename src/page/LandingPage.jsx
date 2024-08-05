import React from 'react';
import { Typography, Button, Layout, Row, Col, Card } from 'antd';
import { RightCircleOutlined, ExperimentOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <ExperimentOutlined />, title: 'Engaging Bio Quizzes', description: 'Test your knowledge with our fun and challenging biology quizzes!' },
    { icon: <TrophyOutlined />, title: 'Compete for Top Spots', description: 'Climb the leaderboard and show off your bio expertise!' },
    { icon: <ThunderboltOutlined />, title: 'Quick and Exciting', description: 'Fast-paced quizzes that keep you on your toes!' },
  ];

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Content style={{ padding: '50px 20px' }}>
        <Row justify="center">
          <Col xs={24} md={20} lg={16}>
            <Card style={{ 
              borderRadius: '15px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              background: 'rgba(255, 255, 255, 0.9)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title style={{ fontFamily: 'Kanit', fontSize: '3rem', color: '#4a0e78' }}>
                  CrazyBioQuiz Meowmeow
                </Title>
                <Paragraph style={{ fontSize: '1.2rem', color: '#333' }}>
                  Unleash your inner biologist with our pawsome quizzes!
                </Paragraph>
              </div>

              <Row gutter={[24, 24]} justify="center">
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                      style={{ 
                        height: '100%', 
                        textAlign: 'center', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        background: 'rgba(255, 255, 255, 0.8)',
                      }}
                      cover={
                        <div style={{ fontSize: '48px', padding: '24px', color: '#4a0e78' }}>
                          {feature.icon}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={<span style={{ fontSize: '1.1rem', color: '#4a0e78' }}>{feature.title}</span>}
                        description={<span style={{ color: '#333' }}>{feature.description}</span>}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<RightCircleOutlined />}
                  onClick={() => navigate('/start')}
                  style={{ 
                    fontSize: '1.2rem', 
                    height: 'auto', 
                    padding: '10px 30px',
                    background: '#4a0e78',
                    borderColor: '#4a0e78',
                  }}
                >
                  Start Quizzing Now!
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LandingPage;