import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity, Notice, PaymentMethod, Transaction, Admin, AppSettings, ThemeColor } from '../types';

interface AppContextType {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
  
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;

  notices: Notice[];
  addNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;

  paymentMethods: PaymentMethod[];
  updatePaymentMethods: (methods: PaymentMethod[]) => void;

  transactions: Transaction[];
  submitTransaction: (trx: Transaction) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;

  admins: Admin[];
  addAdmin: (admin: Admin) => void;

  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  orgName: "36th July Pathagar",
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png", // Generic placeholder
  primaryColor: 'red',
  welcomeMessage: "Welcome to our digital community platform."
};

const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Bkash', number: '01700000000', instructions: 'Send Money (Personal)' },
  { id: '2', name: 'Nagad', number: '01800000000', instructions: 'Cash In or Send Money' },
  { id: '3', name: 'Rocket', number: '01600000000', instructions: 'Send Money (Personal)' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('notices');
    return saved ? JSON.parse(saved) : [];
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('paymentMethods');
    return saved ? JSON.parse(saved) : defaultPaymentMethods;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [admins, setAdmins] = useState<Admin[]>(() => {
    const saved = localStorage.getItem('admins');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Main Admin', accessCode: 'admin123' }];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Effects to persist data
  useEffect(() => localStorage.setItem('activities', JSON.stringify(activities)), [activities]);
  useEffect(() => localStorage.setItem('notices', JSON.stringify(notices)), [notices]);
  useEffect(() => localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods)), [paymentMethods]);
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('admins', JSON.stringify(admins)), [admins]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);

  // Apply Theme Color to CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    const colors: Record<string, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      orange: '#f97316',
      black: '#1f2937'
    };
    root.style.setProperty('--color-primary', colors[settings.primaryColor] || colors.red);
  }, [settings.primaryColor]);

  const login = (code: string) => {
    const isValid = admins.some(a => a.accessCode === code);
    if (isValid) setIsAdmin(true);
    return isValid;
  };

  const logout = () => setIsAdmin(false);

  const addActivity = (activity: Activity) => setActivities([activity, ...activities]);
  const deleteActivity = (id: string) => setActivities(activities.filter(a => a.id !== id));

  const addNotice = (notice: Notice) => setNotices([notice, ...notices]);
  const deleteNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));

  const updatePaymentMethods = (methods: PaymentMethod[]) => setPaymentMethods(methods);

  const submitTransaction = (trx: Transaction) => setTransactions([trx, ...transactions]);
  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status } : t));
  };

  const addAdmin = (admin: Admin) => setAdmins([...admins, admin]);

  const updateSettings = (newSettings: Partial<AppSettings>) => setSettings({ ...settings, ...newSettings });

  return (
    <AppContext.Provider value={{
      isAdmin, login, logout,
      activities, addActivity, deleteActivity,
      notices, addNotice, deleteNotice,
      paymentMethods, updatePaymentMethods,
      transactions, submitTransaction, updateTransactionStatus,
      admins, addAdmin,
      settings, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};