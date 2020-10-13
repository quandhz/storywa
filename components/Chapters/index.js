import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Space,
  Col,
  Empty,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import Jayc from '../User/Jayc';
import Juliet from '../User/Juliet';
import firebase from 'firebase';
import 'firebase/firestore';
import moment from 'moment';
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
      paragraphs: [],
    };

    return STORIES.setChapter(STORY_ID, data.chapters.concat(payload)).then(
      () => {
        setFormKey(now);
        message.success('Chapter created successfully');
      },
    );
  };

  const handleAddParagraph = (chapterId) => () => {
    const now = Date.now();
    const content = prompt('Enter paragraph');

    const payload = {
      content,
      createdAt: now,
      id: now,
      files: [],
    };

    return STORIES.setChapter(
      STORY_ID,
      data.chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            paragraphs: chapter.paragraphs
              ? chapter.paragraphs.concat(payload)
              : [payload],
          };
        }

        return chapter;
      }),
    ).then(() => {
      message.success('Paragraph created successfully');
    });
  };

  const deleteParagraph = (chapterId, id) => () => {
    return STORIES.setChapter(
      STORY_ID,
      data.chapters.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;

        return {
          ...chapter,
          paragraphs: chapter.paragraphs.filter((p) => p.id !== id),
        };
      }),
    ).then(() => {
      message.success('Chapter deleted successfully');
    });
  };

  const deleteChapter = (id) => () => {
    return STORIES.setChapter(
      STORY_ID,
      data.chapters.filter((chapter) => chapter.id !== id),
    ).then(() => {
      message.success('Chapter deleted successfully');
    });
  };

  const editChapter = (id) => () => {
    console.log('editChapter', id);
    return null;
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
                  <Card
                    actions={[
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={handleAddParagraph(chapter.id)}
                      >
                        Paragraph
                      </Button>,
                      <Space>
                        <Button
                          disabled={index === chapters.length - 1}
                          type="text"
                          icon={<ArrowDownOutlined />}
                        />
                        <Button
                          disabled={index === 0}
                          type="text"
                          icon={<ArrowUpOutlined />}
                        />
                      </Space>,
                      <Button
                        type="text"
                        onClick={deleteChapter(chapter.id)}
                        icon={<DeleteOutlined />}
                      />,
                    ]}
                  >
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

                    {chapter.paragraphs &&
                      chapter.paragraphs.map((p, index) => {
                        return (
                          <>
                            {!!index && <br />}
                            <Space>
                              <Typography.Text strong>
                                {moment(p).format('D MMM YYYY')}
                              </Typography.Text>

                              <Button
                                type="link"
                                onClick={deleteParagraph(chapter.id, p.id)}
                              >
                                Delete
                              </Button>
                            </Space>
                            <br />
                            {index % 2 ? <Jayc /> : <Juliet />}
                            <br />
                            <Typography.Paragraph>
                              {p.content}
                            </Typography.Paragraph>
                          </>
                        );
                      })}
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
