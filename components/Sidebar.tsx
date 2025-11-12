

import React from 'react';
import type { View } from '../types';
import { 
    DashboardIcon, UploadIcon,
    InformationCircleIcon,
    AdminIcon,
    BookOpenIcon,
    GraduationCapIcon,
    MailIcon,
} from './Icons';

interface SidebarProps {
  currentView: View;
  onSelectView: (view: View) => void;
  onContactClick: () => void;
  isSidebarVisible: boolean;
}


export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, isSidebarVisible }) => {
  const baseItemClass = "flex items-center w-full px-4 py-3 text-right font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 rounded-lg";
  const activeItemClass = "bg-teal-100 text-teal-800";

  return (
    <aside className={`bg-white h-screen flex flex-col shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarVisible ? 'w-80 p-4' : 'w-0 p-0'}`}>
      
      <nav className="flex-grow overflow-y-auto pt-4">
        <ul className="space-y-1">
          <li>
            <button onClick={() => onSelectView('introduction')} className={`${baseItemClass} ${currentView === 'introduction' ? activeItemClass : ''}`}>
              <InformationCircleIcon className="w-6 h-6 ml-4" />
              <span className="whitespace-nowrap">عن المنصة</span>
            </button>
          </li>
          <li>
            <button onClick={() => onSelectView('dashboard')} className={`${baseItemClass} ${currentView === 'dashboard' ? activeItemClass : ''}`}>
              <DashboardIcon className="w-6 h-6 ml-4" />
              <span className="whitespace-nowrap">لوحة التحكم</span>
            </button>
          </li>
          
          <li>
            <button onClick={() => onSelectView('materials')} className={`${baseItemClass} ${currentView === 'materials' || currentView === 'material' ? activeItemClass : ''}`}>
              <BookOpenIcon className="w-6 h-6 ml-4" />
              <span className="whitespace-nowrap">المواد الدراسية</span>
            </button>
          </li>
           <li>
            <button 
                onClick={() => onSelectView('standardizedTestLanding')}
                className={`${baseItemClass} ${currentView === 'standardizedTest' || currentView === 'standardizedTestLanding' ? activeItemClass : ''}`}
            >
                <GraduationCapIcon className="w-6 h-6 ml-4" />
                <span className="flex-grow whitespace-nowrap">الاختبارات المعيارية</span>
            </button>
          </li>
          <li>
            <button onClick={() => onSelectView('upload')} className={`${baseItemClass} ${currentView === 'upload' ? activeItemClass : ''}`}>
              <UploadIcon className="w-6 h-6 ml-4" />
              <span className="whitespace-nowrap">المساعد الذكي</span>
            </button>
          </li>
          {/*
           <li>
            <button onClick={() => onSelectView('admin')} className={`${baseItemClass} ${currentView === 'admin' ? activeItemClass : ''}`}>
              <AdminIcon className="w-6 h-6 ml-4" />
              <span className="font-bold whitespace-nowrap">لوحة تحكم المدير</span>
            </button>
          </li>
          */}
        </ul>
      </nav>
      
    </aside>
  );
};