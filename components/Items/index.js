import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
  InboxOutlined,
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
  Card,
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
import UploadToStory from '../UploadToStory';
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

  if (!data) return <Card loading />;

  return <UploadToStory />;
};

export default Component;
