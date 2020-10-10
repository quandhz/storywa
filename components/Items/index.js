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

  const anchors = data.reduce((accu, item, index) => {
    if (!item.date && !item.time) {
      return accu;
    }
    const date = moment(item.date).local();

    if (accu.indexOf(date) !== -1) return accu;

    return [
      ...accu,
      [date.format('DDMMYYYY'), date.format('DD/MM/YYYY'), index],
    ];
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 90,
          right: 16,
          visibility: !screens.md && 'hidden',
        }}
      >
        <Anchor
          offsetTop={60}
          activeLink={`#${props.storyId}`}
          onChange={(activeLink) => {
            // scroll back top
            if (activeLink === `#${props.storyId}`) {
              return props.setActiveItem();
            }
            // scroll to items
            for (let i = 0; i < anchors.length; i += 1) {
              const [key, _, itemTitle] = anchors[i];

              if (`#${key}` === activeLink) {
                props.setActiveItem(data[i]);
                break;
              }
            }
          }}
        >
          <Anchor.Link
            href={`#${props.storyId}`}
            title={<b>{props.storyName}</b>}
          >
            {anchors.map((item) => {
              const [key, title] = item;

              return <Anchor.Link key={key} href={`#${key}`} title={title} />;
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
