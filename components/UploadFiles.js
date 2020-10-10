import { Upload, Modal, Button } from 'antd';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import EXIF from 'exif-js';
import { useUser } from '../utils/auth/useUser';
import { customRequest } from '../libs/firebaseStorage';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function UploadFiles(props) {
  const [uploaded, setUploaded] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const { user } = useUser();

  if (!user) return null;

  const handleChange = (info) => {
    console.log('info', info);

    if (info.file.status === 'done') {
      EXIF.getData(info.file.originFileObj, function () {
        var exifData = EXIF.pretty(this);
        if (exifData) {
          console.log(exifData);
          console.log(EXIF.getTag(this, 'Orientation'));
        } else {
          console.log("No EXIF data found in file '" + info.file + "'.");
        }
      });
      console.log('uploaded', info.file.response, uploaded);
      setUploaded((cur) => cur.concat(info.file.response));
    }
  };

  const handlePreview = async (file) => {
    console.log('file', file);
    if (!file.response && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.response || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
    <div>
      <Upload
        listType="picture"
        multiple
        customRequest={customRequest('files', user.id, props.postId)}
        onChange={handleChange}
        onPreview={handlePreview}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>

      <Modal
        destroyOnClose={true}
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
