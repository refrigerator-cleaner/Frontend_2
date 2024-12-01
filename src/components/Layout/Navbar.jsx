import { useContext, useEffect, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationContext } from '../../context/NavbarContext';
import { PiCookingPot, PiCookingPotFill } from 'react-icons/pi';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoAccessibilityOutline, IoAccessibility } from 'react-icons/io5';
import NavbarIcon from './NavbarIcon';

export default memo(function Navbar() {
  const { selected, setSelected } = useContext(NavigationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const iconStyle = `relative mx-12 text-4xl text-main cursor-pointer hover:text-main-dark hover:scale-110 transition-all duration-300`;

  useEffect(() => {
    const currentPath = location.pathname;
    if (
      currentPath === '/board' ||
      currentPath.startsWith('/board/') ||
      currentPath === '/GptSavedList' ||
      currentPath.startsWith('/GptSavedList/')
    ) {
      setSelected('food');
    } else if (
      currentPath === '/main' ||
      currentPath.startsWith('/recipe/myRecipe')
    ) {
      setSelected('home');
    } else if (currentPath === '/login' || currentPath.startsWith('/mypage')) {
      setSelected('profile');
    }
  }, [location.pathname, setSelected]);

  return (
    <div className="sticky bottom-0 p-5 rounded-t-3xl shadow-[0px_-0.625rem_0.938rem_rgba(0,0,0,0.1)] bg-white flex justify-center items-center">
      <NavbarIcon
        iconStyle={iconStyle}
        selected={selected}
        onClick={() => {
          setSelected('food');
          navigate('/board');
        }}
        type="food"
        icon={<PiCookingPot />}
        activeIcon={<PiCookingPotFill />}
      />
      <NavbarIcon
        iconStyle={iconStyle}
        selected={selected}
        onClick={() => {
          setSelected('home');
          navigate('/main');
        }}
        type="home"
        icon={<GoHome />}
        activeIcon={<GoHomeFill />}
      />
      <NavbarIcon
        iconStyle={iconStyle}
        selected={selected}
        onClick={() => {
          setSelected('profile');
          navigate(localStorage.getItem('accessToken') ? '/mypage' : '/login');
        }}
        type="profile"
        icon={<IoAccessibilityOutline />}
        activeIcon={<IoAccessibility />}
      />
    </div>
  );
});
