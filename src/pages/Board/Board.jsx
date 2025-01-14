import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { handleError } from '../../utils/common';
import axios from 'axios';
import RecipeCard from '../../components/Board/RecipeCard';
import SearchBar from '../../components/Board/SearchBar';
import WriteButton from '../../components/Board/WriteButton';
import RankingContainer from '../../components/Board/RankingContainer';
import ScrollToTopButton from '../../components/Global/ScrollToTopButton';
import useScrollToTop from '../../hooks/useScrollToTop';
import Footer from '../../components/Global/Footer';

export default function Board() {
  const [recipes, setRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { showScrollToTop, scrollToTop } = useScrollToTop();

  const location = useLocation();
  const observer = useRef();

  const recipesPerPage = 6;

  const accessToken = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchLikedPosts();
    fetchTotalRecipes();
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
  }, [location.pathname, accessToken]);

  useEffect(() => {
    setRecipes([]);
    fetchRecipesByPage(currentPage);
  }, [currentPage]);

  const fetchLikedPosts = async () => {
    if (!accessToken) return;

    const URL = `/board/islike?id=${email}`;
    try {
      const response = await axios.get(URL, {
        headers: {
          'Authorization-Access': accessToken,
        },
      });

      if (response.data) {
        const posts = response.data.map(Number);
        setLikedPosts(posts);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTotalRecipes = async () => {
    try {
      const response = await axios.get(`/board/total`);
      const totalRecipes = response.data;
      const totalPages = Math.ceil(totalRecipes / recipesPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchRecipesByPage = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`/board/page`, {
        params: { data: pageNumber.toString() },
      });

      if (response.data && Array.isArray(response.data.items)) {
        const formattedData = response.data.items.map((item) => ({
          id: item.ID,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          likeCount: item.likeCount,
        }));
        setRecipes(formattedData);
      } else {
        console.log('배열이 아닙니다', response.data);
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSearching) {
      setTotalPages(Math.ceil(searchResultCount / recipesPerPage));
    } else {
      fetchTotalRecipes();
    }
  }, [searchResultCount, isSearching, recipesPerPage]);

  const handleSearch = (results) => {
    setSearchResults(results);
    setIsSearching(true);
    setSearchResultCount(results.length);
    setCurrentPage(1);
    if (results.length <= recipesPerPage) {
      setTotalPages(1);
    }
  };

  const lastRecipeElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <main className="Board pb-24">
      <header className="bg-white px-6 py-7">
        <h1 className="font-scoreExtrabold font-extrabold text-3xl">
          레시피 게시판
        </h1>
      </header>
      <section className="flex items-center mx-6">
        <SearchBar onSearch={handleSearch} />
        <WriteButton />
      </section>
      <section>
        {isSearching ? (
          <div className="my-2 mt-4">
            <h2 className="font-scoreExtrabold font-extrabold ml-6 text-2xl">
              검색 결과
            </h2>
            {searchResults.map((recipe, index) => (
              <RecipeCard
                ref={
                  searchResults.length === index + 1
                    ? lastRecipeElementRef
                    : null
                }
                key={`${recipe.id}-${index}`}
                postId={recipe.id}
                title={recipe.title}
                description={recipe.description}
                img={recipe.imageUrl}
                initialLikeCount={recipe.likeCount}
                isLiked={likedPosts.includes(Number(recipe.id))}
              />
            ))}
          </div>
        ) : (
          <>
            <RankingContainer />
            <div className="my-2">
              <h2 className="font-scoreExtrabold font-extrabold ml-6 text-2xl">
                레시피
              </h2>
              {recipes.map((recipe, index) => (
                <RecipeCard
                  ref={
                    recipes.length === index + 1 ? lastRecipeElementRef : null
                  }
                  key={`${recipe.id}-${index}`}
                  postId={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  img={recipe.imageUrl}
                  initialLikeCount={recipe.likeCount}
                  isLiked={likedPosts.includes(Number(recipe.id))}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <ScrollToTopButton
        showScrollToTop={showScrollToTop}
        scrollToTop={scrollToTop}
      />
      <Footer />
    </main>
  );
}
