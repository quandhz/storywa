import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Timeline,
  Divider,
  Typography,
  Upload,
} from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { FILES } from '../../apis/files';
import { ITEMS } from '../../apis/items';
import { STORIES } from '../../apis/stories';
import { customRequest } from '../../libs/firebaseStorage';
import { useUser } from '../../utils/auth/useUser';
import UploadToItems from '../UploadToItems';
import Files from '../Files';
import User from '../User';

const Component = (props) => {
  const dateFormat =
    props.date && moment(props.date).local().format("ddd D MMM [']YY");

  const handleMenuClick = (e) => {
    console.log('click', e);
    if (e.key === 'edit') {
    }

    if (e.key === 'delete') {
      Modal.confirm({
        title: 'Delete this item?',
        icon: <ExclamationCircleOutlined />,
        content: props.title,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          ITEMS.delete(props.storyId, props.id).then(() => {
            message.success('File deleted successfully');
          });
        },
      });
    }
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <Row>
        <Col flex={1}>
          <Space>
            {dateFormat && (
              <Typography.Title level={4}>{dateFormat}</Typography.Title>
            )}
            {props.time && (
              <Typography.Text>
                at {moment(props.time).local().format('h:mm a')}
              </Typography.Text>
            )}
          </Space>
        </Col>
        <Col>
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
        </Col>
      </Row>
      <br />

      <Row>
        <Col flex={1}>
          <Typography.Title level={5}>{props.title}</Typography.Title>
        </Col>
      </Row>
      <br />
      {/*<User user={props.createdBy} />*/}

      {props.description && (
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
        >
          {props.description}
        </Typography.Paragraph>
      )}

      <Files storyId={props.storyId} itemId={props.id} />

      <UploadToItems
        storyId={props.storyId}
        itemId={props.id}
        date={dateFormat}
      />
    </div>
  );
};

export default Component;
