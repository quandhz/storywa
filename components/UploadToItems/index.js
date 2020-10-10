import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, message, Upload } from 'antd';
import { useState } from 'react';
import { customRequest } from '../../libs/firebaseStorage';
import { useUser } from '../../utils/auth/useUser';

const Component = (props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useUser();

  if (!user) return null;

  return (
    <Upload
      name={props.itemId}
      multiple
      showUploadList={false}
      customRequest={customRequest(
        'itemFiles',
        props.storyId,
        props.itemId,
        user.id,
      )}
      onChange={(info) => {
        setUploading(true);
        setProgress(Math.floor(info.file.percent));

        if (info.file.status !== 'uploading') {
          console.log('uploading', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          setUploading(false);
          setProgress(0);
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          setUploading(false);
          setProgress(0);
          message.error(`${info.file.name} file upload failed.`);
        }
      }}
    >
      <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}>
        {uploading ? progress + '%' : 'Upload to ' + props.date}
      </Button>
    </Upload>
  );
};

export default Component;
