import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {
  Space,
  Button,
  Card,
  List,
  Input,
  Empty,
  Avatar,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STORIES } from '../../apis/stories';
import { useUser } from '../../utils/auth/useUser';
import { FIRESTORE_HELPER } from '../Timestamp';

const IconText = ({ icon: Icon, text }) => (
  <Space>
    <Icon />
    {text}
  </Space>
);

const AllStories = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    return STORIES.streamAll((snapshot) => {
      let arr = [];

      snapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });

      return setData(arr);
    });
  }, []);

  if (!data) return null;

  if (!data.length) {
    return !props.adding && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <List itemLayout="vertical">
      {data.map((story) => {
        return (
          <List.Item
            key={story.id}
            style={{ padding: 16 }}
            actions={[
              <IconText
                icon={StarOutlined}
                text="156"
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text="156"
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text="2"
                key="list-vertical-message"
              />,
            ]}
            extra={
              <Typography.Text type="secondary">
                {FIRESTORE_HELPER.timestampToFromNow(story.lastModified)}
              </Typography.Text>
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={story.createdBy.photoURL} />}
              title={<Link href={'/stories/' + story.id}>{story.name}</Link>}
              description={
                <Typography.Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: 'more',
                  }}
                >
                  {story.description}
                </Typography.Paragraph>
              }
            />
          </List.Item>
        );
      })}
    </List>
  );
};

export default AllStories;
