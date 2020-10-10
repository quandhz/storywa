import { PlusOutlined } from '@ant-design/icons';
import {
  Collapse,
  Space,
  Button,
  Card,
  Form,
  Input,
  message,
  Typography,
} from 'antd';
import { STORIES } from '../../apis/stories';
import { useUser } from '../../utils/auth/useUser';

const Component = (props) => {
  const { user, logout } = useUser();

  const handleFinish = async (data) => {
    console.log('handleFinish data, user', data, user);

    return STORIES.update(props.id, data, user).then(() => {
      message.success('Story updated successfully');

      props.onFinish();
    });
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const initialValues = {
    name: props.data.name,
    description: props.data.description,
  };

  return (
    <Form
      {...layout}
      name="story"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item {...tailLayout}>
        <Typography.Title level={5}>Update Story</Typography.Title>
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your story name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 7 }} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={props.onFinish}>Discard</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Component;
