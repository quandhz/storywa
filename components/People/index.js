import { UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Layout } from 'antd';
import { useEffect, useState } from 'react';
import { ROLES } from '../../apis/roles';

const { Header, Content, Footer } = Layout;

export default function People(props) {
  const [data, setData] = useState();

  useEffect(() => {
    return (
      props.storyId &&
      ROLES.streamAll(props.storyId, (snap) => {
        const roles = [];
        snap.forEach(function (doc) {
          roles.push({
            ...doc.data(),
            id: doc.id,
          });
          setData(roles);
        });
      })
    );
  }, [props.storyId]);

  if (!data) return null;

  console.log('data', data);

  return (
    <Avatar.Group>
      {data.map((role) => {
        return (
          role.user && (
            <Avatar
              key={role.id}
              alt={role.user.displayName}
              title={role.user.displayName}
              src={role.user.photoURL}
            />
          )
        );
      })}
      <Avatar
        style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
        icon={<UserAddOutlined />}
      />
    </Avatar.Group>
  );
}
