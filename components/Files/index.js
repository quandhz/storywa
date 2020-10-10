import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  List,
  Card,
  Col,
  Collapse,
  Descriptions,
  Dropdown,
  Empty,
  Menu,
  Row,
  Space,
  Timeline,
  Typography,
  Upload,
  message,
  Button,
  Modal,
  Divider,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FILES } from '../../apis/files';
import { ITEMS } from '../../apis/items';
import { customRequest } from '../../libs/firebaseStorage';
import { useUser } from '../../utils/auth/useUser';
import CreateItem from '../Item/CreateItem';
import Item from '../Item';
import EditStory from '../Story/EditStory';
import { FIRESTORE_HELPER } from '../Timestamp';
import User from '../User';
import File from './File';
import Photo from '../Photo';

const Component = (props) => {
  const [data, setData] = useState();
  const { user } = useUser();

  useEffect(() => {
    return (
      props.storyId &&
      FILES.streamAll(props.storyId, props.itemId, (snapshot) => {
        let arr = [];

        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });

        return setData(arr);
      })
    );
  }, [props.storyId]);

  if (!data || !data.length) return null;

  const handleMenuClick = (id, fileName) => (e) => {
    console.log('click', e);
    if (e.key === 'edit') {
    }

    if (e.key === 'delete') {
      Modal.confirm({
        title: 'Delete this file?',
        icon: <ExclamationCircleOutlined />,
        content: fileName,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          FILES.delete(props.storyId, props.itemId, id).then(() => {
            message.success('File deleted successfully');
          });
        },
      });
    }
  };

  return (
    <>
      <Divider>Files</Divider>

      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            extra={
              <Photo
                width={200}
                fileName={item.fileName}
                refURL={`itemFiles/${props.storyId}/${props.itemId}/${user.id}/${item.fileName}`}
              />
            }
          >
            <List.Item.Meta
              title={
                <Row>
                  <Col flex={1}>{item.fileName}</Col>
                  <Col>
                    <Dropdown
                      trigger="click"
                      overlay={
                        <Menu onClick={handleMenuClick(item.id, item.fileName)}>
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
                      <Button type="text" icon={<EllipsisOutlined />} />
                    </Dropdown>
                  </Col>
                </Row>
              }
              description={
                <Space>
                  <User user={item.createdBy} />
                  <Typography.Text type="secondary">
                    {FIRESTORE_HELPER.timestampToFromNow(item.createdAt)}
                  </Typography.Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Component;
