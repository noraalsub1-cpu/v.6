import React, { useState } from 'react';
import { SummaryIcon, FlashcardIcon, QuizIcon, ChatIcon, UploadIcon, CloseIcon, CheckCircleIcon, DocumentIcon, YoutubeIcon, PowerpointIcon, FileWordIcon, BookOpenIcon, ArrowDownIcon, GlossaryIcon, SolutionsIcon, GraduationCapIcon, DownloadIcon } from './Icons';
import type { DetailsViewType } from '../types';

interface IntroductionProps {
  onNavigateToUpload: () => void;
  onShowDetails: (viewType: DetailsViewType) => void;
  onNavigateToMaterials: () => void;
  onNavigateToStandardizedTests: () => void;
  onContactClick: () => void;
}

const FeatureListItem: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-3 space-x-reverse">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
    </div>
);


export const Introduction: React.FC<IntroductionProps> = ({ onNavigateToUpload, onShowDetails, onNavigateToMaterials, onNavigateToStandardizedTests, onContactClick }) => {
  
  return (
    <div className="p-10 pb-24 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">مرحباً بك في <span className="text-teal-500">مساعدي الذكي</span></h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">منصتك التعليمية المتكاملة التي تقدم لك تجربة تعليمية مدعومة بالذكاء الاصطناعي</p>
        </div>

        <div className="space-y-20">
            {/* Service 1: Study Materials */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                   <div className="bg-white p-6 rounded-2xl shadow-xl border w-full max-w-sm flex flex-col">
                        <h3 className="text-center font-bold text-gray-700 mb-4">مكتبة الدروس الجاهزة</h3>
                        <div className="flex flex-wrap justify-center items-center gap-2 mb-4 text-xs">
                           <span className="font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">جميع المراحل</span>
                           <span className="font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">الفصل الأول والثاني</span>
                           <span className="font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">بحث سهل وسريع</span>
                        </div>
                        <div className="space-y-2 flex-grow relative">
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">القرآن الكريم</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">التوحيد</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">الرياضيات</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">الفيزياء</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">الكيمياء</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">الأحياء</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg flex items-center"><BookOpenIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">التاريخ</span></div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-1">
                                <span className="text-xs font-bold text-gray-500">والمزيد...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <span className="text-sm font-bold text-teal-500 uppercase tracking-wider">الميزة الأولى</span>
                    <h2 className="text-3xl font-extrabold text-gray-800 mt-2 mb-4 tracking-tight">المواد الدراسية</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                       تصفح مكتبتنا الشاملة من الدروس الجاهزة والمعدة خصيصاً لطلاب المملكة. اختر المادة التي تريدها وابدأ الدراسة فوراً مع مجموعة متكاملة من الأدوات التفاعلية الذكية التي تسهل عليك الفهم والمراجعة.
                    </p>
                    <div className="space-y-4 mb-8">
                        <FeatureListItem icon={<SummaryIcon className="w-5 h-5" />} title="شرح شامل ومنظم" description="احصل على تلخيصات ونقاط رئيسية واضحة لكل درس." />
                        <FeatureListItem icon={<SolutionsIcon className="w-5 h-5" />} title="حلول تمارين الدرس" description="استعرض حلولاً نموذجية للتمارين والأسئلة الموجودة في الدرس." />
                        <FeatureListItem icon={<FlashcardIcon className="w-5 h-5" />} title="بطاقات مراجعة ذكية" description="حوّل المفاهيم الهامة إلى بطاقات تفاعلية لسهولة الحفظ." />
                        <FeatureListItem icon={<QuizIcon className="w-5 h-5" />} title="اختبارات تفاعلية" description="اختبر فهمك للمادة بعد كل درس بأسئلة متنوعة." />
                        <FeatureListItem icon={<ChatIcon className="w-5 h-5" />} title="مساعد ذكي للأسئلة" description="اطرح أي سؤال حول الدرس واحصل على إجابة فورية." />
                    </div>
                     <button onClick={onNavigateToMaterials} className="inline-flex items-center bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-transform transform hover:scale-105 shadow-lg hover:shadow-teal-500/30">
                        <BookOpenIcon className="w-5 h-5 ml-2"/>
                        <span>ابدأ الآن بتصفح المواد الدراسية</span>
                    </button>
                </div>
            </div>

            {/* Service 2: Standardized Tests */}
            <div className="grid md:grid-cols-2 gap-12 items-center pt-10">
                <div className="order-2 md:order-1">
                    <span className="text-sm font-bold text-teal-500 uppercase tracking-wider">الميزة الثانية</span>
                    <h2 className="text-3xl font-extrabold text-gray-800 mt-2 mb-4 tracking-tight">الاختبارات المعيارية</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        استعد بكفاءة للاختبارات الوطنية الهامة. توفر لك منصتنا أدوات تدريب ذكية ومخصصة، حيث يمكنك توليد أسئلة تدريبية لا نهائية، أو رفع كتبك الخاصة لتحويلها لمواد تفاعلية، أو تحميل ملخصاتنا الجاهزة.
                    </p>
                    <div className="space-y-4 mb-8">
                        <FeatureListItem icon={<QuizIcon className="w-5 h-5" />} title="توليد أسئلة لا نهائي" description="تدرب على عدد غير محدود من الأسئلة لكل مهارة." />
                        <FeatureListItem icon={<UploadIcon className="w-5 h-5" />} title="حوّل كتبك إلى تجربة تفاعلية" description="ارفع كتب وملازم التحضير الخاصة بك بصيغة PDF وحوّلها إلى مواد تفاعلية غنية بالأدوات الذكية." />
                        <FeatureListItem icon={<DownloadIcon className="w-5 h-5" />} title="كتب وملخصات جاهزة" description="حمّل كتبنا وملخصاتنا الحصرية التي أعدها خبراء لمساعدتك على التحضير بفعالية." />
                        <FeatureListItem icon={<ChatIcon className="w-5 h-5" />} title="مساعد ذكي متخصص" description="مدرسك الخاص للإجابة على جميع استفساراتك حول الاختبار." />
                    </div>
                     <button onClick={onNavigateToStandardizedTests} className="inline-flex items-center bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-transform transform hover:scale-105 shadow-lg hover:shadow-teal-500/30">
                        <GraduationCapIcon className="w-5 h-5 ml-2"/>
                        <span>استكشف الاختبارات المعيارية</span>
                    </button>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                    <div className="bg-white p-4 rounded-2xl shadow-xl border w-full max-w-md flex flex-col">
                        <div className="flex items-center justify-center mb-4 w-full">
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-full shadow-inner">
                                <GraduationCapIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-center font-bold text-gray-800 mr-3 text-lg">استعد للاختبارات الوطنية</h3>
                        </div>
                        <div className="w-full text-right space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-gray-800 text-base mb-2">اختبار القدرات</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-teal-700 text-sm mb-2">القسم اللفظي:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {['التناظر اللفظي', 'إكمال الجمل', 'الخطأ السياقي', 'استيعاب المقروء'].map(skill => (
                                                <span key={skill} className="font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <p className="font-semibold text-teal-700 text-sm mb-2">القسم الكمي:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {['الجبر', 'الهندسة', 'الحساب', 'التحليل والإحصاء'].map(skill => (
                                                <span key={skill} className="font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-gray-800 text-base mb-2">اختبار التحصيلي (علمي)</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-teal-700 text-sm mb-2">المواد:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء'].map(skill => (
                                                <span key={skill} className="font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Service 3: Smart Assistant */}
            <div className="grid md:grid-cols-2 gap-12 items-center pt-10">
                <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border w-full max-w-sm">
                        <h3 className="text-center font-bold text-gray-700 mb-4">ارفع ملفاتك واحصل على أدوات ذكية</h3>
                         <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                            <div className="flex flex-col items-center space-y-2 group">
                                <div className="p-4 bg-red-100 text-red-600 rounded-xl transition-transform transform group-hover:scale-110 shadow-sm"><DocumentIcon className="w-8 h-8"/></div>
                                <span className="text-xs font-semibold text-gray-600">PDF</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 group">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl transition-transform transform group-hover:scale-110 shadow-sm"><FileWordIcon className="w-8 h-8"/></div>
                                <span className="text-xs font-semibold text-gray-600">Word</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 group">
                                <div className="p-4 bg-orange-100 text-orange-600 rounded-xl transition-transform transform group-hover:scale-110 shadow-sm"><PowerpointIcon className="w-8 h-8"/></div>
                                <span className="text-xs font-semibold text-gray-600">PowerPoint</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 group">
                                <div className="p-4 bg-red-100 text-red-600 rounded-xl transition-transform transform group-hover:scale-110 shadow-sm"><YoutubeIcon className="w-8 h-8"/></div>
                                <span className="text-xs font-semibold text-gray-600">YouTube</span>
                            </div>
                        </div>
                        <div className="flex justify-center my-4">
                            <ArrowDownIcon className="w-8 h-8 text-gray-300"/>
                        </div>
                        <div className="space-y-2">
                           <div className="bg-gray-50 p-3 rounded-lg flex items-center"><SummaryIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">شرح</span></div>
                           <div className="bg-gray-50 p-3 rounded-lg flex items-center"><FlashcardIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">بطاقات مراجعة</span></div>
                           <div className="bg-gray-50 p-3 rounded-lg flex items-center"><QuizIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">اختبار تفاعلي</span></div>
                           <div className="bg-gray-50 p-3 rounded-lg flex items-center"><GlossaryIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">قاموس المصطلحات</span></div>
                           <div className="bg-gray-50 p-3 rounded-lg flex items-center"><ChatIcon className="w-5 h-5 text-gray-500 ml-3"/> <span className="text-sm font-semibold text-gray-600">المساعد الذكي</span></div>
                        </div>
                    </div>
                </div>
                 <div>
                    <span className="text-sm font-bold text-teal-500 uppercase tracking-wider">الميزة الثالثة</span>
                    <h2 className="text-3xl font-extrabold text-gray-800 mt-2 mb-4 tracking-tight">المساعد الذكي</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        ارفع أي ملف دراسي لديك، سواء كان PDF، Word، أو حتى رابط فيديو من يوتيوب، ودع مساعدنا الذكي يقوم بالباقي. في لحظات، ستحصل على مجموعة متكاملة من الأدوات التفاعلية التي تساعدك على الفهم والحفظ والمراجعة بفعالية لا مثيل لها.
                    </p>
                    <div className="space-y-4 mb-8">
                        <FeatureListItem icon={<SummaryIcon className="w-5 h-5" />} title="شروحات وافية" description="حوّل المواد المعقدة إلى شروحات سهلة الفهم ومنظمة." />
                        <FeatureListItem icon={<FlashcardIcon className="w-5 h-5" />} title="إنشاء بطاقات مراجعة" description="حوّل المعلومات تلقائيًا إلى بطاقات مراجعة للمذاكرة السريعة." />
                        <FeatureListItem icon={<QuizIcon className="w-5 h-5" />} title="توليد اختبارات تفاعلية" description="أنشئ اختبارات مخصصة من محتواك لتقييم فهمك." />
                        <FeatureListItem icon={<GlossaryIcon className="w-5 h-5" />} title="بناء قاموس للمصطلحات" description="احصل على قائمة بالمصطلحات الهامة وتعاريفها من المادة." />
                        <FeatureListItem icon={<ChatIcon className="w-5 h-5" />} title="مساعد ذكي متخصص" description="اطرح أي سؤال حول المادة واحصل على إجابة فورية." />
                    </div>
                    <button onClick={onNavigateToUpload} className="inline-flex items-center bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-transform transform hover:scale-105 shadow-lg hover:shadow-teal-500/30">
                        <UploadIcon className="w-5 h-5 ml-2"/>
                        <span>ابدأ الآن مع المساعد الذكي</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="text-center my-12 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">اتصل بنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">هل لديك سؤال آخر أو اقتراح؟ يسعدنا أن نسمع منك!</p>
            <button
                onClick={onContactClick}
                className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-transform transform hover:scale-105"
            >
                تواصل معنا
            </button>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center space-x-4 space-x-reverse">
                <button
                    onClick={() => onShowDetails('privacyPolicy')}
                    className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
                >
                    سياسة الخصوصية
                </button>
                <span className="text-gray-400">|</span>
                <button
                    onClick={() => onShowDetails('termsAndConditions')}
                    className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
                >
                    الأحكام والشروط
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-8">
                © جميع الحقوق محفوظة لمؤسسة الأنظمة التقنية الذكية
            </p>
        </div>

      </div>

    </div>
  );
};