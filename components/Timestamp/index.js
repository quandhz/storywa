import { Avatar, Space } from 'antd';
import firebase from 'firebase/app';
import moment from 'moment';
import 'firebase/firestore';

const timestampToDate = (timestamp) => {
  return (
    timestamp &&
    new firebase.firestore.Timestamp(
      timestamp.seconds,
      timestamp.nanoseconds,
    ).toDate()
  );
};

const timestampToFormat = (timestamp, format = "ddd D MMM [']YY") => {
  return timestamp && moment(timestampToDate(timestamp)).format(format);
};
const timestampToFromNow = (timestamp) => {
  return timestamp && moment(timestampToDate(timestamp)).fromNow();
};

const Component = (props) => {
  if (!props.timestamp) return null;

  return (
    <Space>
      <Avatar size="small" src={props.user.photoURL} />
      <div>{props.user.name}</div>
    </Space>
  );
};

export const FIRESTORE_HELPER = {
  timestampToFormat,
  timestampToFromNow,
};

export default Component;
