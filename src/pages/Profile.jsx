import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUserDispatch } from '../context/UserContext';
import { GoCheckCircle, GoCheckCircleFill } from 'react-icons/go';
import IMAGE_PROFILE from '../img/img_profile.png';

export default function Profile() {
  const [nickName, setNickName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(
    localStorage.getItem('imageUrl') || IMAGE_PROFILE
  );

  const fileInput = useRef(null);

  const navigate = useNavigate();

  const { checkNameDuplication, nameDuplicated } = useUserDispatch();

  // 1️⃣ 처음에 보여줄 기본 유저 정보
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const nickName = localStorage.getItem('nickName');
        const email = localStorage.getItem('email');

        setNickName(nickName);
        setEmail(email);
      } catch (error) {
        console.error(`유저 데이터 불러오는 중 문제 발생 : ${error}`);
      }
    };

    fetchUserData();
  }, []);

  // 2️⃣ 이미지 파일 업로드
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
          // ▶ 파일 업로드 후 바로 서버로 전송
          uploadImage();
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 3️⃣ 프로필 이미지 저장하기
  const uploadImage = async () => {
    const URL = 'http://localhost:8080/auth/change-profile';

    try {
      const formData = new FormData();
      formData.append('file', fileInput.current.files[0]);

      await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('에러 내용:', error);
    }
  };

  // 4️⃣ 닉네임 유효성 검사
  const handleNameChange = (e) => {
    setNickName(e.target.value);
    if (!e.target.value.match(/^[가-힣]{2,}|[A-Za-z]{3,}$/)) {
      setNameError('한글은 최소 2글자, 영문은 최소 3글자 이상 입력하세요');
    } else {
      setNameError(false);
    }
  };

  // 5️⃣ 닉네임 저장하기
  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = 'http://localhost:8080/auth/change-nickname';

    try {
      if (nameDuplicated === false) {
        await axios
          .post(
            URL,
            { nickName: nickName },
            {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          )
          .then((result) => {
            console.log(`닉네임 재설정 성공 : ${result}`);
            window.alert('닉네임을 재설정 했습니다');
          });

        navigate('/mypage');
      }
    } catch (error) {
      console.error('닉네임 저장 중 에러 발생:', error);
    }
  };

  return (
    <section className="w-full h-screen bg-white">
      <div
        className="absolute top-5 left-42 ml-4 border-2 w-10 h-10 transition ease-in-out delay-150 bg-main hover:bg-indigo-500 hover:scale-125 hover:cursor-pointer hover:text-white rounded-full flex items-center justify-center"
        onClick={() => navigate('/mypage')}
      >
        <FaArrowLeft />
      </div>

      <header className="mt-20 font-semibold font-score text-2xl text-center">
        나의 프로필 수정
      </header>

      <main className="mt-6 text-center">
        <div className="relative inline-block rounded-full bg-gray-200 h-32 w-32">
          <img
            src={image}
            alt="프로필 사진"
            className="rounded-full h-32 w-32 object-cover border-2"
          />
          <input
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            onChange={handleImageChange}
            ref={fileInput}
            className="rounded-full absolute inset-0 w-full h-full opacity-0 cursor-pointer hover:opacity-50 duration-200 ease-out transition-opacity bg-gray-500"
          />
        </div>

        <form className="flex flex-col mt-8 mx-10" onSubmit={handleSubmit}>
          {/* 이메일 박스 */}
          <div className="flex-grow mr-3 mb-4">
            <label
              className="font-score block text-black-300 text-lg font-bold mb-2 text-start"
              htmlFor="email"
            >
              연결된 이메일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              readOnly
            />
          </div>

          {/* 닉네임 박스 */}
          <div className="flex-grow mr-3 mb-2">
            <label
              className="font-score block text-black-300 text-lg font-bold mb-2 text-start"
              htmlFor="nickName"
            >
              닉네임
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nickName"
              type="text"
              value={nickName}
              onChange={handleNameChange}
            />
            {nameError ? (
              <p className="text-red-500 text-xs italic">{nameError}</p>
            ) : (
              <p className="text-red-500 text-xs italic invisible">nameError</p>
            )}
          </div>

          <p className="mt-6">
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="check" className="flex">
                {!nameDuplicated ? (
                  <GoCheckCircleFill className="text-emerald" />
                ) : (
                  <GoCheckCircle className="text-emerald" />
                )}
              </span>{' '}
              <span className="ml-3">닉네임 중복 확인 : 사용 가능</span>
            </li>
          </p>

          {/* 버튼 */}
          <div className="flex mt-2 mr-3">
            <button
              type="button"
              className="font-score flex-grow bg-main text-white rounded-2xl p-4 mr-2 hover:bg-yellow-500"
              onClick={() => checkNameDuplication(nickName)}
            >
              닉네임 중복 확인
            </button>
            <button
              type="submit"
              className="font-score flex-grow bg-main text-white rounded-2xl p-2 hover:bg-yellow-500"
            >
              닉네임 저장하기
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}
