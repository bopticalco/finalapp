import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, X, Loader2, ArrowRight, AlertCircle, RefreshCw, 
  ChevronDown, ChevronUp, Database, ShieldCheck, CheckCircle2, 
  AlertTriangle, Clock, PackageCheck, Eye, User, HelpCircle 
} from 'lucide-react';
import { OrderStatus } from './types';

const BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq5WlCTUUoxCz1u7tlOepoBHvkskhMBiytVKvyo0dqONgl2lTqdl8XHnXKQ8wXacyKXpbG8bFtqXnN/pub?gid=529857349&single=true&output=csv";

// --- COMPONENTS ---

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  let styles = "bg-gray-100 text-gray-700 border-gray-200";
  let IconComp = HelpCircle;

  if (s.includes("ready") || s.includes("pickup")) {
    styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
    IconComp = CheckCircle2;
  } else if (s.includes("problem") || s.includes("delay")) {
    styles = "bg-rose-100 text-rose-700 border-rose-200";
    IconComp = AlertTriangle;
  } else if (s.includes("process") || s.includes("lab")) {
    styles = "bg-blue-50 text-blue-700 border-blue-100";
    IconComp = Clock;
  } else if (s.includes("dispensed")) {
    styles = "bg-gray-100 text-gray-500 border-gray-200 decoration-slice line-through";
    IconComp = PackageCheck;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      <IconComp className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};

