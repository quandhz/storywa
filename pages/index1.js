import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Layout,
  Menu,
  Row,
  Space,
  Grid,
  Popover,
} from 'antd';
import PageHeader from '../components/PageHeader';

import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';
import CreatePost from '../components/CreatePost';
import { useUser } from '../utils/auth/useUser';
import { LogoutOutlined } from '@ant-design/icons';

import styles from '../components/Content/styles.module.css';

const { Header, Content, Footer } = Layout;

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json());

const Index = () => {
  const { user, logout } = useUser();
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
        <title>Jayc Story</title>
      </Head>
      <Layout className="layout">
        <PageHeader />

        <Content style={screens.md ? { width: 700, margin: '0 auto' } : {}}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Story</Breadcrumb.Item>
          </Breadcrumb>

          <div className={styles.content}>
            <CreatePost />
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
