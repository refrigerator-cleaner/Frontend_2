import { toast } from 'react-toastify';
import { ERRORS } from './errorCustom';

export const emailPattern =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

export const isPasswordValid = (password) => {
  return (
    password.length >= 10 &&
    password.length <= 15 &&
    /\d/.test(password) &&
    /[!@#$%^&*]/.test(password) &&
    /[a-zA-Z]/.test(password)
  );
};

export const handleError = async (error) => {
  if (error.response && error.response.data) {
    const errorCode = Object.values(ERRORS).find(
      (val) => val.code === error.response.data.code
    );

    console.log(`에러: ${JSON.stringify(errorCode)}`);
    toast.error(errorCode.notice, {
      toastId: error.response.data.code,
    });
    return error.response.data.code;
  } else if (!error.response) {
    console.log('서버로부터 응답이 없습니다');
    toast.error('서버로부터 응답이 없습니다', {
      toastId: 'no-server-connection',
    });
  } else {
    console.log(`확인되지 않은 에러, ${error}`);
    toast.error('알 수 없는 에러가 발생했습니다', {
      toastId: 'generic-error',
    });
  }
};
