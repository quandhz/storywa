import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { STORIES } from '../../apis/stories';
import { useUser } from '../../utils/auth/useUser';

const AddStory = (props) => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const onSubmit = () => {
    return form
      .validateFields()
      .then((form) => STORIES.create({ ...form, createdBy: user.id }))
      .then((res) => {
        message.success('Story created successfully');
        form.resetFields();
        setCreating(false);
        router.push('/stories/' + res.id);
      })
      .catch((e) => {
        message.error(e);
      });
  };

  return (
    <div>
      <Button icon={<PlusOutlined />} type="primary" onClick={setCreating}>
        Story
      </Button>

      <Modal
        destroyOnClose
        visible={!!creating}
        layout="vertical"
        title="Create new Story"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => setCreating(false)}
        onOk={onSubmit}
      >
        <Form form={form} layout="vertical" name="story_form">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Story name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 7 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddStory;
