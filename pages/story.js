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
} from 'antd';
import EXIF from 'exif-js';
import { useState } from 'react';
import { customRequest } from '../libs/firebaseStorage';

import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';
import CreatePost from '../components/CreatePost';
import PageHeader from '../components/PageHeader';
import Exif from '../components/Exif';
import { useUser } from '../utils/auth/useUser';
import { InboxOutlined } from '@ant-design/icons';

import styles from '../components/Content/styles.module.css';

const { Header, Content, Footer } = Layout;

const Story = () => {
  const { user, logout } = useUser();
  const [files, setFiles] = useState([]);
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

  const props = {
    name: 'file',
    multiple: true,
    customRequest: customRequest('storyFiles', user.id),
  };

  console.log('files', files);

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
            Start by uploading
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Upload.Dragger>
          </div>

          {files.length > 0 && <Divider orientation="left">Preview</Divider>}
          {files.length > 0 && (
            <div>
              <br />
              <Button danger onClick={() => setFiles([])}>
                Clear
              </Button>
              <br />
              <br />
            </div>
          )}

          {files &&
            files.map((file) => {
              return (
                <div key={file.uid}>
                  <img src={file.response} width={120} />
                  <div>{file.name}</div>
                  <Exif {...file.exifData} />
                </div>
              );
            })}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Story © 2020 Created by Jayc
        </Footer>
      </Layout>
    </div>
  );
};

export default Story;
