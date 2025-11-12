import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { StudyMaterialView } from './components/StudyMaterialView';
import { DetailsView } from './components/DetailsView';
import { Introduction } from './components/Introduction';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Header } from './components/Header';
import { MaterialsListView } from './components/MaterialsListView';
import { Settings } from './components/Settings';
import { StandardizedTestView } from './components/StandardizedTestView';
import { StandardizedTestLandingPage } from './components/StandardizedTestLandingPage';
import { ContactModal } from './components/ContactModal';
import type { StudyMaterial, View, DetailsViewType, Lesson, Task, QuizAnalysis, User, StandardizedTestSubject, StandardizedTestScores } from './types';
import { HappyFaceIcon, SadFaceIcon, CheckCircleIcon, DocumentIcon, FlashcardIcon, QuizIcon, GraduationCapIcon } from './components/Icons';

const initialMaterialsData: StudyMaterial[] = [
  {
    id: 'mat-math-01',
    name: 'الرياضيات',
    type: 'pdf',
    lessons: [
      // Elementary (Coming Soon)
      { id: 'math-e1-s1-l1', name: 'العد حتى 10 (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'أول ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الأولى', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-e2-s1-l1', name: 'الجمع البسيط (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'ثاني ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الأولى', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-e3-s1-l1', name: 'جداول الضرب (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'ثالث ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الثانية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-e4-s1-l1', name: 'القسمة (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'رابع ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الثالثة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-e5-s1-l1', name: 'الكسور العشرية (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'خامس ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الأولى', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-e6-s1-l1', name: 'النسبة المئوية (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'سادس ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الرابعة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      // Middle School (Demo Content)
      { id: 'math-m1-s1-l1', name: 'الأعداد الصحيحة والقيمة المطلقة', content: 'الأعداد الصحيحة هي الأعداد الكاملة الموجبة والسالبة بالإضافة إلى الصفر. القيمة المطلقة للعدد هي المسافة التي يبعدها عن الصفر على خط الأعداد، وهي دائمًا قيمة موجبة أو صفر.', completed: false, academicStage: 'أول متوسط', semester: 'الفصل الأول', unit: 'الوحدة الأولى: الجبر', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-m1-s2-l1', name: 'مساحة الأشكال الهندسية', content: 'مساحة المربع = طول الضلع × نفسه. مساحة المستطيل = الطول × العرض. مساحة المثلث = نصف القاعدة × الارتفاع.', completed: false, academicStage: 'أول متوسط', semester: 'الفصل الثاني', unit: 'الوحدة الرابعة: الهندسة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-m2-s1-l1', name: 'حل المعادلات ذات الخطوتين', content: 'لحل معادلة ذات خطوتين، نبدأ أولاً بالتخلص من عملية الجمع أو الطرح، ثم نتخلص من عملية الضرب أو القسمة للوصول إلى قيمة المتغير.', completed: false, academicStage: 'ثاني متوسط', semester: 'الفصل الأول', unit: 'الوحدة الثانية: المعادلات', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-m2-s2-l1', name: 'نظرية فيثاغورس', content: 'في المثلث قائم الزاوية، مربع طول الوتر يساوي مجموع مربعي طولي الضلعين الآخرين. الصيغة هي: أ² + ب² = ج².', completed: false, academicStage: 'ثاني متوسط', semester: 'الفصل الثاني', unit: 'الوحدة الثالثة: الهندسة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-m3-s1-l1', name: 'تحليل وحيدات الحد', content: 'تحليل وحيدة الحد يعني كتابتها كحاصل ضرب أعداد أولية ومتغيرات بأس واحد. يساعد التحليل في تبسيط العبارات الجبرية.', completed: false, academicStage: 'ثالث متوسط', semester: 'الفصل الأول', unit: 'الوحدة الأولى: كثيرات الحدود', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      // High School (Demo Content)
      { id: 'math-h1-s1-l1', name: 'المنطق الرياضي والبرهان الجبري', content: 'البرهان الجبري هو طريقة لإثبات صحة التخمينات الجبرية باستخدام مجموعة من الخصائص والمسلمات. يعتمد على خطوات منطقية متسلسلة.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: التبرير والبرهان', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-h1-s2-l1', name: 'خصائص الأشكال الرباعية', content: 'متوازي الأضلاع له كل ضلعين متقابلين متطابقين ومتوازيين. المستطيل هو متوازي أضلاع زواياه قوائم. المربع هو مستطيل جميع أضلاعه متطابقة.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الثاني', unit: 'الوحدة الثالثة: الأشكال الرباعية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-h2-s1-l1', name: 'الدوال المثلثية في المثلثات قائمة الزاوية', content: 'النسب المثلثية الأساسية هي الجيب (المقابل/الوتر)، جيب التمام (المجاور/الوتر)، والظل (المقابل/المجاور).', completed: false, academicStage: 'ثاني ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الرابعة: حساب المثلثات', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'math-h3-s1-l1', name: 'المتجهات في الفضاء الثلاثي الأبعاد', content: 'يمكن تمثيل المتجه في الفضاء الثلاثي الأبعاد باستخدام الإحداثيات (x, y, z). يمكن جمع المتجهات وطرحها وضربها في عدد قياسي.', completed: false, academicStage: 'ثالث ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: المتجهات', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ],
  },
  {
    id: 'mat-science-01',
    name: 'العلوم',
    type: 'pdf',
    lessons: [
      // Elementary (Coming Soon)
      { id: 'sci-e1-s1-l1', name: 'المخلوقات الحية والغير حية (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'أول ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الأولى', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'sci-e4-s1-l1', name: 'النظام الشمسي (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'رابع ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الثانية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      // Middle School (Demo Content)
      { id: 'sci-m1-s1-l1', name: 'طبقات الأرض', content: 'تتكون الأرض من عدة طبقات: القشرة، والوشاح (الستار)، واللب الخارجي السائل، واللب الداخلي الصلب.', completed: false, academicStage: 'أول متوسط', semester: 'الفصل الأول', unit: 'الوحدة الثانية: الأرض والفضاء', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'sci-m2-s1-l1', name: 'الطاقة وتحولاتها', content: 'الطاقة لا تفنى ولا تستحدث من العدم، ولكنها تتحول من شكل إلى آخر. مثل تحول الطاقة الكيميائية في الوقود إلى طاقة حرارية ثم حركية.', completed: false, academicStage: 'ثاني متوسط', semester: 'الفصل الأول', unit: 'الوحدة الثالثة: الطاقة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'sci-m3-s2-l1', name: 'الروابط الكيميائية', content: 'الرابطة الأيونية تنشأ بين أيون موجب وأيون سالب. الرابطة التساهمية تنشأ عن طريق مشاركة الإلكترونات بين الذرات.', completed: false, academicStage: 'ثالث متوسط', semester: 'الفصل الثاني', unit: 'الوحدة الرابعة: الكيمياء', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ],
  },
   {
    id: 'mat-physics-01',
    name: 'الفيزياء',
    type: 'powerpoint',
    lessons: [
        { id: 'phy-h1-s1-l1', name: 'مدخل إلى علم الفيزياء', content: 'الفيزياء هي علم دراسة المادة والطاقة والعلاقة بينهما. تستخدم الرياضيات كأداة لوصف الظواهر الطبيعية.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: أساسيات الفيزياء', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'phy-h2-s1-l1', name: 'الحركة الدورانية', content: 'تصف الحركة الدورانية حركة الأجسام حول محور ثابت. من مفاهيمها الأساسية الإزاحة الزاوية، والسرعة الزاوية، والتسارع الزاوي.', completed: false, academicStage: 'ثاني ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الثانية: الميكانيكا', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'phy-h3-s2-l1', name: 'الفيزياء النووية', content: 'تدرس الفيزياء النووية بنية وسلوك نواة الذرة، بما في ذلك الانشطار النووي والاندماج النووي والنشاط الإشعاعي.', completed: false, academicStage: 'ثالث ثانوي', semester: 'الفصل الثاني', unit: 'الوحدة الخامسة: الفيزياء الحديثة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ]
  },
  {
    id: 'mat-chemistry-01',
    name: 'الكيمياء',
    type: 'powerpoint',
    lessons: [
        { id: 'chem-h1-s1-l1', name: 'المادة وخواصها وتغيراتها', content: 'المادة هي كل ما له كتلة ويشغل حيزًا. حالات المادة هي الصلبة والسائلة والغازية. التغيرات الفيزيائية لا تغير تركيب المادة، أما التغيرات الكيميائية فتنتج مواد جديدة.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: أساسيات الكيمياء', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'chem-h2-s2-l1', name: 'سرعة التفاعلات الكيميائية', content: 'سرعة التفاعل هي مقياس لسرعة تحول المتفاعلات إلى نواتج. تؤثر عليها عوامل مثل التركيز ودرجة الحرارة ومساحة السطح والمحفزات.', completed: false, academicStage: 'ثاني ثانوي', semester: 'الفصل الثاني', unit: 'الوحدة الثالثة: الطاقة والتغيرات الكيميائية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'chem-h3-s1-l1', name: 'الكيمياء العضوية: الهيدروكربونات', content: 'الهيدروكربونات هي مركبات عضوية تحتوي على عنصري الكربون والهيدروجين فقط. تشمل الألكانات والألكينات والألكاينات.', completed: false, academicStage: 'ثالث ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الثانية: الكيمياء العضوية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ]
  },
    {
    id: 'mat-biology-01',
    name: 'الأحياء',
    type: 'pdf',
    lessons: [
        { id: 'bio-h1-s1-l1', name: 'مدخل إلى علم الأحياء', content: 'علم الأحياء هو العلم الذي يدرس المخلوقات الحية وخصائصها، مثل النمو والتكاثر والاستجابة للمؤثرات والتكيف.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: دراسة الحياة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'bio-h2-s2-l1', name: 'تركيب الخلية ووظائفها', content: 'الخلية هي الوحدة الأساسية للحياة. تتكون من عضيات مثل النواة التي تحتوي على المادة الوراثية، والميتوكوندريا لإنتاج الطاقة، والغشاء البلازمي الذي ينظم دخول وخروج المواد.', completed: false, academicStage: 'ثاني ثانوي', semester: 'الفصل الثاني', unit: 'الوحدة الرابعة: الخلية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
        { id: 'bio-h3-s1-l1', name: 'علم الوراثة المندلية', content: 'تأسس علم الوراثة على يد مندل. قانون انعزال الصفات ينص على أن كل صفة وراثية يتحكم فيها زوج من الجينات ينفصلان عند تكوين الأمشاج.', completed: false, academicStage: 'ثالث ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الخامسة: الوراثة', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ]
  },
  {
    id: 'mat-arabic-01',
    name: 'لغتي',
    type: 'word',
    lessons: [
      // Elementary (Coming Soon)
      { id: 'arabic-e1-s1-l1', name: 'حروف الهجاء (قريبًا)', content: 'قريبًا', completed: false, academicStage: 'أول ابتدائي', semester: 'الفصل الأول', unit: 'الوحدة الأولى', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
       // Middle School (Demo Content)
      { id: 'arabic-m1-s1-l1', name: 'الهمزة المتوسطة على ألف', content: 'تكتب الهمزة المتوسطة على ألف إذا كانت مفتوحة وما قبلها مفتوح، أو إذا كانت ساكنة وما قبلها مفتوح، أو إذا كانت مفتوحة وما قبلها ساكن.', completed: false, academicStage: 'أول متوسط', semester: 'الفصل الأول', unit: 'الوحدة الأولى: الرسم الإملائي', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'arabic-m2-s1-l1', name: 'الأفعال الخمسة', content: 'الأفعال الخمسة هي كل فعل مضارع اتصلت به ألف الاثنين أو واو الجماعة أو ياء المخاطبة. ترفع بثبوت النون وتنصب وتجزم بحذف النون.', completed: false, academicStage: 'ثاني متوسط', semester: 'الفصل الأول', unit: 'الوحدة الثانية: النحو', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'arabic-m3-s2-l1', name: 'اسم الآلة', content: 'اسم الآلة هو اسم مشتق من الفعل الثلاثي للدلالة على الأداة التي يؤدى بها الفعل. يأتي على أوزان مثل مِفْعَل (مِبْرَد) ومِفْعَال (مِنْشَار).', completed: false, academicStage: 'ثالث متوسط', semester: 'الفصل الثاني', unit: 'الوحدة الثالثة: الصرف', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
       // High School (Demo Content)
      { id: 'arabic-h1-s1-l1', name: 'الجملة الاسمية ونواسخها', content: 'الجملة الاسمية تتكون من مبتدأ وخبر. تدخل عليها كان وأخواتها فترفع المبتدأ وتنصب الخبر، أو إن وأخواتها فتنصب المبتدأ وترفع الخبر.', completed: false, academicStage: 'أول ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الأولى: الكفاية النحوية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'arabic-h2-s1-l1', name: 'البلاغة: التشبيه وأركانه', content: 'التشبيه هو عقد مقارنة بين شيئين يشتركان في صفة واحدة أو أكثر. أركانه هي المشبه، والمشبه به، وأداة التشبيه، ووجه الشبه.', completed: false, academicStage: 'ثاني ثانوي', semester: 'الفصل الأول', unit: 'الوحدة الثالثة: الكفاية البلاغية', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
      { id: 'arabic-h3-s2-l1', name: 'الأدب في العصر العباسي', content: 'شهد العصر العباسي ازدهارًا كبيرًا في الشعر والنثر، وظهرت أغراض شعرية جديدة كالزهد والتصوف، وتطور النثر ليشمل الكتابة الديوانية والرسائل الإخوانية.', completed: false, academicStage: 'ثالث ثانوي', semester: 'الفصل الثاني', unit: 'الوحدة الرابعة: الأدب', featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false } },
    ],
  },
  {
    id: 'mat-quran-01',
    name: 'القرآن الكريم',
    type: 'pdf',
    lessons: []
  },
  {
    id: 'mat-tawhid-01',
    name: 'التوحيد',
    type: 'pdf',
    lessons: []
  },
  {
    id: 'mat-fiqh-01',
    name: 'الفقه',
    type: 'pdf',
    lessons: []
  },
  {
    id: 'mat-hadith-01',
    name: 'الحديث',
    type: 'pdf',
    lessons: []
  },
  {
    id: 'mat-tafsir-01',
    name: 'التفسير',
    type: 'pdf',
    lessons: []
  },
  {
    id: 'mat-social-01',
    name: 'الدراسات الاجتماعية',
    type: 'powerpoint',
    lessons: []
  },
  {
    id: 'mat-english-01',
    name: 'اللغة الإنجليزية',
    type: 'word',
    lessons: []
  },
  {
    id: 'mat-computer-01',
    name: 'الحاسب الآلي',
    type: 'powerpoint',
    lessons: []
  },
];

const initialTasks: Task[] = [
    { id: 'task-1', icon: <DocumentIcon className="w-5 h-5"/>, title: "مراجعة ملخص الذكاء الاصطناعي", subtitle: "الفصل الأول", completed: false, notes: "", category: 'study' },
    { id: 'task-4', icon: <GraduationCapIcon className="w-5 h-5"/>, title: "حل 10 أسئلة قدرات كمي", subtitle: "مهارة الجبر", completed: false, notes: "", category: 'stdTest' },
    { id: 'task-2', icon: <QuizIcon className="w-5 h-5"/>, title: "اختبار في شبكات الحاسب", subtitle: "5 أسئلة سريعة", completed: false, notes: "التركيز على نموذج OSI", category: 'study' },
    { id: 'task-3', icon: <FlashcardIcon className="w-5 h-5"/>, title: "بطاقات مراجعة مصطلحات أساسية", subtitle: "مصطلحات أساسية", completed: true, notes: "", category: 'study' },
];


const FeedbackModal: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [view, setView] = useState<'initial' | 'reason' | 'submitted'>('initial');
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        // In a real app, you would send the `reason` to a server.
        // For example: api.submitFeedback(reason);
        setView('submitted');
        setTimeout(() => {
            onFinish();
        }, 1500); // Wait 1.5s before closing
    };

    const handleInitialSelection = (isGood: boolean) => {
        if (isGood) {
            handleSubmit(); // Directly submit for "Excellent"
        } else {
            setView('reason'); // Show reason form for "Needs Improvement"
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'submitted':
                return (
                    <>
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">شكراً لك!</h2>
                        <p className="text-gray-600 mt-2">نقدر رأيك، فهو يساعدنا على التطوير.</p>
                    </>
                );
            case 'reason':
                return (
                     <>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">ما الذي يمكننا تحسينه؟</h2>
                        <p className="text-gray-600 mb-6">ملاحظاتك تساعدنا على تقديم تجربة أفضل.</p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500 mb-4 text-right"
                            rows={4}
                            placeholder="اكتب ملاحظاتك هنا..."
                            aria-label="سبب التقييم"
                        />
                        <button onClick={handleSubmit} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                            إرسال الملاحظات
                        </button>
                    </>
                );
            case 'initial':
            default:
                return (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">ما رأيك في أداء المساعد الذكي؟</h2>
                        <p className="text-gray-600 mb-6">ساعدنا على تحسين تجربتك.</p>
                        <div className="flex justify-center space-x-4 space-x-reverse">
                             <button onClick={() => handleInitialSelection(true)} className="flex flex-col items-center p-4 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors w-24">
                                <HappyFaceIcon className="w-12 h-12 mb-2" />
                                <span className="font-semibold text-sm">ممتاز</span>
                            </button>
                            <button onClick={() => handleInitialSelection(false)} className="flex flex-col items-center p-4 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors w-24">
                                <SadFaceIcon className="w-12 h-12 mb-2" />
                                <span className="font-semibold text-sm">يحتاج تطوير</span>
                            </button>
                        </div>
                    </>
                );
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 transform animate-slide-up-fast text-center">
               {renderContent()}
            </div>
        </div>
    );
};

// Helper function to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

// Helper function to save data to localStorage
const saveToStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key “${key}”:`, error);
    }
};


const App: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => getFromStorage('studyMindMaterials', initialMaterialsData));
  const [currentView, setCurrentView] = useState<View>(() => getFromStorage('studyMindCurrentView', 'introduction'));
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(() => getFromStorage('studyMindSelectedMaterialId', null));
  const [selectedStage, setSelectedStage] = useState<string | null>(() => getFromStorage('studyMindSelectedStage', null));
  const [selectedSemester, setSelectedSemester] = useState<string | null>(() => getFromStorage('studyMindSelectedSemester', null));
  const [selectedStandardizedTest, setSelectedStandardizedTest] = useState<StandardizedTestSubject | null>(() => getFromStorage('studyMindSelectedStdTest', null));
  const [standardizedTestScores, setStandardizedTestScores] = useState<StandardizedTestScores>(() => getFromStorage('studyMindStdTestScores', {}));
  const [activeDetailsView, setActiveDetailsView] = useState<DetailsViewType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getFromStorage('studyMindIsAuthenticated', false));
  const [user, setUser] = useState<User>(() => getFromStorage('studyMindUser', { name: 'نوره', email: 'noura@example.com', plan: 'الخطة المجانية' }));
  const [feedbackCallback, setFeedbackCallback] = useState<(() => void) | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => getFromStorage('studyMindTasks', initialTasks));
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Effects to save state to localStorage whenever it changes
  useEffect(() => { saveToStorage('studyMindMaterials', materials); }, [materials]);
  useEffect(() => { saveToStorage('studyMindTasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('studyMindCurrentView', currentView); }, [currentView]);
  useEffect(() => { saveToStorage('studyMindSelectedMaterialId', selectedMaterialId); }, [selectedMaterialId]);
  useEffect(() => { saveToStorage('studyMindSelectedStage', selectedStage); }, [selectedStage]);
  useEffect(() => { saveToStorage('studyMindSelectedSemester', selectedSemester); }, [selectedSemester]);
  useEffect(() => { saveToStorage('studyMindSelectedStdTest', selectedStandardizedTest); }, [selectedStandardizedTest]);
  useEffect(() => { saveToStorage('studyMindStdTestScores', standardizedTestScores); }, [standardizedTestScores]);
  useEffect(() => { saveToStorage('studyMindIsAuthenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveToStorage('studyMindUser', user); }, [user]);


  const handleToggleTaskComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleUpdateTaskNotes = (id: string, notes: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, notes } : t));
  };

  const handleDeleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (title: string) => {
      if (!title.trim()) return;
      const newTask: Task = {
          id: `task-${Date.now()}`,
          icon: <DocumentIcon className="w-5 h-5"/>,
          title: title,
          subtitle: "مهمة جديدة",
          completed: false,
          notes: "",
          category: 'study'
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
  };
  
  const handleUpdateStandardizedTestScore = useCallback((subject: StandardizedTestSubject, result: 'correct' | 'incorrect') => {
    setStandardizedTestScores(prevScores => {
        const newScores = { ...prevScores };
        if (!newScores[subject]) {
            newScores[subject] = { correct: 0, incorrect: 0 };
        }
        if (result === 'correct') {
            newScores[subject]!.correct += 1;
        } else {
            newScores[subject]!.incorrect += 1;
        }
        return newScores;
    });
  }, []);

  const handleQuizAnalysisComplete = (analysis: QuizAnalysis, sourceMaterialName: string) => {
      if (!analysis || !Array.isArray(analysis.main_topics_of_weakness) || analysis.main_topics_of_weakness.length === 0) {
        return;
      }

      const newTasks: Task[] = analysis.main_topics_of_weakness.map(topic => ({
          id: `task-${Date.now()}-${Math.random()}`,
          icon: <QuizIcon className="w-5 h-5"/>,
          title: `مراجعة الموضوع: ${topic}`,
          subtitle: `من مادة: ${sourceMaterialName}`,
          completed: false,
          notes: 'تمت إضافتها تلقائيًا بناءً على نتائج الاختبار.',
          category: 'study'
      }));

      setTasks(prevTasks => [...newTasks, ...prevTasks]);
  };

  const handleUseFeature = useCallback((materialId: string, lessonId: string, feature: keyof NonNullable<Lesson['featureUsage']>) => {
    setMaterials(prevMaterials =>
        prevMaterials.map(material => {
            if (material.id === materialId) {
                return {
                    ...material,
                    lessons: material.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            const newUsage = { 
                                summary: false, solutions: false, flashcards: false, quiz: false, chat: false,
                                ...lesson.featureUsage, 
                                [feature]: true 
                            };
                            return { ...lesson, featureUsage: newUsage };
                        }
                        return lesson;
                    }),
                };
            }
            return material;
        })
    );
  }, []);


  const handleRequestFeedback = (callback: () => void) => {
    setFeedbackCallback(() => callback);
  };

  const handleFinishFeedback = () => {
      if (feedbackCallback) {
          feedbackCallback();
      }
      setFeedbackCallback(null);
  };

  const handleUpdateMaterial = useCallback((id: string, updates: Partial<StudyMaterial>) => {
    setMaterials(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  }, []);

  const handleUpload = useCallback((name: string, type: StudyMaterial['type'], content: string) => {
    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      name,
      type,
      lessons: [{ 
        id: `lesson-${Date.now()}`, 
        name: 'الدرس الأساسي', 
        content, 
        completed: false, 
        academicStage: 'أول ثانوي', 
        semester: 'الفصل الأول',
        unit: 'الوحدة الأولى',
        featureUsage: { summary: false, solutions: false, flashcards: false, quiz: false, chat: false },
      }],
    };
    setMaterials(prev => [...prev, newMaterial]);
    setSelectedMaterialId(newMaterial.id);
    setSelectedStage(newMaterial.lessons[0].academicStage);
    setSelectedSemester(newMaterial.lessons[0].semester);
    setCurrentView('material');
  }, []);

  const handleSelectStandardizedTest = useCallback((subject: StandardizedTestSubject) => {
    setSelectedStandardizedTest(subject);
    setCurrentView('standardizedTest');
  }, []);
  
  const handleNavigateToLessons = useCallback((materialId: string, stage: string, semester: string) => {
    setSelectedMaterialId(materialId);
    setSelectedStage(stage);
    setSelectedSemester(semester);
    setCurrentView('material');
  }, []);

  const handleNavigateToStandardizedTests = () => {
      handleSelectView('standardizedTestLanding');
  }

  const handleSelectView = useCallback((view: View) => {
    setCurrentView(view);
    setIsSidebarVisible(false); // Close sidebar on navigation
    if(view !== 'material') {
      setSelectedMaterialId(null);
      setSelectedStage(null);
      setSelectedSemester(null);
    }
    if (view !== 'standardizedTest' && view !== 'standardizedTestLanding') {
        setSelectedStandardizedTest(null);
    }
  }, []);

  const handleToggleLessonComplete = useCallback((materialId: string, lessonId: string) => {
    setMaterials(prevMaterials =>
        prevMaterials.map(material => {
            if (material.id === materialId) {
                return {
                    ...material,
                    lessons: material.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            return { ...lesson, completed: !lesson.completed };
                        }
                        return lesson;
                    }),
                };
            }
            return material;
        })
    );
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('introduction');
    setTasks(initialTasks); // Reset tasks on logout
  };

  const selectedMaterial = useMemo(() => {
    return selectedMaterialId ? materials.find(m => m.id === selectedMaterialId) || null : null;
  }, [selectedMaterialId, materials]);

  const renderAppContent = () => {
    if (currentView === 'login') {
        return <LoginPage 
            onLogin={handleLogin} 
            onNavigateToSignup={() => setCurrentView('signup')} 
            onNavigateToIntro={() => setCurrentView('introduction')}
        />;
    }

    if (currentView === 'signup') {
        return <SignupPage 
            onSignup={handleSignup} 
            onNavigateToLogin={() => setCurrentView('login')} 
            onShowDetails={setActiveDetailsView}
            onNavigateToIntro={() => setCurrentView('introduction')}
        />;
    }

    const renderMainContent = () => {
        if (currentView === 'materials') {
            return <MaterialsListView materials={materials} onNavigateToLessons={handleNavigateToLessons} />;
        }
        if (currentView === 'standardizedTestLanding') {
            return <StandardizedTestLandingPage onSelectTest={handleSelectStandardizedTest} />;
        }
        if (currentView === 'standardizedTest' && selectedStandardizedTest) {
            return <StandardizedTestView 
              testSubject={selectedStandardizedTest}
              onUpdateScore={(result) => handleUpdateStandardizedTestScore(selectedStandardizedTest, result)}
            />;
        }
        if (currentView === 'material' && selectedMaterial) {
            return <StudyMaterialView 
              material={selectedMaterial} 
              initialSelectedStage={selectedStage}
              initialSelectedSemester={selectedSemester}
              onToggleLessonComplete={handleToggleLessonComplete}
              onRequestFeedback={handleRequestFeedback}
              onQuizComplete={(analysis) => handleQuizAnalysisComplete(analysis, selectedMaterial.name)}
              onUseFeature={handleUseFeature}
            />;
        }
        if (currentView === 'upload') {
            return <Upload onUpload={handleUpload} onRequestFeedback={handleRequestFeedback} onQuizComplete={handleQuizAnalysisComplete} />;
        }
        if (currentView === 'introduction') {
            return <Introduction onNavigateToUpload={() => handleSelectView('upload')} onShowDetails={setActiveDetailsView} onNavigateToMaterials={() => handleSelectView('materials')} onNavigateToStandardizedTests={handleNavigateToStandardizedTests} onContactClick={() => setIsContactModalOpen(true)} />;
        }
        if (currentView === 'admin') {
            return <AdminDashboard onShowDetails={setActiveDetailsView} />;
        }
        if (currentView === 'settings') {
            return <Settings user={user} onLogout={handleLogout} />;
        }
        return <Dashboard 
            onShowDetails={setActiveDetailsView}
            tasks={tasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskNotes={handleUpdateTaskNotes}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
        />;
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            <Sidebar
                currentView={currentView}
                onSelectView={handleSelectView}
                onContactClick={() => setIsContactModalOpen(true)}
                isSidebarVisible={isSidebarVisible}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                  currentView={currentView}
                  selectedMaterialName={selectedMaterial?.name}
                  isAuthenticated={isAuthenticated}
                  userName={user.name}
                  onSelectView={handleSelectView}
                  onLogout={handleLogout}
                  toggleSidebar={() => setIsSidebarVisible(p => !p)}
                />
                <main className="flex-1 overflow-hidden">
                  {renderMainContent()}
                </main>
            </div>
        </div>
    );
  };

  return (
    <>
      {activeDetailsView && <DetailsView viewType={activeDetailsView} onClose={() => setActiveDetailsView(null)} />}
      {feedbackCallback && <FeedbackModal onFinish={handleFinishFeedback} />}
      {isContactModalOpen && <ContactModal onClose={() => setIsContactModalOpen(false)} />}
      {renderAppContent()}
    </>
  );
};

export default App;