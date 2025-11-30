import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';

const RequestInvoice: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Invoice Request: ${formData.name}`);
    const body = encodeURIComponent(`
      I would like to request an invoice for my visit.
      
      Patient Name: ${formData.name}
      Date of Birth: ${formData.dob}
      Email to send invoice: ${formData.email}
    `);
    
    window.location.href = `mailto:info@bauereyecare.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-xl mx-auto">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
         <div className="flex items-center gap-4 mb-6">
           <div className="p-3 bg-slate-100 rounded-full text-slate-600" aria-hidden="true">
             <FileText size={28} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Request Invoice</h2>
             <p className="text-slate-500">We'll email you a copy of your detailed bill.</p>
           </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label htmlFor="patient-name" className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
             <input 
                id="patient-name"
                required
                name="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                placeholder="Full Name"
             />
           </div>

           <div>
             <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
             <input 
                id="dob"
                required
                name="dob"
                type="date" 
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
             />
           </div>

           <div>
             <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
             <input 
                id="email"
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                placeholder="Where should we send it?"
             />
           </div>

           <button 
             type="submit"
             className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 mt-4 focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 focus:outline-none"
           >
             <Send size={18} aria-hidden="true" /> Send Request
           </button>
         </form>
       </div>
    </div>
  );
};

export default RequestInvoice;