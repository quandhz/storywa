import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';

const Chapters = () => {
  return (
    <Row justify="center">
      <Col style={{ width: 500 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          New chapter
        </Button>
      </Col>
    </Row>
  );
};

export default Chapters;
