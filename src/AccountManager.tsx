import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const ACCOUNT_SIZES = [
  { value: 0, label: 'Disabled' },
  { value: 5000, label: '$5,000' },
  { value: 10000, label: '$10,000' },
  { value: 20000, label: '$20,000' },
  { value: 60000, label: '$60,000' },
  { value: 100000, label: '$100,000' }
];

const AccountManagerApp = () => {
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('riskAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [{
      id: 1,
      accountSize: 0,
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0,
      actualBalance: 0,
      note: '',
    }];
  });

  useEffect(() => {
    localStorage.setItem('riskAccounts', JSON.stringify(accounts));
  }, [accounts]);

  const calculateActualBalance = (balance, accountSize) => {
    if (!accountSize || !balance) return parseFloat(balance) || 0;
    const maxDrawdown = accountSize * 0.1;
    const difference = accountSize - parseFloat(balance);
    return maxDrawdown - difference;
  };

  const calculateRisk = (balance, riskPercentage, roundTo, accountSize) => {
    if (!balance || !riskPercentage) return 0;
    const actualBalance = calculateActualBalance(balance, accountSize);
    if (actualBalance <= 0) return 0;
    const risk = (actualBalance * (parseFloat(riskPercentage) / 100));
    if (!roundTo || Number(roundTo) === 0) return risk;
    return Math.round(risk / roundTo) * roundTo;
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, {
      id: Date.now(),
      accountSize: 0,
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0,
      actualBalance: 0,
      note: ''
    }]);
  };

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        const updatedAccount = { ...account, [field]: value };
        updatedAccount.actualBalance = calculateActualBalance(
          updatedAccount.balance,
          updatedAccount.accountSize
        );
        updatedAccount.riskAmount = calculateRisk(
          updatedAccount.balance,
          updatedAccount.riskPercentage,
          updatedAccount.roundTo,
          updatedAccount.accountSize
        );
        return updatedAccount;
      }
      return account;
    }));
  };

  const generateRiskOptions = () => {
    const options = [];
    for (let i = 1; i <= 20; i++) {
      options.push(
        <option key={i} value={i}>
          {i}%
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 
                                 text-transparent bg-clip-text hover:from-sky-200 
                                 hover:to-sky-400 transition-all duration-300">
                      Account {index + 1}
                    </CardTitle>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-transparent 
                                    rounded-full mt-1"></div>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg 
                             hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2 flex items-center gap-2">
                    Account Size
                    {account.accountSize > 0 && (
                      <span className="text-xs text-sky-500">(10% Max Drawdown: ${(account.accountSize * 0.1).toFixed(2)})</span>
                    )}
                  </label>
                  <select
                    value={account.accountSize}
                    onChange={(e) => handleInputChange(account.id, 'accountSize', Number(e.target.value))}
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    {ACCOUNT_SIZES.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Balance Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sky-300 mb-2">
                      Current Balance
                    </label>
                    <input
                      type="number"
                      value={account.balance}
                      onChange={(e) => handleInputChange(account.id, 'balance', e.target.value)}
                      className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Enter balance"
                    />
                  </div>

                  {account.accountSize > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-sky-300 mb-2">
                        Actual Balance
                      </label>
                      <div className="w-full p-2 bg-gray-900/50 border border-sky-500/20 text-sky-300 rounded">
                        ${account.actualBalance.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Settings Section */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sky-300 mb-2">
                        Risk Percentage (1-20%)
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
                          step="1"
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sky-300 mb-2">
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

                    <div className="bg-sky-500/10 p-4 rounded-lg border border-sky-500/20">
                      <div className="text-lg text-sky-300 font-medium">
                        Risk Amount: ${account.riskAmount.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sky-300 mb-2">
                        Note
                      </label>
                      <textarea
                        value={account.note}
                        onChange={(e) => handleInputChange(account.id, 'note', e.target.value)}
                        className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

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

export default AccountManagerApp;