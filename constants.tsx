import React from 'react';
import { CalendarClock, CreditCard, ShoppingBag, MessageCircle, FileText, Search, ShieldCheck, Mail, Truck, Circle, FileInput, Package, ShoppingCart, MapPin, Pill, Phone } from 'lucide-react';
import { NavItem, ViewState } from './types';

export const EXTERNAL_LINKS = {
  APPOINTMENTS: 'https://appointments.4patientcare.app/?CoverKey=5362&Source=website&ReferredBy=website&Gcount=0',
  PAYMENT: 'https://www.clover.com/pay-widgets/41d1dde0-fc09-4afd-b1c4-37568bda3fd0',
  STORE: 'https://bauereyecare.arrellio.com/',
  EMAIL: 'mailto:info@bauereyecare.com',
  TRACKING: 'https://www.bauereyecare.com/eyeglasses',
  MAPS: 'https://www.google.com/maps/dir/?api=1&destination=3625+Star+Ranch+Rd,+Colorado+Springs,+CO+80906',
  MEDS_EMAIL: 'mailto:info@bauereyecare.com?subject=Medication%2FAuthorization%20Request&body=Please%20fill%20in%20the%20following%3A%0D%0A%0D%0AName%3A%20%0D%0ADate%20of%20Birth%3A%20%0D%0AMedication%20Refill%3A%0D%0AMedication%20Authorization%3A%0D%0APharmacy%20Location%3A',
  PHONE: 'tel:7193943939'
};

// Unified background style for all icons (Green Squircle)
const UNIFIED_GRADIENT = 'from-green-200 to-green-400';
const UNIFIED_SHADOW = 'shadow-green-100';

// Custom Contact Lens Case Icon
const ContactLensCaseIcon: React.FC<any> = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="7" cy="12" r="5" />
      <circle cx="17" cy="12" r="5" />
      <path d="M12 12h0" />
      <path d="M10.5 8.5C11 8.5 11.5 9 12 9C12.5 9 13 8.5 13.5 8.5" />
      <path d="M10.5 15.5C11 15.5 11.5 15 12 15C12.5 15 13 15.5 15.5" />
      <text x="5.5" y="13" fontSize="4" stroke="none" fill="currentColor" fontWeight="bold">R</text>
      <text x="15.5" y="13" fontSize="4" stroke="none" fill="currentColor" fontWeight="bold">L</text>
    </svg>
  );
};

// Custom Email with Question Mark Icon
const EmailQuestionIcon: React.FC<any> = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M19.5 10a1.5 1.5 0 1 0-1.2 2.3c.3.1.5.6.5 1v.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="16" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

export const MENU_ITEMS = [
  {
    title: 'Routine Eye Exam',
    description: 'Book Appointment',
    icon: CalendarClock,
    link: EXTERNAL_LINKS.APPOINTMENTS,
    external: true,
    gradient: UNIFIED_GRADIENT, 
    iconColor: 'text-red-500 fill-red-50', // Red calendar
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Pay my Bill',
    description: 'Secure Payment',
    icon: CreditCard,
    link: EXTERNAL_LINKS.PAYMENT,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-emerald-600 fill-emerald-50', // Green/Gold payment
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Order Contacts',
    description: 'Buy contact lenses',
    icon: ContactLensCaseIcon,
    link: EXTERNAL_LINKS.STORE,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-cyan-500 fill-cyan-50', // Cyan lenses
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Track Eyeglasses',
    description: 'Order Status',
    icon: Truck,
    view: ViewState.TRACKER,
    external: false,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-yellow-600 fill-yellow-100', // Yellow box
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Questions',
    description: 'Email Us',
    icon: EmailQuestionIcon,
    link: EXTERNAL_LINKS.EMAIL,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-amber-500 fill-amber-100', // Yellow/Orange envelope
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Insurance Card',
    description: 'Upload Card',
    icon: ShieldCheck,
    view: ViewState.INSURANCE,
    external: false,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-blue-600 fill-blue-50', // Blue card
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Request Invoice',
    description: 'Get Bill Copy',
    icon: FileText,
    view: ViewState.INVOICE,
    external: false,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-slate-600 fill-slate-100', // Grey invoice
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Refills & Auth',
    description: 'Medication Request',
    icon: Pill,
    link: EXTERNAL_LINKS.MEDS_EMAIL,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-purple-600 fill-purple-100', // Purple pill
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Find Location',
    description: 'Directions',
    icon: MapPin,
    link: EXTERNAL_LINKS.MAPS,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-rose-500 fill-rose-50', // Red pin
    shadow: UNIFIED_SHADOW,
  },
  {
    title: 'Call Office',
    description: 'Talk to Us',
    icon: Phone,
    link: EXTERNAL_LINKS.PHONE,
    external: true,
    gradient: UNIFIED_GRADIENT,
    iconColor: 'text-indigo-600 fill-indigo-50', // Indigo phone
    shadow: UNIFIED_SHADOW,
  },
];

export const SYSTEM_INSTRUCTION = `You are a friendly, helpful, and professional assistant for Bauer Eyecare.`;