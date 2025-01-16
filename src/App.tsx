import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const RiskCalculator = () => {
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('riskAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [{
      id: 1,
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0
    }];
  });

  useEffect(() => {
    localStorage.setItem('riskAccounts', JSON.stringify(accounts));
  }, [accounts]);

  const calculateRisk = (balance, riskPercentage, roundTo) => {
    if (!balance || !riskPercentage) return 0;
    const risk = (parseFloat(balance) * (parseFloat(riskPercentage) / 100));
    return Math.round(risk / roundTo) * roundTo;
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, {
      id: Date.now(),
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0
    }]);
  };

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        const updatedAccount = { ...account, [field]: value };
        updatedAccount.riskAmount = calculateRisk(
          updatedAccount.balance,
          updatedAccount.riskPercentage,
          updatedAccount.roundTo
        );
        return updatedAccount;
      }
      return account;
    }));
  };

  const generateRiskOptions = () => {
    const options = [];
    for (let i = 0.1; i <= 4; i += 0.1) {
      options.push(
        <option key={i} value={i.toFixed(1)}>
          {i.toFixed(1)}%
        </option>
      );
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, index) => (
            <Card key={account.id} className="bg-gray-800 border-gray-700 shadow-xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sky-400 text-lg">
                  Account {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-1">
                    Account Balance (USD)
                  </label>
                  <input
                    type="number"
                    value={account.balance}
                    onChange={(e) => handleInputChange(account.id, 'balance', e.target.value)}
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter balance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-1">
                    Risk Percentage
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={account.riskPercentage}
                      onChange={(e) => handleInputChange(account.id, 'riskPercentage', e.target.value)}
                      className="w-2/3 p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      {generateRiskOptions()}
                    </select>
                    <input
                      type="number"
                      value={account.riskPercentage}
                      onChange={(e) => handleInputChange(account.id, 'riskPercentage', e.target.value)}
                      className="w-1/3 p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      step="0.1"
                      min="0.1"
                      max="4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-1">
                    Round To Nearest
                  </label>
                  <input
                    type="number"
                    value={account.roundTo}
                    onChange={(e) => handleInputChange(account.id, 'roundTo', e.target.value)}
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    step="1"
                    min="1"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="text-sky-300 font-medium">
                    Risk Amount: ${account.riskAmount.toFixed(2)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 
                           hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/20 
                           hover:border-red-500/30 shadow-lg hover:shadow-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </CardFooter>
            </Card>
          ))}

          {/* New Account Card */}
          <button
            onClick={handleAddAccount}
            className="group h-full min-h-[200px] rounded-lg border-2 border-dashed border-gray-600 
                     hover:border-sky-500 bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 
                     flex flex-col items-center justify-center gap-4 p-8 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-gray-700 group-hover:bg-sky-500/20 
                          flex items-center justify-center transition-all duration-300">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-sky-400" />
            </div>
            <div className="text-gray-400 group-hover:text-sky-400 font-medium text-center transition-all duration-300">
              Add New Account
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;