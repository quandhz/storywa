import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Popover,
  Row,
  Space,
} from 'antd';
import Link from 'next/link';
import { useUser } from '../../utils/auth/useUser';

const { Header, Content, Footer } = Layout;

export default function PageHeader() {
  const { user, logout } = useUser();
  const screens = Grid.useBreakpoint();

  if (!user) {
    return null;
  }

  return (
    <Header>
      <Row gutter={16}>
        <Col flex={1}>
          {screens.md && (
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys="1">
              <Menu.Item key="1">
                <Link href={'/'}>Home</Link>
              </Menu.Item>
            </Menu>
          )}
        </Col>
        <Col>
          <Dropdown
            trigger="click"
            overlay={
              <Menu
                onClick={({ key }) => {
                  if (key === 'logout') {
                    logout();
                  }
                }}
              >
                <Menu.Item key="home">Home</Menu.Item>
                <Menu.Item key="logout">Log out</Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Button type="text">
              {user.displayName ? (
                <Space>
                  <Avatar src={user.photoURL} />
                  {screens.md && (
                    <div style={{ color: 'white' }}>{user.displayName}</div>
                  )}
                </Space>
              ) : (
                <div style={{ color: 'white' }}>
                  {user.email ? <span>Email: {user.email}</span> : 'Guest'}
                </div>
              )}
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}
