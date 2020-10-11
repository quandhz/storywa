import {
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Button, List, Typography, Avatar, Empty } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STORIES } from '../../apis/stories';
import AddStory from '../Story/AddStory';
import User from '../User';
import { FIRESTORE_HELPER } from '../Timestamp';

const Stories = (props) => {
  const [data, setData] = useState();

  useEffect(() => {
    return STORIES.streamAll((snapshot) => {
      let arr = [];

      snapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });

      return setData(arr);
    });
  }, []);

  if (!data) return <Card loading />;

  console.log('data', data);

  return (
    <div>
      <Card style={{ width: '100%' }} title="Stories" extra={<AddStory />}>
        <List itemLayout="vertical">
          {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

          {data.map((story) => {
            return (
              <List.Item key={story.id} extra={<User user={story.creator} />}>
                <List.Item.Meta
                  title={
                    <Link href={'/stories/' + story.id}>{story.name}</Link>
                  }
                  description={
                    <>
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: 'more',
                        }}
                      >
                        {story.description}
                      </Typography.Paragraph>

                      <Typography.Text type="secondary">
                        {FIRESTORE_HELPER.timestampToFromNow(
                          story.lastModified,
                        )}
                      </Typography.Text>
                    </>
                  }
                />
              </List.Item>
            );
          })}
        </List>
      </Card>
    </div>
  );
};

export default Stories;
