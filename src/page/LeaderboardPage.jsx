import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Spin, Button } from 'antd';
import { TrophyOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://bio-ontop.vercel.app/api/rank');
      setResults(response.data);
    } catch (error) {
      message.error('Failed to fetch leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const intervalId = setInterval(fetchResults, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (_, __, index) => {
        if (index + 1 === 1) return <TrophyOutlined style={{ fontSize: '24px', color: 'gold' }} />;
        if (index + 1 === 2) return <TrophyOutlined style={{ fontSize: '22px', color: 'silver' }} />;
        if (index + 1 === 3) return <TrophyOutlined style={{ fontSize: '20px', color: '#CD7F32' }} />;
        return index + 1;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => `${time}s`,
      sorter: (a, b) => a.time - b.time,
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>Leaderboard</Title>
        <Button
          icon={<SyncOutlined spin={loading} />}
          onClick={fetchResults}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      
      <Table
        dataSource={results}
        columns={columns}
        rowKey="name"
        pagination={false}
        loading={{
          indicator: <Spin size="large" />,
          spinning: loading,
        }}
        locale={{
          emptyText: 'No one here yet',
        }}
      />
    </div>
  );
};

export default Leaderboard;