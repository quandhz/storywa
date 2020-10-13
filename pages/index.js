import {
  DeleteOutlined,
  FileOutlined,
  UploadOutlined,
  StarOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Image,
  Timeline,
  Grid,
  Layout,
  Popover,
  Card,
  Row,
  Space,
  Typography,
  Upload,
  Avatar,
  Anchor,
} from 'antd';
import Head from 'next/head';

import Link from 'next/link';
import { useState } from 'react';
import Chapters from '../components/Chapters';
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
  const [collapsed, setCollapsed] = useState([]);
  const [adding, setAdding] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const screens = Grid.useBreakpoint();

  const siderWidth = 0;

  return (
    <div>
      <Head>
        <title>Jayc Stories</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Molle:ital@1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Piedra&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Layout style={{ minHeight: '100vh' }}>
        <div
          style={{
            background:
              'linear-gradient(0deg, rgba(255,255,255,1) 35%, rgba(239,246,255,1) 72%, rgba(216,234,255,1) 100%)',
            borderBottom: '1px solid #e0e0e1',
            minHeight: 300,
            paddingTop: 48,
          }}
        >
          {/*<Row justify="center">*/}
          {/*  <Col>*/}
          {/*    <Image width={500} src="/photos/cover.jpeg" />*/}
          {/*  </Col>*/}
          {/*</Row>*/}
          {/*<br />*/}
          <Row justify="center">
            <Col>
              <Typography.Title
                level={1}
                style={{ fontFamily: "'Molle', cursive" }}
              >
                Our Love Story
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: -8 }}>
            <Col>
              <Typography.Text type="secondary">
                Since October 2019
              </Typography.Text>
            </Col>
          </Row>
          <br />
          <br />
          <Row justify="center" style={{ textAlign: 'center' }}>
            <Col>
              <Typography.Title
                level={4}
                style={{ fontFamily: "'Piedra', cursive" }}
              >
                Applicant
              </Typography.Title>
              <Avatar size={screens.md ? 150 : 140} src="photos/juliet.jpg" />
              <br />
              <Typography.Text
                strong
                style={{
                  marginTop: 8,
                  marginBottom: 4,
                  fontFamily: "'Piedra', cursive",
                }}
              >
                Chau Thi Quynh Nguyen
              </Typography.Text>
              <br />
              <Typography.Text>20 - 09 - 1999</Typography.Text>
              <br />
              <Typography.Text type="secondary">@Juliet</Typography.Text>
            </Col>
            <Col>
              <HeartFilled
                style={{
                  fontSize: 24,
                  color: 'red',
                  marginTop: 100,
                  padding: '0 16px 0 12px',
                }}
              />
            </Col>
            <Col>
              <Typography.Title
                level={4}
                style={{ fontFamily: "'Piedra', cursive" }}
              >
                Sponsor
              </Typography.Title>
              <Avatar size={screens.md ? 150 : 140} src="photos/jayc.jpg" />
              <br />
              <Typography.Text
                strong
                style={{
                  marginTop: 8,
                  marginBottom: 4,
                  fontFamily: "'Piedra', cursive",
                }}
              >
                Quan Do Hong
              </Typography.Text>
              <br />
              <Typography.Text>05 - 10 - 1991</Typography.Text>
              <br />
              <Typography.Text type="secondary">@Jayc</Typography.Text>
            </Col>
          </Row>

          <br />
          <Row justify="center">
            <Col style={{ width: 450 }}>
              <Divider>
                <Typography.Text
                  strong
                  style={{ fontFamily: "'Piedra', cursive" }}
                >
                  Major Milestones
                </Typography.Text>
              </Divider>
            </Col>
          </Row>
          <br />
          <Row justify="center">
            <Col flex="500px">
              <Timeline mode="left">
                <Timeline.Item label="20 - 10 - 2019">
                  Our story begins
                </Timeline.Item>
                <Timeline.Item label="23 - 11 - 2019">
                  We met for the first time
                </Timeline.Item>
                <Timeline.Item label="11 - 02 - 2020">
                  He proposed, I said yes
                </Timeline.Item>
                <Timeline.Item label="24 - 12 - 2020">
                  The best day
                </Timeline.Item>
              </Timeline>
            </Col>
          </Row>
        </div>
        <Content
          style={{
            background: '#f6f8fa',
            minHeight: '80vh',
            position: 'relative',
            paddingBottom: 64,
          }}
        >
          {screens.md && (
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <Anchor style={{ background: 'unset' }}>
                <Anchor.Link
                  href="#components-anchor-demo-basic"
                  title="Basic demo"
                />
                <Anchor.Link
                  href="#components-anchor-demo-static"
                  title="Static demo"
                />
                <Anchor.Link href="#API" title="API">
                  <Anchor.Link href="#Anchor-Props" title="Anchor Props" />
                  <Anchor.Link href="#Link-Props" title="Link Props" />
                </Anchor.Link>
              </Anchor>
            </div>
          )}
          <br />
          <Row justify="center">
            <Col style={{ maxWidth: 500 }}>
              <Typography.Title
                level={4}
                style={{ fontFamily: "'Piedra', cursive" }}
              >
                Development of Relationship
              </Typography.Title>
            </Col>
          </Row>
          <br />

          <Chapters />
          <br />

          <Row justify="center">
            <Col style={{ width: 500 }}>
              <Card>
                <Typography.Text
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  CHAPTER
                  <br />
                  ONE
                </Typography.Text>
                <br />
                <Typography.Title
                  level={4}
                  style={{ fontFamily: "'Piedra', cursive" }}
                >
                  Our story begins
                </Typography.Title>
                <br />
                <Typography.Text strong>
                  20 October 2019
                </Typography.Text>
                <Typography.Paragraph>
                  Chau and I really liked each other at the time. Even though I
                  already planned to go back Vietnam in middle January 2020 (in
                  one and a half month) for Lunar New Year, I couldn’t wait
                  anymore. So I took one week off work and traveled to Vietnam
                  to be with Chau.
                </Typography.Paragraph>
                <Typography.Paragraph>
                  I searched for the earliest flight available. It was Thursday
                  night when I booked my flight to Hanoi, and it departed
                  mid-night the next day (1am Saturday 23/11). The decision was
                  made somewhat quick, but I’m so glad I did that.
                </Typography.Paragraph>
              </Card>
            </Col>
          </Row>
          <br />
          <Row justify="center">
            <Col style={{ width: 500 }}>
              <Card>
                <Typography.Text
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  CHAPTER
                  <br />
                  TWO
                </Typography.Text>
                <br />
                <Typography.Title
                  level={4}
                  style={{ fontFamily: "'Piedra', cursive" }}
                >
                  We met for the first time
                </Typography.Title>
                <br />
                <Typography.Text strong>
                  Hanoi, 23 November 2019
                </Typography.Text>
                <Typography.Paragraph>
                  As soon as I arrived Hanoi, I picked up the rental car, then
                  went to pick Chau up at her home. In the whole next 9 days 8
                  nights, we never leave each other’s sight.
                </Typography.Paragraph>
                <Typography.Paragraph>
                  We stayed in Hanoi that night, so I could take some rest, and
                  we had some time to get know each other more. Chau was a bit
                  shy at first, after all, it was the first time we met in
                  person. But it didn’t take long, we had so much things in
                  common. It felt like we already knew each other for so long
                  and we were born to love and be loved by each other.
                </Typography.Paragraph>
              </Card>
            </Col>
          </Row>
          <br />
          <Card>To be continued..</Card>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            padding: '12px 50px',
            background: '#001529',
            color: 'white',
          }}
        >
          Story © 2020 Created by Quan Do
        </Footer>
      </Layout>
    </div>
  );
};

export default Index;
