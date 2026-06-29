import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useDrawerPR() {
  const [searchParams, setSearchParams] = useSearchParams();

  const prNumber = useMemo(() => {
    const value = searchParams.get('pr');
    if (!value) return null;

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const openPR = (number) => {
    const next = new URLSearchParams(searchParams);
    next.set('pr', String(number));
    setSearchParams(next);
  };

  const closePR = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('pr');
    setSearchParams(next);
  };

  return { prNumber, openPR, closePR };
}
