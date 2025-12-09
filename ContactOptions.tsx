import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { EXTERNAL_LINKS } from './constants';

const ContactOptions: React.FC = () => {
  return (
    <div className="max-w-md mx-auto space-y-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
        <p className="text-slate-500 mt-2">How would you like to connect with us?</p>
      </div>

      <div className="grid gap-4">
        {/* Call Button */}
        <a 
          href={EXTERNAL_LINKS.PHONE}
          className="flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-indigo-200 transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
            <Phone size={32} fill="currentColor" className="opacity-20 absolute" />
            <Phone size={32} className="relative z-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Call Office</h3>
            <p className="text-slate-500 text-sm">Speak with our staff directly</p>
          </div>
        </a>

        {/* Text Button */}
        <a 
          href={EXTERNAL_LINKS.SMS}
          className="flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-emerald-200 transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={32} fill="currentColor" className="opacity-20 absolute" />
            <MessageSquare size={32} className="relative z-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Text Us</h3>
            <p className="text-slate-500 text-sm">Send us an SMS message</p>
          </div>
        </a>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-500">
        <p>Office Phone: <span className="font-semibold text-slate-700">(719) 394-3939</span></p>
      </div>
    </div>
  );
};

export default ContactOptions;