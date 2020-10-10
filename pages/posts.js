import { Menu } from 'antd';
import Link from 'next/link';
import CreatePost from '../components/CreatePost';

export default function Posts() {
  return (
    <div>
      <Link href={'/'}>Back Home</Link>
      <br />
      <CreatePost />
    </div>
  );
}
