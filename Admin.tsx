import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateDraftContent } from '../services/geminiService';
import { Card, Button, Input, FileUpload } from '../components/Shared';
import { 
  LayoutDashboard, Plus, Trash2, DollarSign, Users, Settings, 
  Sparkles, LogOut, Check, X, Bell, Image as ImageIcon 
} from 'lucide-react';

const Admin = () => {
  const { 
    isAdmin, login, logout, 
    activities, addActivity, deleteActivity,
    notices, addNotice, deleteNotice,
    transactions, updateTransactionStatus,
    paymentMethods, updatePaymentMethods,
    admins, addAdmin,
    settings, updateSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'activities' | 'notices' | 'payments' | 'admins' | 'settings'>('activities');
  const [loginCode, setLoginCode] = useState('');
  
  // Form States
  const [newActivity, setNewActivity] = useState({ title: '', description: '', imageUrl: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isUrgent: false });
  const [newAdmin, setNewAdmin] = useState({ name: '', accessCode: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(!login(loginCode)) alert('Invalid Code'); }}>
            <Input 
              label="Access Code" 
              type="password" 
              value={loginCode} 
              onChange={e => setLoginCode(e.target.value)}
              placeholder="Enter admin code (default: admin123)"
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Card>
      </div>
    );
  }

  const handleAIHelp = async (type: 'notice' | 'activity', topic: string, setter: any, field: string) => {
    if (!topic) return alert('Please enter a title/topic first');
    setIsGenerating(true);
    const text = await generateDraftContent(topic, type);
    setter((prev: any) => ({ ...prev, [field]: text }));
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'activities', label: 'Activities', icon: ImageIcon },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-primary" />
          Admin Dashboard
        </h2>
        <Button variant="secondary" onClick={logout} className="ml-auto">
          <LogOut size={16} /> Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'payments' && transactions.filter(t => t.status === 'pending').length > 0 && (
                <span className="ml-auto bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  {transactions.filter(t => t.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {/* ACTIVITIES TAB */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Post New Activity</h3>
                <div className="space-y-4">
                  <Input 
                    label="Title" 
                    value={newActivity.title} 
                    onChange={e => setNewActivity({...newActivity, title: e.target.value})} 
                  />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <button 
                        type="button"
                        onClick={() => handleAIHelp('activity', newActivity.title, setNewActivity, 'description')}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <Sparkles size={12} /> {isGenerating ? 'Drafting...' : 'AI Draft'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                      rows={3}
                      value={newActivity.description}
                      onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                    />
                  </div>
                  <FileUpload 
                    label="Cover Image" 
                    onFileSelect={(url) => setNewActivity({...newActivity, imageUrl: url})} 
                  />
                  <Button 
                    onClick={() => {
                      addActivity({ ...newActivity, id: Date.now().toString(), date: new Date().toISOString() });
                      setNewActivity({ title: '', description: '', imageUrl: '' });
                    }}
                    disabled={!newActivity.title || !newActivity.imageUrl}
                  >
                    <Plus size={18} /> Post Activity
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                {activities.map(activity => (
                  <Card key={activity.id} className="p-4 flex gap-4 items-center">
                    <img src={activity.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold">{activity.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    </div>
                    <button onClick={() => deleteActivity(activity.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* NOTICES TAB */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Post New Notice</h3>
                <div className="space-y-4">
                  <Input 
                    label="Title" 
                    value={newNotice.title} 
                    onChange={e => setNewNotice({...newNotice, title: e.target.value})} 
                  />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">Content</label>
                      <button 
                         type="button"
                        onClick={() => handleAIHelp('notice', newNotice.title, setNewNotice, 'content')}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <Sparkles size={12} /> {isGenerating ? 'Drafting...' : 'AI Draft'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                      rows={4}
                      value={newNotice.content}
                      onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="urgent"
                      checked={newNotice.isUrgent}
                      onChange={e => setNewNotice({...newNotice, isUrgent: e.target.checked})}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <label htmlFor="urgent" className="text-sm font-medium">Mark as Urgent</label>
                  </div>
                  <Button 
                    onClick={() => {
                      addNotice({ ...newNotice, id: Date.now().toString(), date: new Date().toISOString() });
                      setNewNotice({ title: '', content: '', isUrgent: false });
                    }}
                    disabled={!newNotice.title || !newNotice.content}
                  >
                    <Plus size={18} /> Post Notice
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                {notices.map(notice => (
                  <Card key={notice.id} className="p-4 flex gap-4 items-start">
                    <div className="flex-1">
                      <h4 className="font-bold flex items-center gap-2">
                        {notice.title}
                        {notice.isUrgent && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Urgent</span>}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{notice.content}</p>
                    </div>
                    <button onClick={() => deleteNotice(notice.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <Card className="p-6">
                 <h3 className="font-bold text-lg mb-4">Transaction History</h3>
                 <div className="space-y-3">
                   {transactions.length === 0 && <p className="text-gray-500">No transactions found.</p>}
                   {transactions.map(trx => (
                     <div key={trx.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div>
                         <div className="font-mono font-bold text-gray-900">{trx.trxId}</div>
                         <div className="text-sm text-gray-500">
                           {trx.methodName} • <span className="font-medium text-gray-900">${trx.amount}</span> • {new Date(trx.date).toLocaleDateString()}
                         </div>
                         {trx.userNote && <div className="text-sm text-gray-600 italic mt-1">"{trx.userNote}"</div>}
                       </div>
                       <div className="flex items-center gap-2">
                         {trx.status === 'pending' ? (
                           <>
                            <button onClick={() => updateTransactionStatus(trx.id, 'approved')} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Approve">
                              <Check size={18} />
                            </button>
                            <button onClick={() => updateTransactionStatus(trx.id, 'rejected')} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Reject">
                              <X size={18} />
                            </button>
                           </>
                         ) : (
                           <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                             trx.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {trx.status}
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Edit Payment Methods</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method, idx) => (
                    <div key={method.id} className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
                      <Input 
                        label="Method Name"
                        value={method.name} 
                        onChange={e => {
                          const newMethods = [...paymentMethods];
                          newMethods[idx].name = e.target.value;
                          updatePaymentMethods(newMethods);
                        }} 
                      />
                      <Input 
                        label="Account Number"
                        value={method.number} 
                        onChange={e => {
                          const newMethods = [...paymentMethods];
                          newMethods[idx].number = e.target.value;
                          updatePaymentMethods(newMethods);
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ADMINS TAB */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Create New Admin</h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input 
                      label="Admin Name" 
                      value={newAdmin.name} 
                      onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} 
                    />
                  </div>
                  <div className="flex-1">
                    <Input 
                      label="Access Code" 
                      value={newAdmin.accessCode} 
                      onChange={e => setNewAdmin({...newAdmin, accessCode: e.target.value})} 
                    />
                  </div>
                  <div className="mb-4">
                    <Button 
                      onClick={() => {
                        addAdmin({ ...newAdmin, id: Date.now().toString() });
                        setNewAdmin({ name: '', accessCode: '' });
                      }}
                      disabled={!newAdmin.name || !newAdmin.accessCode}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Existing Admins</h3>
                <ul className="space-y-2">
                  {admins.map(admin => (
                    <li key={admin.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{admin.name}</span>
                      <span className="font-mono text-gray-500 text-sm">Code: ••••••••</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">App Customization</h3>
                <div className="space-y-4">
                  <Input 
                    label="Organization Name" 
                    value={settings.orgName} 
                    onChange={e => updateSettings({ orgName: e.target.value })} 
                  />
                  <Input 
                    label="Welcome Message" 
                    value={settings.welcomeMessage} 
                    onChange={e => updateSettings({ welcomeMessage: e.target.value })} 
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                    <div className="flex gap-2">
                      {['red', 'blue', 'green', 'purple', 'orange', 'black'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSettings({ primaryColor: color as any })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            settings.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color === 'black' ? '#1f2937' : `var(--color-${color}, ${color})` }}
                        />
                      ))}
                    </div>
                  </div>

                  <FileUpload 
                    label="Update Logo" 
                    onFileSelect={(url) => updateSettings({ logoUrl: url })} 
                  />
                  
                  {settings.logoUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Current Logo Preview:</p>
                      <img src={settings.logoUrl} alt="Logo" className="h-16 w-16 object-contain border rounded p-1" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
