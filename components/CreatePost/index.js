import {
  Button,
  DatePicker,
  Form,
  Input,
  TimePicker,
  Typography,
  Timeline,
  message,
  Space,
  Grid,
  Col,
  Row,
  Avatar,
} from 'antd';
import {
  DeleteOutlined,
  WarningOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import UploadFiles from '../../components/UploadFiles';
import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import useSWR, { trigger } from 'swr';
import { useUser } from '../../utils/auth/useUser';
import Photo from '../../components/Photo';

const db = firebase.firestore();

const ALL_POSTS = 'allPosts';

export default function CreatePost() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    return db.collection('posts').orderBy('date').onSnapshot((snapshot) => {
      console.log('snapshot', snapshot);

      let arr = [];

      snapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });

      return setPosts(arr);
    });
  }, []);

  const data = posts;

  // const { data, isValidating } = useSWR(ALL_POSTS, async () =>
  //   db
  //     .collection('posts')
  //     .get()
  //     .then((querySnapshot) => {
  //       let arr = [];
  //
  //       querySnapshot.forEach((doc) => {
  //         arr.push({ id: doc.id, ...doc.data() });
  //       });
  //
  //       return arr;
  //     }),
  // );

  if (!user || !data) return null;

  const deletePost = async (id) => {
    console.log('deletePost id', id);

    await db
      .collection('posts')
      .doc(id)
      .delete()
      .then(function () {
        console.log('Document successfully deleted!');
        // trigger(ALL_POSTS);
      })
      .catch(function (error) {
        console.error('Error removing document: ', error);
      });
  };
  const onFinish = async ({ date, time, ...values }) => {
    const newPost = {
      ...values,
      createdBy: {
        uid: user.id,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
      createdAt: Date.now(),
    };

    console.log('newPost', newPost);

    if (date) {
      newPost.date = date.toISOString();
    }
    if (time) {
      newPost.time = time.toISOString();
    }

    const post = await db.collection('posts');

    return post.add(newPost).then(function (docRef) {
      message.success('Post created successfully');
      // trigger(ALL_POSTS);
    });
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  return (
    <div style={{ width: 700, margin: '0 auto', padding: 16 }}>
      <Form {...layout} name="story" onFinish={onFinish}>
        <Form.Item>Add new Story</Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input your story name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Body" name="body">
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
        </Form.Item>

        <Form.Item label="Date & time">
          <Input.Group compact>
            <Form.Item
              name="date"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Please input date!',
                },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="time" noStyle>
              <TimePicker format="h:mm a" minuteStep={15} use12Hours />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create post
          </Button>
        </Form.Item>
      </Form>
      <hr />
      <Row>
        <Col flex={1}>Count: {data && data.length}</Col>
      </Row>
      <hr />
      <Timeline>
        {data.map((post) => {
          const dateFormat =
            post.date && moment(post.date).local().format("ddd D MMM [']YY");

          return (
            <Timeline.Item key={post.id}>
              <div key={post.id}>
                {post.createdBy && (
                  <Space>
                    <Avatar src={post.createdBy.photoURL} />
                    <div>{post.createdBy.displayName}</div>
                  </Space>
                )}
                <br />
                <Typography.Title level={5}>{post.title}</Typography.Title>
                {post.body && (
                  <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: true, symbol: 'more' }}
                  >
                    {post.body}
                  </Typography.Paragraph>
                )}
                <Space>
                  {post.date && (
                    <Typography.Text type="secondary">
                      {moment(post.date).local().format("ddd D MMM [']YY")}
                    </Typography.Text>
                  )}
                  {post.time && (
                    <Typography.Text type="danger">
                      {moment(post.time).local().format('h:mm a')}
                    </Typography.Text>
                  )}
                </Space>
                <br />
                {post.files && post.files.length > 0 && (
                  <span>Files ({post.files && post.files.length})</span>
                )}
                <br />
                <Space>
                  {post.files &&
                    post.files.map((fileName) => {
                      return (
                        <Photo
                          key={fileName}
                          postId={post.id}
                          fileName={fileName}
                        />
                      );
                    })}
                </Space>
                <br />
                <br />
                <UploadFiles postId={post.id} />
                <br />
                <Button danger onClick={() => deletePost(post.id)}>
                  Delete
                </Button>
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
}
