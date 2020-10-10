import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Descriptions,
  Breadcrumb,
  Dropdown,
  Menu,
  Modal,
  Button,
  Grid,
  Layout,
  Card,
  Row,
  Col,
  message,
  Space,
  Typography,
  Timeline,
  Collapse,
  Anchor,
} from 'antd';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateItem from '../../components/Item/CreateItem';
import { STORIES } from '../../apis/stories';
import styles from '../../components/Content/styles.module.css';
import PageHeader from '../../components/PageHeader';
import EditStory from '../../components/Story/EditStory';
import { FIRESTORE_HELPER } from '../../components/Timestamp';
import User from '../../components/User';
import Items from '../../components/Items';
import AllStories from '../../components/Story/AllStories';
import CreateStory from '../../components/Story/CreateStory';

const { Header, Content, Footer } = Layout;

const Story = (props) => {
  const screens = Grid.useBreakpoint();
  const [data, setData] = useState();
  const [itemsAnchor, setItemsAnchor] = useState([]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const [targetOffset, setTargetOffset] = useState(0);

  useEffect(() => {
    return (
      props.id &&
      STORIES.stream(props.id, (snapshot) => {
        return setData(snapshot.data());
      })
    );
  }, [props.id]);

  const handleMenuClick = (e) => {
    console.log('click', e);
    if (e.key === 'edit') {
      setEditing(true);
    }

    if (e.key === 'delete') {
      Modal.confirm({
        title: 'Delete this story?',
        icon: <ExclamationCircleOutlined />,
        content: data.name,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          STORIES.delete(props.id).then(() => {
            message.success('Story deleted successfully');

            router.push('/stories');
          });
        },
      });
    }
  };

  return (
    <div>
      <Head>
        <title>
          {data ? `${data.name} - ${data.createdBy.name}` : 'Story'}
        </title>
      </Head>
      <Layout style={{ background: 'white' }}>
        <PageHeader />

        <Content style={screens.md ? { width: 700, margin: '0 auto 400px' } : {}}>
          <br />
          {data ? (
            <Space size="large" direction="vertical">
              <Row>
                <Col flex={1}>
                  <Typography.Title level={2} id={`${props.id}`}>
                    {data.name}
                  </Typography.Title>
                </Col>
                <Col>
                  <Space>
                    <Dropdown
                      trigger="click"
                      overlay={
                        <Menu onClick={handleMenuClick}>
                          <Menu.Item key="edit" icon={<EditOutlined />}>
                            Edit
                          </Menu.Item>
                          <Menu.Item key="delete" icon={<DeleteOutlined />}>
                            Delete
                          </Menu.Item>
                        </Menu>
                      }
                      placement="bottomRight"
                    >
                      <Button icon={<EllipsisOutlined />} />
                    </Dropdown>
                  </Space>
                </Col>
              </Row>

              {!editing ? (
                <Descriptions column={1}>
                  {data.description && (
                    <Descriptions.Item label="Description">
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 3,
                          expandable: true,
                          symbol: 'more',
                        }}
                      >
                        {data.description}
                      </Typography.Paragraph>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Created by">
                    <Space>
                      <User user={data.createdBy} />
                      <Typography.Text type="secondary">
                        {FIRESTORE_HELPER.timestampToFromNow(data.createdAt)}
                      </Typography.Text>
                    </Space>
                  </Descriptions.Item>
                  {data.lastModifiedBy && (
                    <Descriptions.Item label="Last modified">
                      <Space>
                        <User user={data.lastModifiedBy} />
                        <Typography.Text type="secondary">
                          {FIRESTORE_HELPER.timestampToFromNow(
                            data.lastModified,
                          )}
                        </Typography.Text>
                      </Space>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <EditStory
                  id={props.id}
                  data={data}
                  onFinish={() => setEditing(false)}
                />
              )}

              <Typography.Title level={3}>Timeline</Typography.Title>

              <Items
                storyName={data.name}
                storyId={props.id}
                setItemsAnchor={setItemsAnchor}
              />
            </Space>
          ) : (
            <Card loading />
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Story © 2020 Created by Jayc
        </Footer>
      </Layout>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: 'test' } }],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: { id: params.id },
  };
}

export default Story;