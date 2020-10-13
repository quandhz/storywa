import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import firebase from 'firebase';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ITEMS } from '../../apis/items';
import { STORIES } from '../../apis/stories';

const STORY_ID = 'jj99';

const Chapters = () => {
  const [data, setData] = useState();
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    return STORIES.stream(STORY_ID, (snapshot) => {
      return setData(snapshot.data());
    });
  }, [STORY_ID]);

  const handleFinish = (form) => {
    const now = Date.now();

    const payload = {
      ...form,
      createdAt: now,
      lastModified: now,
      id: now,
    };

    return STORIES.setChapter(STORY_ID, data.chapters.concat(payload)).then(
      () => {
        setFormKey(now);
        message.success('Chapter created successfully');
      },
    );
  };
  const deleteChapter = (id) => () => {
    return STORIES.setChapter(
      STORY_ID,
      data.chapters.filter((chapter) => chapter.id !== id),
    ).then(() => {
      message.success('Chapter deleted successfully');
    });
  };

  if (!data)
    return (
      <Row justify="center">
        <Col style={{ width: 500 }}>
          <Card loading />
        </Col>
      </Row>
    );

  console.log('data', data);
  const { chapters } = data;

  return (
    <>
      {!chapters.length ? (
        <>
          <Row justify="center">
            <Col style={{ width: 500 }}>
              <Card>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </Card>
            </Col>
          </Row>
          <br />
        </>
      ) : (
        chapters.map((chapter, index) => {
          return (
            <>
              <Row key={chapter.id} justify="center">
                <Col style={{ width: 500 }}>
                  <Card>
                    <Typography.Text
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      CHAPTER {index + 1}
                    </Typography.Text>
                    <br />
                    <Typography.Title
                      level={4}
                      style={{ fontFamily: "'Piedra', cursive" }}
                    >
                      {chapter.name}
                    </Typography.Title>
                    <Button type="link" onClick={deleteChapter(chapter.id)}>
                      Delete
                    </Button>
                  </Card>
                </Col>
              </Row>

              <br />
            </>
          );
        })
      )}

      <Row justify="center">
        <Col style={{ width: 500 }}>
          <Card>
            <Form layout="vertical" onFinish={handleFinish} key={formKey}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Story name is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  htmlType="submit"
                >
                  New chapter
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Chapters;
