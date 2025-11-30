import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Send, Loader2, X, Plus } from 'lucide-react';
import { analyzeInsuranceCard } from '../services/geminiService';
import { InsuranceData } from '../types';

const InsuranceUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<InsuranceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsAnalyzing(true);
      setError(null);
      setData(null);

      try {
        const filePromises = files.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        }));

        const newImages = await Promise.all(filePromises);
        // Append new images to existing ones
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        // Prepare raw base64 strings for API (strip data:image/...;base64,)
        const rawBase64s = updatedImages.map(img => img.split(',')[1]);

        const jsonString = await analyzeInsuranceCard(rawBase64s);
        if (jsonString) {
           const parsedData = JSON.parse(jsonString) as InsuranceData;
           setData(parsedData);
        } else {
           throw new Error("No data returned");
        }
      } catch (err) {
        setError("Could not analyze the cards. Please ensure images are clear and try again.");
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const clearImages = () => {
    setImages([]);
    setData(null);
    setError(null);
  };

  const handleSendEmail = () => {
    if (!data) return;
    
    const subject = encodeURIComponent("Insurance Card Submission");
    const body = encodeURIComponent(`
      New Insurance Card Submission:
      
      Carrier: ${data.carrier}
      Member ID: ${data.memberId}
      Group Number: ${data.groupNumber}
      Holder Name: ${data.holderName}
      
      (Please see attached images if sent via separate email client feature)
    `);
    
    window.location.href = `mailto:info@bauereyecare.com?subject=${subject}&body=${body}`;
  };

  // Helper to handle keyboard activation of file inputs
  const handleLabelKeyDown = (e: React.KeyboardEvent, inputId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById(inputId)?.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-slate-900">Upload Insurance Card</h2>
          {images.length > 0 && (
            <button 
              onClick={clearImages} 
              className="text-sm text-red-500 hover:text-red-600 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              aria-label="Clear all uploaded images"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-slate-600 mb-6">
          Upload clear photos of your insurance card (Front & Back). Our AI will extract the details.
        </p>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={img} alt={`Uploaded insurance card ${idx + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
            {/* Add more button */}
            <label 
              htmlFor="add-more-upload"
              className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
              tabIndex={0}
              onKeyDown={(e) => handleLabelKeyDown(e, 'add-more-upload')}
              role="button"
              aria-label="Upload another insurance card image"
            >
               <Plus className="w-8 h-8 text-slate-400" aria-hidden="true" />
               <span className="text-xs text-slate-500 mt-1">Add another</span>
               <input 
                 id="add-more-upload"
                 type="file" 
                 className="sr-only" 
                 accept="image/*" 
                 multiple 
                 onChange={handleFileChange} 
               />
            </label>
          </div>
        )}

        {/* Initial Upload Area - Only show if no images */}
        {images.length === 0 && (
          <div className="mb-8">
            <label 
              htmlFor="initial-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
              tabIndex={0}
              onKeyDown={(e) => handleLabelKeyDown(e, 'initial-upload')}
              role="button"
              aria-label="Upload insurance card images"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-slate-400" aria-hidden="true" />
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-slate-500">Front & Back (Max 5MB)</p>
              </div>
              <input 
                id="initial-upload"
                type="file" 
                className="sr-only" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        )}

        {/* Analysis State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl mb-4" role="status" aria-live="polite">
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span>Analyzing card details...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl mb-4" role="alert">
            <AlertCircle aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Form */}
        {data && !isAnalyzing && (
          <div className="space-y-4 animate-fade-in border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-emerald-600 mb-4" role="status">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Details Extracted Successfully</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="carrier" className="text-xs font-semibold text-slate-500 uppercase">Insurance Carrier</label>
                <input 
                  id="carrier"
                  type="text" 
                  value={data.carrier || ''} 
                  onChange={(e) => setData({...data, carrier: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="memberId" className="text-xs font-semibold text-slate-500 uppercase">Member ID</label>
                <input 
                  id="memberId"
                  type="text" 
                  value={data.memberId || ''} 
                  onChange={(e) => setData({...data, memberId: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="groupNumber" className="text-xs font-semibold text-slate-500 uppercase">Group Number</label>
                <input 
                  id="groupNumber"
                  type="text" 
                  value={data.groupNumber || ''} 
                  onChange={(e) => setData({...data, groupNumber: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="holderName" className="text-xs font-semibold text-slate-500 uppercase">Primary Holder Name</label>
                <input 
                  id="holderName"
                  type="text" 
                  value={data.holderName || ''} 
                  onChange={(e) => setData({...data, holderName: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleSendEmail}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none"
              >
                <Send className="w-4 h-4" aria-hidden="true" /> Submit to Bauer Eyecare
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">This will open your email client with the details pre-filled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceUploader;