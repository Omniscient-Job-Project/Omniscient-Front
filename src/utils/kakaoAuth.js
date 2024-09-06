// src/utils/kakaoAuth.js
import axios from 'axios';

export const loadKakaoSDK = () => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://developers.kakao.com/sdk/js/kakao.min.js"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao SDK'));
    document.head.appendChild(script);
  });
};

export const initializeKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('f53e1e3681276eccae631f96b5e1f7fe'); // 발급받은 JavaScript 키
    console.log('Kakao SDK initialized');
  }
};

export const kakaoLogin = async () => {
  return new Promise((resolve, reject) => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.login({
        success: async (authObj) => {
          console.log('로그인 성공:', authObj);
          localStorage.setItem('isLoggedIn', 'true');
          try {
            await getUserInfo();
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        fail: (err) => {
          console.error('로그인 실패:', err);
          reject(err);
        },
      });
    } else {
      alert('Kakao SDK가 초기화되지 않았습니다.');
    }
  });
};

export const kakaoLogout = async () => {
  return new Promise((resolve, reject) => {
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(async () => {
        console.log('로그아웃 성공');
        localStorage.removeItem('isLoggedIn');
        try {
          await axios.post('http://localhost:8090/api/auth/kakao/logout', {
            token: window.Kakao.Auth.getAccessToken(),
          });
          resolve();
        } catch (error) {
          console.error('서버 로그아웃 요청 실패:', error);
          reject(error);
        }
      });
    } else {
      console.log('로그아웃 실패: 액세스 토큰이 없습니다.');
      reject(new Error('로그아웃 실패: 액세스 토큰이 없습니다.'));
    }
  });
};

const getUserInfo = async () => {
  if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
    try {
      const response = await window.Kakao.API.request({
        url: '/v2/user/me',
      });
      console.log('사용자 정보:', response);

      await axios.post('http://localhost:8090/api/auth/kakao', {
        token: window.Kakao.Auth.getAccessToken(),
      });

    } catch (error) {
      console.error('사용자 정보 요청 실패:', error);
      throw error;
    }
  } else {
    console.error('사용자 정보 요청 시 Access Token이 없습니다.');
    throw new Error('Access Token이 없습니다.');
  }
};
