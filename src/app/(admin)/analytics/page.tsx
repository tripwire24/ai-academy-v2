'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, TrendingUp, Users, BookOpen, FileText } from 'lucide-react';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for prototype
  const courseCompletionData = [
    { name: 'Intro to AI', completed: 85, total: 100 },
    { name: 'Advanced ML', completed: 45, total: 80 },
    { name: 'Data Ethics', completed: 120, total: 150 },
    { name: 'Neural Nets', completed: 30, total: 60 },
  ];

  const activeUsersData = [
    { date: '1', users: 12 },
    { date: '5', users: 19 },
    { date: '10', users: 25 },
    { date: '15', users: 40 },
    { date: '20', users: 38 },
    { date: '25', users: 55 },
    { date: '30', users: 65 },
  ];

  const topHandouts = [
    { title: 'AI Cheat Sheet.pdf', downloads: 342 },
    { title: 'ML Algorithms Overview.pdf', downloads: 215 },
    { title: 'Ethics Guidelines.docx', downloads: 189 },
    { title: 'Dataset Links.xlsx', downloads: 145 },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand" size={32} /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Platform Analytics</h1>
        <p className="text-text-secondary">Insights into learner progress and engagement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Course Completion Rates */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-brand" />
            Course Completion Rates
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <Tooltip 
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="completed" fill="#F27D26" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="#e5e5e5" radius={[4, 4, 0, 0]} name="Total Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Users Over Time */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-success" />
            Active Users (Last 30 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeUsersData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Drop-off Analysis */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <Users size={20} className="text-warning" />
            Drop-off Analysis
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface-elevated rounded-xl border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-text-primary">Intro to AI</span>
                <span className="text-xs font-bold text-error bg-error-light px-2 py-1 rounded">High Drop-off</span>
              </div>
              <p className="text-sm text-text-secondary">Lowest completion: <span className="font-medium text-text-primary">Module 3, Lesson 2 (Neural Networks)</span></p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-xl border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-text-primary">Advanced ML</span>
                <span className="text-xs font-bold text-warning bg-warning-light px-2 py-1 rounded">Medium Drop-off</span>
              </div>
              <p className="text-sm text-text-secondary">Lowest completion: <span className="font-medium text-text-primary">Module 1, Lesson 4 (Math Foundations)</span></p>
            </div>
          </div>
        </div>

        {/* Most Accessed Handouts */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <FileText size={20} className="text-info" />
            Most Accessed Handouts
          </h2>
          <div className="divide-y divide-border">
            {topHandouts.map((handout, index) => (
              <div key={index} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-muted border border-border">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-text-primary">{handout.title}</span>
                </div>
                <span className="text-sm font-bold text-text-secondary bg-surface-elevated px-2 py-1 rounded">
                  {handout.downloads} <span className="text-xs font-normal">dl</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
