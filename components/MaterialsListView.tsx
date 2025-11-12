import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { StudyMaterial } from '../types';
import { ChevronDownIcon, BookOpenIcon } from './Icons';

const ORDERED_ACADEMIC_STAGES = [
    'أول ابتدائي', 'ثاني ابتدائي', 'ثالث ابتدائي', 'رابع ابتدائي', 'خامس ابتدائي', 'سادس ابتدائي',
    'أول متوسط', 'ثاني متوسط', 'ثالث متوسط',
    'أول ثانوي', 'ثاني ثانوي', 'ثالث ثانوي'
];

const MaterialListItem: React.FC<{
    material: StudyMaterial;
    onNavigate: (materialId: string, stage: string, semester: string) => void;
}> = ({ material, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedStage, setSelectedStage] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const academicStagesWithStatus = useMemo(() => {
        return ORDERED_ACADEMIC_STAGES.map(stage => {
            const lessonsForStage = material.lessons.filter(l => l.academicStage === stage);
            const isComingSoon = lessonsForStage.length === 0 || lessonsForStage.every(l => l.name.includes('(قريبًا)'));
            return { name: stage, isComingSoon };
        });
    }, [material.lessons]);

    const semesters = ['الفصل الأول', 'الفصل الثاني'];

    const color = 'text-teal-600 bg-teal-100';

    useEffect(() => {
        if (selectedStage && selectedSemester) {
            onNavigate(material.id, selectedStage, selectedSemester);
        }
    }, [selectedStage, selectedSemester, material.id, onNavigate]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-md">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center p-4 text-right focus:outline-none focus:bg-gray-50"
                aria-expanded={isExpanded}
                aria-controls={`panel-${material.id}`}
            >
                <div className={`p-3 rounded-lg ml-4 ${color}`}>
                    <BookOpenIcon className="w-6 h-6" />
                </div>
                <h2 className="flex-grow font-bold text-gray-800">{material.name}</h2>
                <div className="flex items-center text-gray-500">
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div
                id={`panel-${material.id}`}
                role="region"
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-600 mb-3">اختر المرحلة والفصل الدراسي لعرض الدروس:</p>
                    <div className="grid sm:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor={`stage-${material.id}`} className="block text-xs font-medium text-gray-700 mb-1">المرحلة الدراسية</label>
                            <select
                                id={`stage-${material.id}`}
                                value={selectedStage}
                                onChange={e => setSelectedStage(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                onClick={e => e.stopPropagation()}
                            >
                                <option value="" disabled>-- اختر --</option>
                                {academicStagesWithStatus.map(stageInfo => (
                                    <option
                                        key={stageInfo.name}
                                        value={stageInfo.name}
                                        disabled={stageInfo.isComingSoon}
                                        className={stageInfo.isComingSoon ? 'text-gray-400' : ''}
                                    >
                                        {stageInfo.name} {stageInfo.isComingSoon ? '(قريبًا)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label htmlFor={`semester-${material.id}`} className="block text-xs font-medium text-gray-700 mb-1">الفصل الدراسي</label>
                            <select
                                id={`semester-${material.id}`}
                                value={selectedSemester}
                                onChange={e => setSelectedSemester(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                onClick={e => e.stopPropagation()}
                            >
                                <option value="" disabled>-- اختر --</option>
                                {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MaterialsListView: React.FC<{
    materials: StudyMaterial[];
    onNavigateToLessons: (materialId: string, stage: string, semester: string) => void;
}> = ({ materials, onNavigateToLessons }) => {
  return (
    <div className="p-8 pb-16 h-full overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">المواد الدراسية</h1>
      <p className="text-gray-500 mb-8">اختر مادة لعرض الدروس المتاحة. انقر على اسم المادة لتوسيعها واختيار المرحلة الدراسية.</p>
      
      <div className="max-w-4xl mx-auto space-y-4">
        {materials.map((material) => (
          <MaterialListItem
            key={material.id}
            material={material}
            onNavigate={onNavigateToLessons}
          />
        ))}
      </div>
    </div>
  );
};