const OrderCard: React.FC<{ order: OrderStatus }> = ({ order }) => {
  const isContacts = order.type === 'Contacts';
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-full ${isContacts ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
               <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">{order.patientName}</h3>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                 <User className="w-3 h-3" />
                 {order.type} Order
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0 pt-1 sm:pt-0">
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Lab Location</p>
            <p className="text-sm text-gray-700 font-medium">{order.lab}</p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Order Date</p>
            <p className="text-sm text-gray-700 font-medium">{order.orderDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="w-full">
      <div className="relative group flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          className="block w-full pl-11 pr-32 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          placeholder="Enter your email address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="absolute right-2 flex items-center gap-2">
          {value && (
            <button
              onClick={() => onChange('')}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onSearch}
            disabled={isLoading || !value.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Track
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const OrderTracker: React.FC = () => {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debugging states
  const [rawTextPreview, setRawTextPreview] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);

  const parseCSV = (text: string): OrderStatus[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Split CSV respecting quotes
    const splitLine = (line: string) => {
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      return line.split(regex).map(val => val.trim().replace(/^"|"$/g, '').trim());
    };

    // 1. Header Detection
    let headerRowIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const rowValues = splitLine(lines[i]).map(v => v.toLowerCase());
      const hasStatus = rowValues.some(v => v.includes('status') || v.includes('state'));
      const hasName = rowValues.some(v => v.includes('patient') || v.includes('name'));
      
      if (hasStatus || hasName) {
        headerRowIndex = i;
        headers = rowValues;
        break;
      }
    }

    if (headerRowIndex === -1) {
      headerRowIndex = 0;
      headers = splitLine(lines[0]).map(v => v.toLowerCase());
    }

    setDetectedHeaders(headers);

    // 2. Column Mapping
    const nameIdx = headers.findIndex(h => h.includes('patient') || h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('e-mail'));
    const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('state'));
    const labIdx = headers.findIndex(h => h.includes('lab'));
    const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('order'));

    // 3. Parsing
    return lines.slice(headerRowIndex + 1).map((line, index) => {
      if (!line.trim()) return null;
      
      const values = splitLine(line);
      const getVal = (idx: number) => (idx >= 0 && idx < values.length ? values[idx] : '');

      const patientName = getVal(nameIdx);
      if (!patientName) return null;

      const email = getVal(emailIdx);
      const lab = getVal(labIdx) || 'Unknown Lab';
      const status = getVal(statusIdx) || 'In Process';
      const orderDate = getVal(dateIdx) || 'Recently';
      const type = lab.toLowerCase().includes('contact') ? 'Contacts' : 'Glasses';

      return {
        id: `row-${index}`,
        patientName,
        email,
        orderDate,
        lab,
        status,
        type
      };
    }).filter((item): item is OrderStatus => item !== null);
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRawTextPreview('');

    try {
      let textData = '';
      const urlWithCacheBuster = `${BASE_URL}&_t=${Date.now()}`;
      
      try {
        const res = await fetch(urlWithCacheBuster);
        if (res.ok) {
          textData = await res.text();
        } else {
          throw new Error(`Status ${res.status}`);
        }
      } catch (directError) {
        console.warn("Direct fetch failed, using proxy.");
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithCacheBuster)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Proxy failed");
        textData = await res.text();
      }

      setRawTextPreview(textData.slice(0, 500));

      if (textData.trim().startsWith("<!DOCTYPE html>") || textData.includes("google.com/accounts")) {
         throw new Error("Auth Error: Sheet is not published to web.");
      }

      const parsedOrders = parseCSV(textData);
      setOrders(parsedOrders);
      
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Connection Failed");
      setOrders([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders([]);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    const results = orders.filter(order => {
      if (order.email && order.email.toLowerCase() === query) return true;
      if (order.patientName.toLowerCase() === query) return true;
      return false;
    });

    setFilteredOrders(results);
    setHasSearched(true);
  };

  const isDatabaseEmpty = !isLoading && orders.length === 0 && !error;
  const isSearchEmpty = !isLoading && hasSearched && filteredOrders.length === 0;
  const showWelcome = !isLoading && orders.length > 0 && !hasSearched;

  return (
    <div className="min-h-[80vh] flex flex-col font-sans">
      <main className="flex-grow container mx-auto px-1 py-8 max-w-2xl">
        
        {/* Search Section */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-2 text-slate-800">Check Order Status</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter your email address to find your order details.</p>
            
            <SearchBar 
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (!val.trim()) setHasSearched(false);
              }}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
            <div className="mt-3 flex items-center text-xs text-slate-400 gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Search: Only exact matches will be displayed.</span>
            </div>
          </div>
        </section>

        {/* Diagnostics / Error Section */}
        {(error || isDatabaseEmpty) && (
          <div className="mb-8 bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900">Unable to load orders</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    {error === "Auth Error: Sheet is not published to web." 
                      ? "The Google Sheet is private. You must Publish it to the Web." 
                      : "We connected to the sheet but couldn't find any order data."}
                  </p>
                </div>
             </div>
             
             <div className="p-6 space-y-4">
                <button 
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  {showDebug ? <ChevronUp className="w-3 h-3 mr-1"/> : <ChevronDown className="w-3 h-3 mr-1"/>}
                  {showDebug ? "Hide Diagnostics" : "Show Diagnostics"}
                </button>

                {showDebug && (
                  <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
                    <div className="mb-2 font-bold text-slate-400 uppercase tracking-wider">Detected Headers:</div>
                    <div className="mb-4">{detectedHeaders.length > 0 ? detectedHeaders.join(' | ') : 'None detected'}</div>
                    <div className="mb-2 font-bold text-slate-400 uppercase tracking-wider">Raw Response Preview:</div>
                    <pre className="whitespace-pre-wrap break-all">{rawTextPreview || "No data received."}</pre>
                  </div>
                )}

                <button 
                  onClick={fetchOrders}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-medium text-sm flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Reloading
                </button>
             </div>
          </div>
        )}

        {/* Main Content */}
        <section aria-live="polite">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
               {[1, 2].map(i => (
                 <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
               ))}
            </div>
          )}

          {!isLoading && hasSearched && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {isSearchEmpty && (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No order found</h3>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find an exact match for "{searchQuery}". Please verify your email address or call our office for assistance.
              </p>
            </div>
          )}

          {showWelcome && (
            <div className="text-center py-16 opacity-60">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700">Order Tracker</h3>
              <p className="text-slate-500">
                System online. Please enter your information above to begin.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderTracker;