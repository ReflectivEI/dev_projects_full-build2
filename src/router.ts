import { Link as WouterLink, useLocation, useRoute } from 'wouter';
import { Path, Params } from './routes';

// Export wouter Link component
export const Link = WouterLink;

// Export wouter hooks
export const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (to: Path | number, options?: { replace?: boolean; state?: any }) => {
    if (typeof to === 'number') {
      window.history.go(to);
    } else {
      setLocation(to, options);
    }
  };
};

// Wouter doesn't have useParams, so we'll create a simple version
export const useParams = <T extends Params = Params>(): Partial<T> => {
  const [, params] = useRoute('/:path*');
  return (params || {}) as Partial<T>;
};

// Export types
export type { Path, Params };
