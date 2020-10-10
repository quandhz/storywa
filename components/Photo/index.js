import { Modal, Space, Typography } from 'antd';
import firebase from 'firebase/app';
import { useState } from 'react';
import useSWR from 'swr';
import { useUser } from '../../utils/auth/useUser';
import { FIRESTORE_HELPER } from '../Timestamp';
import User from '../User';

const storage = firebase.storage();

export default function Photo(props) {
  const [previewVisible, setPreviewVisible] = useState(false);

  const { data, isValidating } = useSWR(
    ['loadPhoto', props.refURL],
    async (op, refURL) => {
      return storage.ref(refURL).getDownloadURL();
    },
  );

  return (
    <div>
      <div
        onClick={() => {
          setPreviewVisible(true);
        }}
      >
        <img src={data} width={props.width || 120} />
      </div>

      <Modal
        visible={previewVisible}
        title={props.fileName}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        destroyOnClose
      >
        <img alt={props.fileName} style={{ width: '100%' }} src={data} />
      </Modal>
    </div>
  );
}
