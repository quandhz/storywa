import { UploadOutlined } from '@ant-design/icons';
import {
  Collapse,
  Space,
  Button,
  Card,
  Form,
  Input,
  message,
  Upload,
  Typography,
  DatePicker,
  TimePicker,
  Timeline,
} from 'antd';
import { ITEMS } from '../../apis/items';
import { useUser } from '../../utils/auth/useUser';

const Component = (props) => {
  const { user, logout } = useUser();
  console.log('CreateItem props', props);

  const handleFinish = async ({ date, ...data }) => {
    console.log('handleFinish data, user', data, user);

    const payload = data;

    if (date) {
      payload.date = date.toISOString();
    }

    return ITEMS.create(props.storyId, payload, user).then(() => {
      message.success('Item created successfully');
    });
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const handlePreview = async (file) => {
    console.log('file', file);
  };

  return (
    <Form name="addItem" layout="inline" onFinish={handleFinish}>
      <Form.Item
        name="date"
        label="Date"
        rules={[
          {
            required: true,
            message: 'Please input date!',
          },
        ]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item label="Title" name="title">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Component;
