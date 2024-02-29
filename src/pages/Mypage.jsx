import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import axios from 'axios';
import { useUserDispatch } from '../context/User';

const RecipeCard = ({
  postid,
  title,
  description,
  img,
  isLiked,
  onToggleLike,
}) => {
  return (
    <div className="bg-white h-auto text-black ml-6 mr-6">
      <div className="flex bg-white mx-2 my-2 p-4 rounded-xl shadow">
        <Link to={`/board/${postid}`} className="flex-grow flex">
          <div className="flex-none w-20 h-20 rounded-xl border-2 border-gray-300 overflow-hidden">
            <img className="w-full h-full object-cover" src={img} alt={title} />
          </div>
          <div className="px-4">
            <h3 className="text-lg font-score font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm font-score">{description}</p>
          </div>
        </Link>
        {/* <button onClick={onToggleLike} className="p-2">
          {isLiked ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
        </button> */}
      </div>
    </div>
  );
};

function MyPage() {
  // const [recipes, setRecipes] = useState([

  //     {
  //       rank: 1,
  //       thumbnail: "https://img.khan.co.kr/lady/r/1100xX/2023/09/06/news-p.v1.20230906.8f0993f6426340fe90c978fc1352d69e.png",
  //       title: "계란말이김밥",
  //       ingredients: ["계란", "당근", "쪽파", "김"],
  //       likes: 47,
  //       description: `간단한 설명`,
  //     },

  //     {
  //       title: "Vegetable Curry",
  //       description: "potato, Lettuce",
  //       img: "",
  //       isLiked: true,
  //     },
  //     {
  //       title: "Vegetable Curry",
  //       description: "potato, Lettuce",
  //       img: "",
  //       isLiked: true,
  //     },
  //     {
  //       title: "Vegetable Curry",
  //       description: "potato, Lettuce",
  //       img: "",
  //       isLiked: true,
  //     },
  //     {
  //       title: "Vegetable Curry",
  //       description: "potato, Lettuce",
  //       img: "",
  //       isLiked: true,
  //     },
  //     {
  //       title: "Vegetable Curry",
  //       description: "potato, Lettuce",
  //       img: "",
  //       isLiked: true,
  //     },

  // ]);

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );

  const toggleLike = (recipeTitle) => {
    let newSavedRecipes;
    if (savedRecipes.includes(recipeTitle)) {
      newSavedRecipes = savedRecipes.filter((title) => title !== recipeTitle);
    } else {
      newSavedRecipes = [...savedRecipes, recipeTitle];
    }
    setSavedRecipes(newSavedRecipes);
  };

  useEffect(() => {
    if (showSavedRecipes) {
      //저장 레시피
      axios
        .get('http://localhost:3000/서버주소 ')
        .then((response) => {
          setRecipes(response.data);
        })
        .catch((error) => {
          console.error('에러 내용:', error);
        });
    } else {
      //좋아한 레시피
      axios
        .get('http://localhost:3000/서버주소')
        .then((response) => {
          setRecipes(response.data);
        })
        .catch((error) => {
          console.error('에러 내용:', error);
        });
    }
  }, [showSavedRecipes]);

 
  // 창욱 comment : 로그아웃 함수랑 회원 탈퇴 라우팅 넣어둘게요~
  const { logout } = useUserDispatch();

  return (
    <div className="Board flex items-center justify-center">
      <div className="flex flex-col items-center overflow-hidden">
        {/* 회원탈퇴, 로그아웃 */}
        <div className="flex justify-end w-full mt-2 space-x-2">
          <button
            className="font-score text-gray-300"
            onClick={(e) => {
              e.preventDefault();
              navigate('/mypage/delete-user');
            }}
          >
            회원 탈퇴
          </button>
          <button
            className="font-score outline-none font-semibold underline underline-offset-2 hover:text-red-500"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            로그아웃
          </button>
        </div>
        <div className="bg-gray-300 rounded-full h-32 w-32 mt-20">
          <img
            src={image}
            alt="프로필 사진"
            className="rounded-full h-32 w-32 object-cover"
          />
        </div>
        <h1 className="font-score mt-5 text-xl font-semibold text-center">user1</h1>
        <p className="font-score mt-4 pb-4\2 px-6 text-center">한줄 자기소개</p>
        <button
  onClick={() => navigate('/profile')}
  className="font-score my-2 bg-white text-gray-400 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 underline"
>
  회원정보 수정
</button>


        <div className="flex">
          <button
            onClick={() => setShowSavedRecipes(false)}
            className={`font-score mx-1 py-2 px-4 rounded ${
              !showSavedRecipes
                ? 'bg-main text-white'
                : 'bg-gray-100 text-black'
            }`}
          >
            좋아한 레시피 보기
          </button>
          <button
            onClick={() => setShowSavedRecipes(true)}
            className={`font-score mx-1 py-2 px-4 rounded ${
              showSavedRecipes ? 'bg-main text-white' : 'bg-gray-100 text-black'
            }`}
          >
            저장된 GPT 레시피 보기
          </button>
        </div>

        <div className="recipe-card-container" style={{ width: '120%' }}>
          {recipes
            .filter(
              (recipe) =>
                !showSavedRecipes || savedRecipes.includes(recipe.title)
            )
            .map((recipe, index) => (
              <RecipeCard
                key={index}
                id={recipe.id}
                title={recipe.title}
                description={recipe.description}
                img={recipe.thumbnail}
                isLiked={savedRecipes.includes(recipe.title)}
                onToggleLike={() => toggleLike(recipe.title)}
              />
            ))}
        </div>
      </div>
      <footer
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          maxWidth: '32rem',
        }}
      >
        <Navigation />
      </footer>
    </div>
  );
}

export default MyPage;
