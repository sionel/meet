import { useEffect } from 'react';
import { useQueries } from 'react-query';

const useCheckVersionAndNoti = (majorVersion: number) => {
  const result = useQueries([
    { queryFn: () => {}, queryKey: ['video', 'version'] },
    { queryFn: () => {}, queryKey: ['video', 'noti'] },
  ]);
  return [];
};

export default {};
