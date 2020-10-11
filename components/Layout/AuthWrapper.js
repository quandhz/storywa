import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../../utils/auth/useUser';

const AuthWrapper = ({ children: Component }) => {
  const { user } = useUser();

  if (!user) {
    return (
      <>
        <p>Hi there!</p>
        <p>
          You are not signed in.{' '}
          <Link href={'/auth'}>
            <a>Sign in</a>
          </Link>
        </p>
      </>
    );
  }

  return <Component {...props} />;
};

export default AuthWrapper;
