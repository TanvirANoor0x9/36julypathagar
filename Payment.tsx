import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input } from '../components/Shared';
import { CreditCard, Send, CheckCircle } from 'lucide-react';

const Payment = () => {
  const { paymentMethods, submitTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState(paymentMethods[0]?.id || '');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId || !selectedMethodId) return;

    const method = paymentMethods.find(m => m.id === selectedMethodId);

    submitTransaction({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      trxId,
      methodName: method?.name || 'Unknown',
      status: 'pending',
      date: new Date().toISOString(),
      userNote: note
    });

    setSubmitted(true);
    setAmount('');
    setTrxId('');
    setNote('');
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you. The admin has been notified and will verify your transaction shortly.
        </p>
        <Button onClick={() => setSubmitted(false)}>Make Another Payment</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Support Our Organization</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Methods Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="text-primary" />
            Payment Methods
          </h3>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="p-4 border-l-4 border-l-primary">
                <h4 className="font-bold text-lg">{method.name}</h4>
                <p className="text-2xl font-mono text-gray-800 my-2">{method.number}</p>
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded inline-block">
                  {method.instructions}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Submission Form */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Submit Transaction Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Method</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethodId(m.id)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedMethodId === m.id 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <Input 
              label="Transaction ID (TrxID)" 
              placeholder="e.g. 9H3J2K8L"
              value={trxId}
              onChange={e => setTrxId(e.target.value)}
              required
            />

            <Input 
              label="Amount" 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
              <textarea 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Any message for us?"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full py-3" disabled={!trxId || !amount}>
              <Send size={18} />
              Submit Payment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
