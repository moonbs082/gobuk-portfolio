import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { supabase } from '../../lib/supabase.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';
import { isInIntroFrame } from '../../utils/site-intro-flow.js';

const PROVIDERS = [
  { id: 'kakao', label: '카카오로 계속하기', icon: <ChatBubbleIcon />, sx: { bgcolor: '#FEE500', color: '#191919', '&:hover': { bgcolor: '#f2d900' } } },
  { id: 'google', label: 'Google로 계속하기', icon: <GoogleIcon />, sx: { bgcolor: 'common.white', color: 'text.primary', border: 1, borderColor: 'grey.300', '&:hover': { bgcolor: 'grey.100' } } },
  { id: 'github', label: 'GitHub로 계속하기', icon: <GitHubIcon />, sx: { bgcolor: '#24292f', color: 'common.white', '&:hover': { bgcolor: '#000000' } } },
];

/**
 * SocialLoginButtons 컴포넌트 - SNS 로그인 버튼 묶음 (카카오 / 구글 / 깃허브)
 *
 * Props:
 * @param {function} onError - 오류 메시지 전달 [Required]
 *
 * Example usage:
 * <SocialLoginButtons onError={ setErrorMessage } />
 */
function SocialLoginButtons({ onError }) {
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleLogin = async (provider) => {
    setLoadingProvider(provider);
    onError('');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        /** SNS 로그인 페이지는 iframe 안에서 열리지 않으므로, 인트로 iframe 안이면 창 전체를 이동시킨다 */
        skipBrowserRedirect: isInIntroFrame,
      },
    });
    if (error) {
      onError(toKoreanErrorMessage(error));
      setLoadingProvider('');
      return;
    }
    if (isInIntroFrame && data?.url) {
      window.top.location.href = data.url;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      { PROVIDERS.map((provider) => (
        <Button
          key={ provider.id }
          fullWidth
          size="large"
          startIcon={ provider.icon }
          disabled={ Boolean(loadingProvider) }
          onClick={ () => handleLogin(provider.id) }
          sx={ provider.sx }
        >
          { loadingProvider === provider.id ? '이동 중...' : provider.label }
        </Button>
      )) }
    </Box>
  );
}

export default SocialLoginButtons;
