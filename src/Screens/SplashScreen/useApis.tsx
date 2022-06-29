import { useEffect } from 'react';
import { useQueries } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const useCheckVersionAndNoti = (majorVersion: number) => {
  const { auth } = useSelector((state: RootState) => ({
    auth: state.user.auth
  }));
  debugger
  const result = useQueries([
    { queryFn: () => {}, queryKey: ['video', 'version'] },
    { queryFn: () => {}, queryKey: ['video', 'noti'] }
  ]);
  return [];
};

export default { useCheckVersionAndNoti };
