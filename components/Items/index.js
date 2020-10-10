import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
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
  Anchor,
  Input,
  DatePicker,
  TimePicker,
  Grid,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ITEMS } from '../../apis/items';
import { customRequest } from '../../libs/firebaseStorage';
import { useUser } from '../../utils/auth/useUser';
import CreateItem from '../Item/CreateItem';
import Item from '../Item';
import EditStory from '../Story/EditStory';
import { FIRESTORE_HELPER } from '../Timestamp';
import User from '../User';

const Component = (props) => {
  const [data, setData] = useState();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetOffset, setTargetOffset] = useState(undefined);
  const { user } = useUser();
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    return (
      props.storyId &&
      ITEMS.streamAll(props.storyId, (snapshot) => {
        let arr = [];

        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });

        if (props.setItemsAnchor) {
          props.setItemsAnchor(arr);
        }
        return setData(arr);
      })
    );
  }, [props.storyId]);

  if (!data) return null;

  if (!data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const anchors = data.reduce((accu, item) => {
    if (!item.date && !item.time) {
      return accu;
    }
    const date = moment(item.date).local();

    if (accu.indexOf(date) !== -1) return accu;

    return accu.concat({
      key: date.format('DDMMYYYY'),
      title: date.format('DD/MM/YYYY'),
    });
  }, []);

  return (
    <div>
      {screens.md && (
        <div style={{ position: 'absolute', top: 80, right: 16 }}>
          <Anchor offsetTop={16} activeLink={`#${props.storyId}`}>
            <Anchor.Link
              href={`#${props.storyId}`}
              title={<b>{props.storyName}</b>}
              activeLink={'#' + data[0].id}
            >
              {anchors.map((anchor) => {
                return (
                  <Anchor.Link
                    key={anchor.key}
                    href={`#${anchor.key}`}
                    title={anchor.title}
                  />
                );
              })}
            </Anchor.Link>
            <Anchor.Link
              href="#AddItem"
              title={
                <Space>
                  <PlusOutlined />
                  Add Item
                </Space>
              }
            />
          </Anchor>
        </div>
      )}

      <Timeline>
        {data.map((item) => {
          const id = moment(item.date).local().format('DDMMYYYY');

          return (
            <Timeline.Item key={item.id} id={`${id}`}>
              <Item storyId={props.storyId} {...item} />
            </Timeline.Item>
          );
        })}

        <Timeline.Item
          id="AddItem"
          dot={<Button icon={<PlusOutlined />} shape="circle" type="primary" />}
        >
          <CreateItem storyId={props.storyId} />
        </Timeline.Item>
      </Timeline>
    </div>
  );
};

export default Component;
