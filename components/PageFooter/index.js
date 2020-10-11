import { Grid, Layout } from 'antd';
import { useUser } from '../../utils/auth/useUser';

const { Header, Content, Footer } = Layout;

export default function PageFooter() {
  const { user, logout } = useUser();
  const screens = Grid.useBreakpoint();

  if (!user) {
    return null;
  }

  return (
    <Footer style={{ textAlign: 'center' }}>
      Story © 2020 Created by Jayc
    </Footer>
  );
}
