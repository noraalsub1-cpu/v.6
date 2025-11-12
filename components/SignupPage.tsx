import React, { useState } from 'react';
import { GoogleIcon } from './Icons';
import type { DetailsViewType } from '../types';

interface SignupPageProps {
    onSignup: () => void;
    onNavigateToLogin: () => void;
    onShowDetails: (viewType: DetailsViewType) => void;
    onNavigateToIntro: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin, onShowDetails, onNavigateToIntro }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (password !== confirmPassword) {
            setPasswordError('كلمتا المرور غير متطابقتين');
            return;
        }

        if (!termsAccepted) {
            // This is handled by disabling the button, but as a fallback
            return;
        }
        
        onSignup();
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
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">أنشئ حسابك الجديد</h2>
                 <p className="text-center text-gray-600 mb-8">وابدأ رحلتك نحو تعلم أذكى اليوم.</p>
            </div>

            <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="fullName" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">الاسم الكامل</label>
                        <input id="fullName" type="text" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="أحمد الغامدي" />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">البريد الإلكتروني</label>
                        <input id="email" type="email" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="example@email.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">كلمة المرور</label>
                        <input 
                            id="password" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" 
                            placeholder="••••••••" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 tracking-wide block text-right mb-2">تأكيد كلمة المرور</label>
                        <input 
                            id="confirmPassword" 
                            type="password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full text-base py-3 px-4 border rounded-lg focus:outline-none focus:border-teal-500 text-right ${passwordError ? 'border-red-500' : 'border-gray-300'}`} 
                            placeholder="••••••••" />
                        {passwordError && <p className="text-red-500 text-xs mt-1 text-right">{passwordError}</p>}
                    </div>
                    <div className="flex items-center">
                        <input 
                            id="terms" 
                            type="checkbox" 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded ml-2" 
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            أوافق على 
                            <button 
                                type="button" 
                                onClick={() => onShowDetails('termsAndConditions')} 
                                className="text-teal-600 hover:underline font-semibold mx-1"
                            >
                                الشروط والأحكام
                            </button>
                        </label>
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            disabled={!termsAccepted}
                            className="w-full flex justify-center bg-teal-500 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            إنشاء الحساب
                        </button>
                    </div>
                </form>
                <div className="flex items-center my-6">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <div className="px-3 text-gray-500">أو</div>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>
                <div>
                     <button onClick={onSignup} aria-label="Sign up with Google" className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <GoogleIcon className="w-6 h-6" />
                        <span className="mr-3 font-semibold text-gray-700">التسجيل باستخدام جوجل</span>
                    </button>
                </div>
            </div>
             <div className="mt-6 text-center">
                <p className="text-gray-600">
                    لديك حساب بالفعل؟ <button onClick={onNavigateToLogin} className="text-teal-600 font-semibold hover:underline">تسجيل الدخول</button>
                </p>
            </div>
            <div className="mt-8 text-center text-xs text-gray-400">
                <p>© جميع الحقوق محفوظة لمؤسسة الأنظمة التقنية الذكية</p>
            </div>
        </div>
    );
};