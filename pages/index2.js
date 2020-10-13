import {
  DeleteOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Grid,
  Layout,
  Popover,
  Row,
  Space,
  Typography,
  Upload,
} from 'antd';
import Head from 'next/head';

import Link from 'next/link';
import { useState } from 'react';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import Stories from '../components/Stories';
import { useUser } from '../utils/auth/useUser';

const { Sider, Header, Content, Footer } = Layout;

function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

const Index = () => {
  const { user, logout } = useUser();
  const [collapsed, setCollapsed] = useState([]);
  const [adding, setAdding] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
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

  const siderWidth = 0;

  return (
    <div>
      <Head>
        <title>Jayc Stories</title>
      </Head>

      <Layout style={{ minHeight: '100vh' }}>
        <Layout style={{ marginRight: siderWidth }}>
          <PageHeader />

          <Content
            style={
              screens.md ? { width: 700, margin: '0 auto', paddingTop: 36 } : {}
            }
          >
            <Stories />
          </Content>

          <PageFooter />
        </Layout>

        {false && (
          <Sider
            theme="light"
            width={136}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              right: previewVisible ? 300 : 0,
              boxShadow: '-1px 0 2px 1px #8a8a8a5e',
            }}
          />
        )}
        {false && (
          <Sider
            theme="light"
            width={siderWidth}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              right: 0,
              boxShadow: '-1px 0 2px 1px #8a8a8a5e',
            }}
          >
            <div
              style={{
                position: 'fixed',
                top: 0,
                width: collapsed ? siderWidth : 300,
                background: 'white',
                padding: '8px ' + collapsed ? '8px' : '16px',
                zIndex: 1,
                boxShadow: '0 1px 1px 0 #8a8a8a5e',
              }}
            >
              <Row>
                <Col flex={1}>
                  <Upload
                    multiple
                    listType="picture"
                    beforeUpload={() => false}
                    showUploadList={false}
                    onChange={({ fileList: fl }) => {
                      return setFileList(
                        fl.map((file) => {
                          return {
                            ...file,
                            previewURL: URL.createObjectURL(file.originFileObj),
                          };
                        }),
                      );
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      {!collapsed && 'Select Files'}
                    </Button>
                  </Upload>
                </Col>
                <Col>
                  <Button
                    onClick={() => setFileList([])}
                    icon={<DeleteOutlined />}
                  >
                    {!collapsed && 'Clear'}
                  </Button>
                </Col>
              </Row>
            </div>

            <div
              style={{
                padding: collapsed ? 8 : 16,
                marginTop: 48,
                marginBottom: 48,
              }}
            >
              <Space direction="vertical">
                {fileList.map((file) => {
                  return (
                    <div key={file.uid}>
                      {file.type.indexOf('image') !== -1 ? (
                        <Popover
                          placement="left"
                          title={file.name}
                          content={
                            <img style={{ width: 300 }} src={file.previewURL} />
                          }
                          trigger="hover"
                        >
                          <img
                            style={{ width: '100%' }}
                            src={file.previewURL}
                          />
                        </Popover>
                      ) : (
                        <div
                          style={{
                            background: 'gainsboro',
                            width: '100%',
                            height: 60,
                            paddingTop: 20,
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              textTransform: 'uppercase',
                              fontWeight: 600,
                            }}
                          >
                            <FileOutlined />
                          </div>
                        </div>
                      )}
                      {collapsed ? (
                        <Typography.Text type="secondary">
                          {file.type.split('/')[1].toUpperCase()}{' '}
                          {getReadableFileSizeString(file.size)}
                        </Typography.Text>
                      ) : (
                        <div>
                          <div>
                            <Typography.Text strong>
                              {file.name}
                            </Typography.Text>
                          </div>
                          <div>
                            <Row>
                              <Col flex={1}>
                                <Typography.Text type="secondary">
                                  {file.type.split('/')[1].toUpperCase()}{' '}
                                  {file.type.split('/')[0].toLowerCase()} -{' '}
                                  {getReadableFileSizeString(file.size)}
                                </Typography.Text>
                              </Col>
                              <Col>
                                <a href={file.previewURL} target="_blank">
                                  Download
                                </a>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      )}

                      <Divider
                        style={{
                          marginTop: collapsed ? 8 : 16,
                          marginBottom: collapsed ? 8 : 16,
                        }}
                      />
                    </div>
                  );
                })}
              </Space>
            </div>
          </Sider>
        )}
      </Layout>
    </div>
  );
};

export default Index;
