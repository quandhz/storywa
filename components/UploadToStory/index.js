import {
  FileOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import EXIF from 'exif-js';
import moment from 'moment';
import {
  Anchor,
  Button,
  Col,
  Divider,
  Empty,
  Card,
  Form,
  Row,
  Space,
  Typography,
  Upload,
  Input,
  Grid,
  Tooltip,
} from 'antd';
import { useState } from 'react';

function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

const UploadToStory = () => {
  const screens = Grid.useBreakpoint();
  const [anchors, setAnchors] = useState([]);
  const [dates, setDates] = useState({});
  const [fileList, setFileList] = useState([]);
  const [trash, setTrash] = useState([]);

  const today = moment().format('YYYYMMDD');

  const uploadButton = (
    <Upload
      multiple
      listType="picture"
      beforeUpload={() => false}
      showUploadList={false}
      onChange={({ file: f, fileList: fl }) => {
        const file = {
          uid: f.uid,
          name: f.name,
          lastModified: f.lastModified,
          size: f.size,
          type: f.type,
          previewURL: URL.createObjectURL(f),
          timeKey: moment().format('HH:MM'),
        };

        if (!file.lastModified) {
          setAnchors((curAnchors) =>
            curAnchors.indexOf(today) === -1
              ? curAnchors.concat(today).sort()
              : curAnchors,
          );
          setDates(({ [today]: curToday = [], ...cur }) => ({
            ...cur,
            [today]: curToday.concat(file),
          }));
        } else {
          const date = moment(file.lastModified);
          const dateKey = date.format('YYYYMMDD');

          setAnchors((curAnchors) =>
            curAnchors.indexOf(dateKey) === -1
              ? curAnchors.concat(dateKey).sort()
              : curAnchors,
          );

          file.timeKey = date.format('HH:MM');

          setDates(({ [dateKey]: curDate = [], ...cur }) => ({
            ...cur,
            [dateKey]: curDate.concat(file),
          }));
        }
      }}
    >
      <Button icon={<UploadOutlined />}>Select Files</Button>
    </Upload>
  );

  const deleteFile = (dateKey, uid) => () => {
    setDates(({ [dateKey]: date, ...rest }) => ({
      ...rest,
      [dateKey]: date.filter((file) => file.uid !== uid),
    }));
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  console.log('dates', dates);

  return (
    <Row style={{ flexWrap: 'nowrap' }}>
      <Col flex="auto">
        <Card>
          <Form
            name="uploadAll"
            onFinish={onFinish}
            // initialValues={{
            //   ['input-number']: 3,
            //   ['checkbox-group']: ['A', 'B'],
            //   rate: 3.5,
            // }}
          >
            {!Object.keys(dates).length ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Typography.Text type="secondary">No Data</Typography.Text>
                    <br />
                    <br />
                    {uploadButton}
                  </span>
                }
              />
            ) : (
              <div style={screens.md ? { width: 700, margin: '0 auto' } : {}}>
                <Row justify="space-between">
                  <Col>
                    <Space>
                      {uploadButton}
                      <Button
                        danger
                        onClick={() => {
                          setDates([]);
                          setAnchors([]);
                        }}
                      >
                        Delete all
                      </Button>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Add to Story
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
            <br />
            <br />
            {Object.keys(dates).map((key) => {
              return (
                <div key={key}>
                  <Divider />
                  <div id={key}>
                    <Typography.Text type="secondary">
                      {moment(key, 'YYYYMMDD').format('ddd D MMM, YYYY')}
                    </Typography.Text>
                  </div>

                  <br />
                  <br />
                  <Form.Item name={`${key}.1.description`} noStyle>
                    <Input.TextArea placeholder="Untitled" autoSize />
                  </Form.Item>

                  <Row gutter={[16, 16]}>
                    {dates[key]
                      .slice()
                      .reverse()
                      .map((file, index) => {
                        return (
                          <Col
                            key={file.uid}
                            style={{ minWidth: 200, maxWidth: 300 }}
                          >
                            <Card
                              bodyStyle={{ padding: '12px 8px 16px' }}
                              hoverable
                              cover={
                                file.type.indexOf('image') !== -1 ? (
                                  <div
                                    style={{
                                      textAlign: 'center',
                                    }}
                                  >
                                    <img
                                      src={file.previewURL}
                                      style={{
                                        maxWidth: '100%',
                                        maxHeight: 300,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      background: 'gainsboro',
                                      maxWidth: 200,
                                      minHeight: 100,
                                      maxHeight: 300,
                                      padding: '24px 8px',
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
                                    <div>
                                      <Typography.Text>
                                        {file.name}
                                      </Typography.Text>
                                    </div>
                                  </div>
                                )
                              }
                              actions={[
                                <Button type="text" icon={<EyeOutlined />} />,
                                <Button
                                  type="link"
                                  icon={<DownloadOutlined />}
                                  href={file.previewURL}
                                  target="_blank"
                                />,
                                <Tooltip placement="top" title="Hide file">
                                  <Button
                                    type="text"
                                    onClick={deleteFile(key, file.uid)}
                                    icon={<EyeInvisibleOutlined />}
                                  />
                                </Tooltip>,
                              ]}
                            >
                              <Card.Meta
                                description={
                                  <Space>
                                    <Typography.Text type="danger">
                                      {file.timeKey}
                                    </Typography.Text>
                                    <Typography.Text type="secondary">
                                      {file.type.split('/')[1] &&
                                        file.type
                                          .split('/')[1]
                                          .substring(0, 10)
                                          .toUpperCase()}{' '}
                                      - {getReadableFileSizeString(file.size)}
                                    </Typography.Text>
                                  </Space>
                                }
                              />
                            </Card>
                          </Col>
                        );
                      })}
                  </Row>
                </div>
              );
            })}
            <br />
            <br />
          </Form>
        </Card>
      </Col>
      <Col flex="300px" style={{ padding: 16 }}>
        <Anchor offsetTop={60} activeLink={`#${anchors[0]}`}>
          {anchors.map((key) => {
            return (
              <Anchor.Link
                key={key}
                href={`#${key}`}
                title={
                  <Row>
                    <Col flex="auto">
                      {moment(key, 'YYYYMMDD').format('ddd D MMM, YYYY')}
                    </Col>
                    <Col>{dates[key].length}</Col>
                  </Row>
                }
              />
            );
          })}
        </Anchor>
      </Col>
    </Row>
  );
};

export default UploadToStory;
