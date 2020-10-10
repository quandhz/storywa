import { Avatar, Space } from 'antd';

const Component = (props) => {
  if (typeof props.user !== 'object') return null;

  return (
    <Space size={4} align="center">
      <Avatar size={20} src={props.user.photoURL} />
      <div>{props.user.name}</div>
    </Space>
  );
};

export default Component;
