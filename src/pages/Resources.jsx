import React, { useState } from 'react';
import { Book, Calculator, FlaskConical, Globe, Languages, Music, Palette } from 'lucide-react';
import clsx from 'clsx';

const Resources = () => {
    const [selectedGrade, setSelectedGrade] = useState('all');

    const grades = [
        { id: 'k-5', label: 'Elementary (K-5)' },
        { id: '6-8', label: 'Middle School (6-8)' },
        { id: '9-12', label: 'High School (9-12)' },
    ];

    const subjects = [
        { id: 1, title: 'Mathematics', grade: 'k-5', icon: Calculator, color: 'bg-blue-500' },
        { id: 2, title: 'Science', grade: 'k-5', icon: FlaskConical, color: 'bg-green-500' },
        { id: 3, title: 'Language Arts', grade: 'k-5', icon: Languages, color: 'bg-yellow-500' },
        { id: 4, title: 'Algebra I', grade: '6-8', icon: Calculator, color: 'bg-blue-600' },
        { id: 5, title: 'Biology', grade: '6-8', icon: FlaskConical, color: 'bg-green-600' },
        { id: 6, title: 'World History', grade: '6-8', icon: Globe, color: 'bg-orange-500' },
        { id: 7, title: 'Calculus', grade: '9-12', icon: Calculator, color: 'bg-blue-700' },
        { id: 8, title: 'Physics', grade: '9-12', icon: FlaskConical, color: 'bg-green-700' },
        { id: 9, title: 'Literature', grade: '9-12', icon: Book, color: 'bg-purple-600' },
    ];

    const filteredSubjects = selectedGrade === 'all'
        ? subjects
        : subjects.filter(s => s.grade === selectedGrade);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Curriculum Resources</h1>
                    <p className="text-xl text-slate-600">Explore our comprehensive collection of educational materials.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedGrade('all')}
                        className={clsx(
                            'px-6 py-2 rounded-full text-sm font-medium transition-all',
                            selectedGrade === 'all'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        )}
                    >
                        All Grades
                    </button>
                    {grades.map((grade) => (
                        <button
                            key={grade.id}
                            onClick={() => setSelectedGrade(grade.id)}
                            className={clsx(
                                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                                selectedGrade === grade.id
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            )}
                        >
                            {grade.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSubjects.map((subject) => (
                        <div key={subject.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 group cursor-pointer">
                            <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white', subject.color)}>
                                <subject.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                                {subject.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Comprehensive lessons and exercises for {subject.grade === 'k-5' ? 'Elementary' : subject.grade === '6-8' ? 'Middle School' : 'High School'} students.
                            </p>
                            <div className="flex items-center text-accent font-medium text-sm">
                                View Course <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Resources;
