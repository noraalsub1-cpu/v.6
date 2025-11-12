import React from 'react';
import { GoogleIcon } from './Icons';

interface LoginPageProps {
    onLogin: () => void;
    onNavigateToSignup: () => void;
    onNavigateToIntro: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onNavigateToIntro }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <button onClick={onNavigateToIntro} className="w-full flex justify-center items-center mb-6 hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                     <div className="bg-teal-500 p-2 rounded-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mr-3">مساعدي الذكي</h1>
                </button>
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">مرحباً بعودتك!</h2>
                 <p className="text-center text-gray-600 mb-8">سجل الدخول للمتابعة إلى لوحة التحكم.</p>
            </div>

            <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">البريد الإلكتروني</label>
                        <input id="email" type="email" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="example@email.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">كلمة المرور</label>
                        <input id="password" type="password" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center justify-between">
                         <a href="#" className="text-xs text-teal-600 hover:underline">نسيت كلمة المرور؟</a>
                         <div className="flex items-center">
                            <input id="remember" type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded ml-2" />
                            <label htmlFor="remember" className="text-sm text-gray-600">تذكرني</label>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center bg-teal-500 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer hover:bg-teal-600 transition-colors">
                            تسجيل الدخول
                        </button>
                    </div>
                </form>
                <div className="flex items-center my-6">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <div className="px-3 text-gray-500">أو</div>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>
                <div>
                     <button onClick={onLogin} aria-label="Sign in with Google" className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <GoogleIcon className="w-6 h-6" />
                        <span className="mr-3 font-semibold text-gray-700">الدخول باستخدام جوجل</span>
                    </button>
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ليس لديك حساب؟ <button onClick={onNavigateToSignup} className="text-teal-600 font-semibold hover:underline">إنشاء حساب</button>
                </p>
            </div>
            <div className="mt-8 text-center text-xs text-gray-400">
                <p>© جميع الحقوق محفوظة لمؤسسة الأنظمة التقنية الذكية</p>
            </div>
        </div>
    );
};