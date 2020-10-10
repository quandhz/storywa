import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Layout,
  Menu,
  Row,
  message,
  Grid,
  Divider,
  Upload,
  Typography,
  Collapse,
} from 'antd';
import EXIF from 'exif-js';
import { useState } from 'react';
import AllStories from '../components/Story/AllStories';
import { customRequest } from '../libs/firebaseStorage';

import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';
import CreatePost from '../components/CreatePost';
import PageHeader from '../components/PageHeader';
import CreateStory from '../components/Story/CreateStory';
import Exif from '../components/Exif';
import { useUser } from '../utils/auth/useUser';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

import styles from '../components/Content/styles.module.css';

const { Header, Content, Footer } = Layout;

const Index = () => {
  const { user, logout } = useUser();
  const [files, setFiles] = useState([]);
  const [adding, setAdding] = useState(false);
  const screens = Grid.useBreakpoint();

  if (!user) {
    return (
      <>
        <p>Hi there!</p>
        <p>
          You are not signed in.{' '}
          <Link href={'/auth'}>
            <a>Sign in</a>
          </Link>
        </p>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>Jayc Stories</title>
      </Head>
      <Layout style={{ background: 'white', padding: '16px 0' }}>
        <PageHeader />

        <Content style={screens.md ? { width: 700, margin: '0 auto' } : {}}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Stories</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ background: 'white' }}>
            <Collapse activeKey={adding && '1'} ghost destroyInactivePanel>
              <Collapse.Panel
                header={
                  <Row gutter={16}>
                    <Col flex={1}>
                      <Typography.Title level={5}>All stories</Typography.Title>
                    </Col>
                    <Col>
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        disabled={adding}
                        onClick={() => setAdding(true)}
                      >
                        Story
                      </Button>
                    </Col>
                  </Row>
                }
                showArrow={false}
                key="1"
              >
                <CreateStory onFinish={() => setAdding(false)} />
              </Collapse.Panel>
            </Collapse>

            <div className={styles.content}>
              <AllStories adding={adding} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Story © 2020 Created by Jayc
        </Footer>
      </Layout>
    </div>
  );
};

export default Index;
