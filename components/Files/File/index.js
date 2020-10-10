import { Modal, Space, Typography } from 'antd';
import {
  FilePdfOutlined,
  FileOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { STORIES } from '../../../apis/stories';
import { useUser } from '../../../utils/auth/useUser';
import User from '../../../components/User';
import { FIRESTORE_HELPER } from '../../Timestamp';

const storage = firebase.storage();

export default function File(props) {
  const { user } = useUser();
  const [previewVisible, setPreviewVisible] = useState(false);

  const { data, isValidating } = useSWR(
    ['loadPhoto', props.storyId, props.itemId, user && user.id, props.fileName],
    async (op, storyId, itemId, uid, fileName) => {
      if (!uid) return null;

      return storage
        .ref(`itemFiles/${storyId}/${itemId}/${uid}/${fileName}`)
        .getDownloadURL();
    },
  );

  if (!user) return null;

  if (previewVisible) {
    console.log('User props', props);
  }

  if (props.contentType.indexOf('image') !== -1)
    return (
      <div>
        <div
          onClick={() => {
            setPreviewVisible(true);
          }}
        >
          <img src={data} alt={props.fileName} style={{ width: '100%' }} />
        </div>

        <div>
          <a href={data} target="_blank">
            <Space>
              {props.fileName} <CloudDownloadOutlined />
            </Space>
          </a>
        </div>

        <Modal
          visible={previewVisible}
          title={props.fileName}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          destroyOnClose
        >
          <img alt={props.fileName} style={{ width: '100%' }} src={data} />
          <br />
          <Space>
            <User user={props.createdBy} />
            <Typography.Text type="secondary">
              {FIRESTORE_HELPER.timestampToFromNow(props.createdAt)}
            </Typography.Text>
          </Space>
        </Modal>
      </div>
    );

  // if (props.contentType.indexOf('application/pdf') !== -1) {
  //   return (
  //   );
  // }

  return (
    <div>
      <div
        style={{
          width: '100%',
          paddingTop: 40,
          height: 100,
          background: 'gainsboro',
          textAlign: 'center',
        }}
      >
        {props.contentType === 'application/pdf' ? (
          <FilePdfOutlined />
        ) : (
          <FileOutlined />
        )}
      </div>
      <div>
        <a href={data} target="_blank">
          <Space>
            {props.fileName} <CloudDownloadOutlined />
          </Space>
        </a>
      </div>
      {/*<div>*/}
      {/*  <Typography.Text type="secondary">*/}
      {/*    Added {FIRESTORE_HELPER.timestampToFromNow(props.createdAt)}*/}
      {/*  </Typography.Text>*/}
      {/*</div>*/}
    </div>
  );
}
