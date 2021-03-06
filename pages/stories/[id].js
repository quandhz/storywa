import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import {
  Descriptions,
  Breadcrumb,
  Tabs,
  Statistic,
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
  BackTop,
  Anchor,
  Affix,
  Avatar,
} from 'antd';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateItem from '../../components/Item/CreateItem';
import { STORIES } from '../../apis/stories';
import PageHeader from '../../components/PageHeader';
import People from '../../components/People';
import EditStory from '../../components/Story/EditStory';
import { FIRESTORE_HELPER } from '../../components/Timestamp';
import User from '../../components/User';
import Items from '../../components/Items';
import AllStories from '../../components/Story/AllStories';
import AddStory from '../../components/Story/AddStory';
import styles from '../../components/Content/styles.module.css';
import { useUser } from '../../utils/auth/useUser';

const { Header, Content, Footer } = Layout;

const Story = (props) => {
  const screens = Grid.useBreakpoint();
  const [data, setData] = useState();
  const [sticky, setSticky] = useState(false);
  const [activeItem, setActiveItem] = useState(['']);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const [targetOffset, setTargetOffset] = useState(0);
  const { user, logout } = useUser();

  useEffect(() => {
    return STORIES.stream(props.id, (snapshot) => {
      return setData(snapshot.data());
    });
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
          STORIES.delete(props.id)
            .then(() => {
              message.success('Story deleted successfully');

              router.push('/');
            })
            .catch((e) => {
              message.error(e);
            });
        },
      });
    }
  };

  return (
    <div>
      <Head>
        <title>{data ? `${data.name}` : 'Story'}</title>
      </Head>
      <Layout>
        <PageHeader />

        <Content>
          <br />
          {data ? (
            <div>
              <div style={screens.md ? { width: 700, margin: '0 auto' } : {}}>
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
              </div>
              <Affix onChange={setSticky}>
                {sticky && (
                  <div className={styles.navbar}>
                    <div
                      style={
                        screens.md
                          ? {
                              width: 700,
                              margin: '0 auto 400px',
                              padding: '8px 0',
                            }
                          : {
                              padding: '8px 16px',
                            }
                      }
                    >
                      {activeItem ? (
                        <div>
                          <Row
                            gutter={16}
                            align="middle"
                            style={{ flexWrap: 'nowrap' }}
                          >
                            <Col flex="auto">
                              <Typography.Paragraph
                                strong
                                ellipsis={{
                                  rows: 1,
                                  expandable: false,
                                }}
                                title={`${moment(activeItem.date)
                                  .local()
                                  .format('DD/MM/YYYY')} - ${activeItem.title}`}
                                style={{
                                  marginBottom: 0,
                                  maxWidth: screens.md ? 500 : '60vw',
                                }}
                              >
                                {moment(activeItem.date)
                                  .local()
                                  .format('DD/MM/YYYY')}{' '}
                                - {activeItem.title}
                              </Typography.Paragraph>
                            </Col>
                            <Col>
                              <Button size="small" icon={<UploadOutlined />}>
                                Upload
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        data.name
                      )}
                    </div>
                  </div>
                )}
              </Affix>
              {false && (
                <div
                  style={
                    screens.md ? { width: 700, margin: '0 auto 24px' } : {}
                  }
                >
                  <Space size="large" direction="vertical">
                    {!editing ? (
                      <Descriptions column={1}>
                        {data.description && (
                          <Typography.Paragraph
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: 'more',
                            }}
                          >
                            {data.description}
                          </Typography.Paragraph>
                        )}
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

                    <People storyId={props.id} />
                  </Space>
                </div>
              )}

              <Row style={{ background: 'white', flexWrap: 'nowrap' }}>
                <Col flex="300px" style={{ padding: 16 }}>
                  <Affix offsetTop={60}>
                    <Card title="People">
                      <Space direction="vertical">
                        <Space align="center">
                          <Avatar size={32} src={user.photoURL} />
                          <div>
                            <Space size={0} direction="vertical">
                              <Typography.Text strong>
                                Quan Hong Do
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                Sponsor
                              </Typography.Text>
                            </Space>
                          </div>
                        </Space>
                        <Space align="center">
                          <Avatar
                            size={32}
                            src="https://lh3.googleusercontent.com/-986Ac9cmE2g/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclV9DHb2Zfv8Px7QHMsmvrbE2XFGQ/s96-c/photo.jpg"
                          />
                          <div>
                            <Space size={0} direction="vertical">
                              <Typography.Text strong>
                                Chau Thi Quynh Nguyen
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                Applicant
                              </Typography.Text>
                            </Space>
                          </div>
                        </Space>
                      </Space>
                    </Card>
                  </Affix>
                  <br />
                  <Card title="Milestones">
                    <Space size="large" direction="vertical">
                      <div>
                        <Statistic
                          title="First meeting"
                          value="20 - 10 - 2019"
                        />
                        <Typography.Text>For 11 months 23 days</Typography.Text>
                      </div>
                      <div>
                        <Statistic
                          title="Being in love"
                          value="10 - 12 - 2019"
                        />
                        <Typography.Text>For 10 months 3 days</Typography.Text>
                      </div>
                      <div>
                        <Statistic title="Engagement" value="11 - 02 - 2020" />
                        <Typography.Text>For 8 months 2 days</Typography.Text>
                      </div>
                      <div>
                        <Statistic title="Wedding" value="24 - 12 - 2020" />
                        <Typography.Text>In 3 months</Typography.Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col flex="auto">
                  <Row style={{ background: 'white', flexWrap: 'nowrap' }}>
                    <Col flex="auto">
                      <Tabs onChange={console.log}>
                        <Tabs.TabPane tab="Timeline" key="1">
                          <Items
                            storyName={data.name}
                            storyId={props.id}
                            setActiveItem={setActiveItem}
                          />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Financial" key="2"></Tabs.TabPane>
                        <Tabs.TabPane tab="Household" key="3"></Tabs.TabPane>
                        <Tabs.TabPane tab="Social" key="4"></Tabs.TabPane>
                        <Tabs.TabPane tab="Commitment" key="5"></Tabs.TabPane>
                        <Tabs.TabPane tab="Testify" key="6"></Tabs.TabPane>
                      </Tabs>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          ) : (
            <div style={screens.md ? { width: 700, margin: '0 auto' } : {}}>
              <Card loading />
            </div>
          )}

          <BackTop>
            <Button icon={<ToTopOutlined style={{ fontSize: 16 }} />} />
          </BackTop>
        </Content>
        <Footer style={{ textAlign: 'center', padding: '12px 50px' }}>
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
