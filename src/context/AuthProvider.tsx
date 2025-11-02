// src/context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '../services/authService';
import TokenUtils from '../utils/token';
import { setAccessToken } from '../api/axios';
import { useNavigate } from 'react-router-dom';

type User = { _id: string; email: string; name?: string, createdAt: string } | null;

interface AuthContextValue {
    user: User;
    register: (data: { name: string; email: string; password: string, confirmPassword: string }) => Promise<any>;
    login: (data: { email: string; password: string }) => Promise<any>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMut = useMutation({
        mutationFn: (data: { email: string; password: string }) => authClient.login(data),
        onSuccess: (res) => {
            const { accessToken, refreshToken, user } = res.data;
            setAccessToken(accessToken);
            TokenUtils.setRefreshToken(refreshToken);
            setUser(user);
            queryClient.invalidateQueries();
        },
    });

    const registerMut = useMutation({
        mutationFn: (data: { name: string; email: string; password: string, confirmPassword: string }) =>
            authClient.register(data),
        onSuccess: (res) => {
            const { accessToken, refreshToken, user } = res.data;
            setAccessToken(accessToken);
            TokenUtils.setRefreshToken(refreshToken);
            setUser(user);
            queryClient.invalidateQueries();
        },
    });

    const logout = async () => {
        const refresh = TokenUtils.getRefreshToken();
        try {
            await authClient.logout(refresh);
        } catch (e) { }
        setAccessToken(null);
        TokenUtils.clearRefreshToken();
        setUser(null);
        queryClient.clear();
    };


    useEffect(() => {
        const tryRestore = async () => {
            const refresh = TokenUtils.getRefreshToken();
            console.log("Trying to restore session with refresh token:", refresh);
            if (!refresh) return;
            try {
                const res = await authClient.refresh(refresh);
                const { accessToken } = res.data;
                console.log("Obtained new access token:", accessToken);
                setAccessToken(accessToken);
                const { user } = await authClient.me().then(r => r.data);
                console.log("Restored user:", user);
            
                setUser(user);
            } catch (e) {
                TokenUtils.clearRefreshToken();
                setAccessToken(null);
                setUser(null);
                navigate('/login');
            }
        };
        tryRestore();
    }, [navigate]);

    return (
        <AuthContext.Provider value={{
            user,
            register: (data) => registerMut.mutateAsync(data),
            login: (data) => loginMut.mutateAsync(data),
            logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    console.log("AuthContext:", ctx?.isAuthenticated);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
