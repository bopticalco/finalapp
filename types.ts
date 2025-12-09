import React from 'react';

export enum ViewState {
  HOME = 'HOME',
  INSURANCE = 'INSURANCE',
  INVOICE = 'INVOICE',
  TRACKER = 'TRACKER',
  CONTACT = 'CONTACT',
}

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.FC<any>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface InsuranceData {
  carrier: string;
  memberId: string;
  groupNumber: string;
  holderName: string;
}

export interface OrderStatus {
  id: string;
  patientName: string;
  email: string;
  orderDate: string;
  lab: string;
  status: string;
  type: string;
}
