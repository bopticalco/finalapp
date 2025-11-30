import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { ViewState } from '../types';
import { Search } from 'lucide-react';

interface DashboardProps {
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = MENU_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title Section */}
      <div className="pt-2 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bauer Eyecare</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          aria-label="Search menu items"
          className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-shadow"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4 pb-8" role="list">
        {filteredItems.map((item, index) => {
          const Tag = item.external ? 'a' : 'button';
          const props = item.external ? {
            href: item.link,
            target: '_blank',
            rel: 'noopener noreferrer'
          } : {
            onClick: () => setView(item.view as ViewState),
            type: 'button' as 'button'
          };

          return (
            <Tag 
              key={index}
              {...props}
              className="flex flex-col items-center p-4 bg-slate-50 rounded-3xl active:scale-95 transition-transform cursor-pointer hover:bg-slate-100 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full"
              role="listitem"
            >
              {/* Squircle Icon Container */}
              <div 
                className={`w-20 h-20 mb-3 rounded-[2rem] bg-gradient-to-br ${item.gradient} ${item.shadow} shadow-lg flex items-center justify-center relative overflow-hidden group`}
                aria-hidden="true"
              >
                 {/* Glossy Effect overlay */}
                 <div className="absolute inset-0 bg-white/40 opacity-50"></div>
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 blur-[2px] rounded-t-[2rem]"></div>
                 
                 <item.icon className={`w-10 h-10 ${item.iconColor} relative z-10 drop-shadow-sm`} strokeWidth={1.5} />
                 
                 {/* Notification badge simulation for Questions */}
                 {item.title === 'Questions' && (
                   <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                      <span className="text-[8px] font-bold text-white">1</span>
                   </div>
                 )}
              </div>
              
              <h3 className="text-center font-bold text-slate-800 text-sm leading-tight px-1">
                {item.title}
              </h3>
            </Tag>
          );
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-10 text-slate-400" role="status">
          No items found
        </div>
      )}
    </div>
  );
};

export default Dashboard;