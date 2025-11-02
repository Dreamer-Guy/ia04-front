const REFRESH_KEY = 'app_refresh_token';

const TokenUtils = {
    setRefreshToken(token: string) {
        localStorage.setItem(REFRESH_KEY, token);   
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_KEY);
    },

    clearRefreshToken() {
        localStorage.removeItem(REFRESH_KEY);
    }
};

export default TokenUtils;
