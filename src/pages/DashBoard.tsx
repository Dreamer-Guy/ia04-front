// src/pages/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { authClient } from '../services/authService';
import { useAuth } from '../context/AuthProvider';
import { LogOut, User as UserIcon, Mail, Calendar } from "lucide-react";
import toast from 'react-hot-toast';

export default function Dashboard() {
    const QUERY_KEY = 'me';
    const { logout,user } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => authClient.me().then(r => r.data),
        retry: 1,
    });

    const logOutSubmit=()=>{
        logout().then()
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        User Dashboard
                    </h2>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all hover:cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-gray-500 text-center">Loading user data...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">Error fetching user</p>
                ) : user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                                <p className="text-sm text-gray-500">User ID: {user._id}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span>Joined on: {user?.createdAt}</span>
                            </div>
                        </div>

                        
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No user data available</p>
                )}
            </div>
        </div>
    );

}
