import { Avatar, Col, Space, Typography } from 'antd';

const Component = (props) => {
  return (
    <Space size={4} align="center">
      <Avatar size={20} src="photos/juliet.jpg" />
      <div style={{ marginTop: 2, fontWeight: 500 }}>Chau Nguyen</div>
    </Space>
  );
};

export default Component;
