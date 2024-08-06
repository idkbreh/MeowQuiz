import React, { useState, useEffect } from 'react';
import { Button, Modal, message, Space, Typography, Card, Row, Col, Spin } from 'antd';
import { DollarCircleTwoTone, ArrowUpOutlined, ArrowDownOutlined, ThunderboltTwoTone } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Title, Text } = Typography;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const SpinningIcon = styled.div`
  animation: ${spin} 2s linear infinite;
  font-size: 24px;
`;

const StyledCard = styled(Card)`
  background: linear-gradient(45deg, white, white);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
`;

const AnimatedButton = styled(Button)`
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #9370DB, #E6E6FA);
  border: none;
  color: #4B0082;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(75,0,130,0.2);
    background: linear-gradient(45deg, #8A2BE2, #D8BFD8);
  }
`;

const BouncingText = styled(Text)`
  display: inline-block;
  animation: ${bounce} 1s ease infinite;
  color: #4B0082;
`;

const GamblingGame = ({ score, onScoreChange, onClose }) => {
  const [gameType, setGameType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const games = ['headTail', 'highLow', 'slotMachine'];
    setGameType(games[Math.floor(Math.random() * games.length)]);
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  const playGame = (gameFunction, ...args) => {
    if (hasPlayed) return;
    setHasPlayed(true);
    setIsSpinning(true);
    gameFunction(...args);
  };

  const playHeadTail = (choice) => {
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'head' : 'tail';
      if (choice === result) {
        onScoreChange(score * 2);
        setResult('You won! Your score is doubled.');
        message.success('Congratulations! You won!');
      } else {
        onScoreChange(score - 100);
        setResult('You lost. 100 points deducted from your score.');
        message.error('Oops! You lost.');
      }
      setIsSpinning(false);
    }, 2000);
  };

  const playHighLow = (choice) => {
    setTimeout(() => {
      const number = Math.floor(Math.random() * 100) + 1;
      const result = number > 50 ? 'high' : 'low';
      setResult(`The number was ${number}.`);
      if (choice === result) {
        onScoreChange(score * 2);
        setResult((prev) => `${prev} You won! Your score is doubled.`);
        message.success('Congratulations! You won!');
      } else {
        onScoreChange(score - 100);
        setResult((prev) => `${prev} You lost. 100 points deducted from your score.`);
        message.error('Oops! You lost.');
      }
      setIsSpinning(false);
    }, 2000);
  };

  const playSlotMachine = () => {
    setTimeout(() => {
      const symbols = ['🍒', '🍋', '🍇', '7️⃣'];
      const result = Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      setResult(`Result: ${result.join(' ')}`);
      if (result[0] === result[1] && result[1] === result[2]) {
        onScoreChange(score * 3);
        setResult((prev) => `${prev} You got 3 matching symbols! Your score is tripled.`);
        message.success('Jackpot! You got 3 matching symbols!');
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        onScoreChange(score * 2);
        setResult((prev) => `${prev} You got 2 matching symbols! Your score is doubled.`);
        message.success('Nice! You got 2 matching symbols!');
      } else {
        onScoreChange(score - 100);
        setResult((prev) => `${prev} No matches. 100 points deducted from your score.`);
        message.error('No matches. Better luck next time!');
      }
      setIsSpinning(false);
    }, 2000);
  };

  const renderGame = () => {
    switch (gameType) {
      case 'headTail':
        return (
          <Row gutter={16}>
            <Col span={12}>
              <AnimatedButton onClick={() => playGame(playHeadTail, 'head')} icon={<DollarCircleTwoTone twoToneColor="#FFD700" />} size="large" block disabled={hasPlayed || isSpinning}>
                Head
              </AnimatedButton>
            </Col>
            <Col span={12}>
              <AnimatedButton onClick={() => playGame(playHeadTail, 'tail')} icon={<DollarCircleTwoTone twoToneColor="#C0C0C0" />} size="large" block disabled={hasPlayed || isSpinning}>
                Tail
              </AnimatedButton>
            </Col>
          </Row>
        );
      case 'highLow':
        return (
          <Row gutter={16}>
            <Col span={12}>
              <AnimatedButton onClick={() => playGame(playHighLow, 'high')} icon={<ArrowUpOutlined />} size="large" block disabled={hasPlayed || isSpinning}>
                High
              </AnimatedButton>
            </Col>
            <Col span={12}>
              <AnimatedButton onClick={() => playGame(playHighLow, 'low')} icon={<ArrowDownOutlined />} size="large" block disabled={hasPlayed || isSpinning}>
                Low
              </AnimatedButton>
            </Col>
          </Row>
        );
      case 'slotMachine':
        return (
          <AnimatedButton onClick={() => playGame(playSlotMachine)} icon={<ThunderboltTwoTone twoToneColor="#FFD700" />} size="large" block disabled={hasPlayed || isSpinning}>
            Spin
          </AnimatedButton>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={<BouncingText strong>Gambling Game</BouncingText>}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={400}
      closable={!isSpinning}
      maskClosable={!isSpinning}
    >
      <StyledCard>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={4} style={{ textAlign: 'center', color: 'purple' }}>
            {gameType === 'headTail' && 'Guess: Head or Tail?'}
            {gameType === 'highLow' && 'Guess: High or Low?'}
            {gameType === 'slotMachine' && 'Slot Machine'}
          </Title>
          {isSpinning ? (
            <div style={{ textAlign: 'center' }}>
              <SpinningIcon>
                <ThunderboltTwoTone twoToneColor="#FFD700" spin />
              </SpinningIcon>
              <Text strong style={{ marginLeft: 10 }}>Spinning...</Text>
            </div>
          ) : (
            renderGame()
          )}
          {result && (
            <Text strong style={{ textAlign: 'center', display: 'block' }}>
              {result}
            </Text>
          )}
        </Space>
      </StyledCard>
    </Modal>
  );
};

export default GamblingGame;