import React, { useState } from 'react';
import { CloseIcon, CheckCircleIcon } from './Icons';

interface ContactModalProps {
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform animate-slide-up-fast relative">
                {isFormSubmitted ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">تم الإرسال بنجاح!</h2>
                        <p className="text-gray-600 mt-2">شكرًا لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full"
                            aria-label="إغلاق"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">تواصل معنا</h2>
                        <p className="text-center text-gray-600 mb-8">املأ النموذج أدناه وسنعاود الاتصال بك.</p>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 text-right mb-2">الاسم الكامل</label>
                                <input type="text" id="contact-name" name="name" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="أدخل اسمك الكامل" />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 text-right mb-2">البريد الإلكتروني</label>
                                <input type="email" id="contact-email" name="email" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="example@email.com" />
                            </div>
                            <div>
                                <label htmlFor="contact-subject" className="block text-sm font-bold text-gray-700 text-right mb-2">الموضوع</label>
                                <input type="text" id="contact-subject" name="subject" required className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="مثال: استفسار عن ميزة" />
                            </div>
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 text-right mb-2">رسالتك</label>
                                <textarea id="contact-message" name="message" required rows={4} className="w-full text-base py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-right" placeholder="اكتب رسالتك هنا..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                                إرسال الرسالة
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
