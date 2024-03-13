import React, { useEffect } from 'react';
import { useUserState, useUserDispatch } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginSuccess() {
  const user = useUserState();

  const { dispatch } = useUserDispatch();

  const navigate = useNavigate();

  const SET_USER = 'SET_USER';

  useEffect(() => {
    const fetchLoginData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const email = urlParams.get('email');
      const socialId = urlParams.get('socialId');
      const socialType = urlParams.get('socialType');
      const imageUrl = urlParams.get('imageUrl');

      // ▶ 4개 데이터 받아왔는지 판단
      if (accessToken && email && socialType && socialId && imageUrl) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('email', email);
        localStorage.setItem('socialId', socialId);
        localStorage.setItem('socialType', socialType);
        localStorage.setitem('imageUrl', imageUrl);

        console.log(`⭕ 로컬스토리지 저장 완료 : ${localStorage}`);

        // ▶ 유저 데이터 저장
        let user = {
          accessToken: localStorage.getItem('accessToken'),
          email: localStorage.getItem('email'),
          uid: localStorage.getItem('socialId'),
          socialType: localStorage.getItem('socialType'),
          imageUrl: localStorage.getItem('imageUrl'),
        };

        console.log(`⭕ 유저 데이터 저장 완료 : ${user}`);

        // ▶ dispatch로 리듀서에 저장
        dispatch({ type: SET_USER, user });

        return user;
      } else {
        // ▶ 데이터가 하나라도 모자라면 발생
        console.log('❌ 서버에서 데이터 받는 중 문제 발생');
        window.alert('❌ 서버에서 데이터 받는 중 문제 발생');
      }
    };

    fetchLoginData()
      .then((user) => {
        if (user) {
          console.log(`⭕ 유저 데이터 컨텍스트에 저장 완료 : ${user}`);
          navigate('/main'); // ▶ 메인페이지 리디렉션
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <section>
      {user ? (
        <div className="flex flex-col justify-center items-center font-score space-y-3">
          <h1 className="text-3xl font-bold">메인페이지로 이동합니다</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center font-score space-y-3">
          <h1 className="text-3xl font-bold">
            ❌ 콘솔과 네트워크에서 문제를 확인하세요
          </h1>
        </div>
      )}
    </section>
  );
}
