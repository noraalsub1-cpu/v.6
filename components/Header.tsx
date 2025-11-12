

import React, { useState, useRef, useEffect } from 'react';
import type { View } from '../types';
import { MenuIcon } from './Icons';

interface HeaderProps {
    currentView: View;
    selectedMaterialName?: string | null;
    isAuthenticated: boolean;
    userName: string;
    onSelectView: (view: View) => void;
    onLogout: () => void;
    toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, selectedMaterialName, isAuthenticated, userName, onSelectView, onLogout, toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getTitle = () => {
        switch (currentView) {
            case 'dashboard':
                return 'لوحة التحكم';
            case 'upload':
                return 'المساعد الذكي';
            case 'material':
                return selectedMaterialName || 'المادة الدراسية';
            case 'introduction':
                return '';
            case 'admin':
                return 'لوحة تحكم المدير';
            case 'settings':
                return 'إعدادات المستخدم';
            case 'materials':
                return 'المواد الدراسية';
            case 'standardizedTest':
            case 'standardizedTestLanding':
                return 'الاختبارات المعيارية';
            default:
                return 'مساعدي الذكي';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    
    const handleTitleClick = () => {
        if (currentView === 'standardizedTest') {
            onSelectView('standardizedTestLanding');
        } else if (currentView === 'material') {
            onSelectView('materials');
        }
    };

    const isTitleClickable = currentView === 'standardizedTest' || currentView === 'material';


    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center">
                 <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors ml-2" aria-label="Toggle sidebar">
                    <MenuIcon className="w-6 h-6" />
                </button>
                
                <button onClick={() => onSelectView('introduction')} className="flex items-center text-right hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 p-1">
                  <div className="bg-teal-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h1 className="text-xl font-extrabold text-gray-800 mr-2 hidden sm:block">مساعدي الذكي</h1>
                </button>
                
                {getTitle() && (
                    <>
                        <div className="w-px h-6 bg-gray-200 mx-4"></div>
                         {isTitleClickable ? (
                            <button onClick={handleTitleClick} className="text-lg font-bold text-gray-600 whitespace-nowrap hover:text-teal-600 transition-colors">
                                {getTitle()}
                            </button>
                        ) : (
                            <h1 className="text-lg font-bold text-gray-600 whitespace-nowrap">{getTitle()}</h1>
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
                {isAuthenticated ? (
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 space-x-reverse p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <span className="font-semibold text-gray-700">{userName}</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 animate-fade-in-fast">
                                <button
                                    onClick={() => {
                                        onSelectView('settings');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                                >
                                    إعدادات المستخدم
                                </button>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    تسجيل الخروج
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={() => onSelectView('login')} className="font-semibold text-gray-600 hover:text-teal-600 transition-colors">
                            تسجيل الدخول
                        </button>
                        <button onClick={() => onSelectView('signup')} className="bg-teal-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-teal-600 transition-colors">
                            إنشاء حساب
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};