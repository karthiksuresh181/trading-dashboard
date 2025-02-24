import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from './components/ui/label';

const ACCOUNT_SIZES = [
  { value: 0, label: 'Disabled' },
  { value: 5000, label: '$5,000' },
  { value: 10000, label: '$10,000' },
  { value: 20000, label: '$20,000' },
  { value: 60000, label: '$60,000' },
  { value: 100000, label: '$100,000' }
];

const CALCULATION_MODES = {
  RISK_AMOUNT: 'riskAmount',
  RISK_PERCENTAGE: 'riskPercentage'
};

const CALCULATION_OPTIONS = [
  {
    id: CALCULATION_MODES.RISK_AMOUNT,
    label: 'Risk Amount',
    description: 'Use risk percentage to calculate risk amount'
  },
  {
    id: CALCULATION_MODES.RISK_PERCENTAGE,
    label: 'Risk Percentage',
    description: 'Use target risk amount to calculate risk percentage'
  }
];

const AccountManagerApp = () => {
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('riskAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [{
      id: 1,
      name: "Account 1",
      accountSize: 0,
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0,
      actualBalance: 0,
      note: '',
      isEditing: false,
      calculationMode: CALCULATION_MODES.RISK_AMOUNT,
      targetRiskAmount: 0,
      remainingTrades: 0
    }];
  });
  const [accountToDelete, setAccountToDelete] = useState(null);

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

  const calculateRiskPercentage = (balance, targetRiskAmount, accountSize) => {
    if (!balance || !targetRiskAmount) return 0;
    const actualBalance = calculateActualBalance(balance, accountSize);
    if (actualBalance <= 0) return 0;
    return (targetRiskAmount / actualBalance) * 100;
  };

  const calculateRemainingTrades = (balance, riskAmount, accountSize) => {
    if (!balance || !riskAmount || riskAmount <= 0) return 0;
    const actualBalance = calculateActualBalance(balance, accountSize);
    const tradesLeft = Math.floor(actualBalance / riskAmount);
    return tradesLeft < 0 ? 0 : tradesLeft;
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, {
      id: Date.now(),
      name: "Account " + (accounts.length + 1),
      accountSize: 0,
      balance: '',
      riskPercentage: '1',
      roundTo: 5,
      riskAmount: 0,
      actualBalance: 0,
      note: '',
      isEditing: true,
      calculationMode: CALCULATION_MODES.RISK_AMOUNT,
      targetRiskAmount: 0,
      remainingTrades: 0
    }]);
  };

  const removeAccount = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter(account => account.id !== accountToDelete));
      setAccountToDelete(null);
    }
  }

  const handleInputChange = (id, field, value) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        const updatedAccount = { ...account, [field]: value };
        updatedAccount.actualBalance = calculateActualBalance(
          updatedAccount.balance,
          updatedAccount.accountSize
        );

        if (updatedAccount.calculationMode === CALCULATION_MODES.RISK_AMOUNT) {
          updatedAccount.riskAmount = calculateRisk(
            updatedAccount.balance,
            updatedAccount.riskPercentage,
            updatedAccount.roundTo,
            updatedAccount.accountSize
          );
        } else {
          updatedAccount.riskPercentage = calculateRiskPercentage(
            updatedAccount.balance,
            updatedAccount.targetRiskAmount,
            updatedAccount.accountSize
          ).toFixed(2);
          updatedAccount.riskAmount = parseFloat(updatedAccount.targetRiskAmount);
        }

        updatedAccount.remainingTrades = calculateRemainingTrades(
          updatedAccount.balance,
          updatedAccount.riskAmount,
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

  const handleKeyPress = (e, accountId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim()) {
        handleInputChange(accountId, 'isEditing', false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="bg-neutral-900 border-neutral-700 shadow-xl h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  {account.isEditing ? (
                    <input
                      type="text"
                      value={account.name}
                      onChange={(e) => handleInputChange(account.id, 'name', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, account.id)}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          handleInputChange(account.id, 'isEditing', false);
                        }
                      }}
                      placeholder="Enter pair name"
                      className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-600 
                           focus:border-neutral-500 focus:outline-none text-white"
                      autoFocus
                    />
                  ) : (
                    <div className='flex-1'>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-neutral-300 to-neutral-500 
                                 text-transparent bg-clip-text hover:from-neutral-200 
                                 hover:to-neutral-400 transition-all duration-300"
                        onClick={() => handleInputChange(account.id, 'isEditing', true)}>
                        {account.name}
                      </CardTitle>
                      <div className="h-0.5 w-16 bg-gradient-to-r from-neutral-500 to-transparent 
                                    rounded-full mt-1"></div>
                    </div>
                  )}
                  <button
                    onClick={() => setAccountToDelete(account.id)}
                    className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-lg 
                             hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Size Selection */}
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    Account Size
                    {account.accountSize > 0 && (
                      <span className="text-xs text-neutral-500">(10% Max Drawdown: ${(account.accountSize * 0.1).toFixed(2)})</span>
                    )}
                  </label>
                  <select
                    value={account.accountSize}
                    onChange={(e) => handleInputChange(account.id, 'accountSize', Number(e.target.value))}
                    className="w-full p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
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
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Current Balance
                    </label>
                    <input
                      type="number"
                      value={account.balance}
                      onChange={(e) => handleInputChange(account.id, 'balance', e.target.value)}
                      className="w-full p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                      placeholder="Enter balance"
                    />
                  </div>

                  {account.accountSize > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Actual Balance
                      </label>
                      <div className="w-full p-2 bg-neutral-800/50 border border-neutral-500/20 text-neutral-300 rounded">
                        ${account.actualBalance.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* New Calculation Mode Selection */}
                <div className="pt-2 border-t border-neutral-700">
                  {/* <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Calculation Mode
                  </label> */}
                  <RadioGroup
                    value={account.calculationMode}
                    onValueChange={(value) => handleInputChange(account.id, 'calculationMode', value)}
                    className=" flex gap-4 justify-center"
                  >
                    {CALCULATION_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem value={option.id} id={`${account.id}-${option.id}`} className="text-neutral-300" />
                        <Label
                          htmlFor={`${account.id}-${option.id}`}
                          className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <div className="text-neutral-300">{option.label}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Risk Settings Section */}
                {/* <div className="pt-2 border-t border-neutral-700"> */}
                <div className="space-y-4">
                  {account.calculationMode === CALCULATION_MODES.RISK_AMOUNT ? (
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Risk Percentage (1-20%)
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={account.riskPercentage}
                          onChange={(e) => handleInputChange(account.id, 'riskPercentage', e.target.value)}
                          className="w-2/3 p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        >
                          {generateRiskOptions()}
                        </select>
                        <input
                          type="number"
                          value={account.riskPercentage}
                          onChange={(e) => handleInputChange(account.id, 'riskPercentage', e.target.value)}
                          className="w-1/3 p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                          step="1"
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Target Risk Amount ($)
                      </label>
                      <input
                        type="number"
                        value={account.targetRiskAmount}
                        onChange={(e) => handleInputChange(account.id, 'targetRiskAmount', e.target.value)}
                        className="w-full p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        step="1"
                        min="0"
                      />
                    </div>
                  )}


                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Round To Nearest
                    </label>
                    <input
                      type="number"
                      value={account.roundTo}
                      onChange={(e) => handleInputChange(account.id, 'roundTo', e.target.value)}
                      className="w-full p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                      step="1"
                      min="1"
                    />
                  </div>

                  {/* Updated Risk Information Display */}
                  <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700 space-y-2">
                    <div className="text-lg text-neutral-300 font-medium flex gap-2 justify-center">
                      <div>
                        Amount: ${account.riskAmount.toFixed(2)}
                      </div>
                      <div>|</div>
                      <div>
                        Percentage: {parseFloat(account.riskPercentage).toFixed(2)}%
                      </div>
                    </div>

                    <div className="text-lg text-neutral-300 font-medium flex gap-2 justify-center">
                      Remaining Trades: {account.remainingTrades}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Note
                    </label>
                    <textarea
                      value={account.note}
                      onChange={(e) => handleInputChange(account.id, 'note', e.target.value)}
                      className="w-full p-2 bg-neutral-800 border-neutral-600 text-neutral-200 rounded focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                    />
                  </div>
                </div>
                {/* </div> */}
              </CardContent>
            </Card>
          ))}

          <button
            onClick={handleAddAccount}
            className="group h-full min-h-[200px] rounded-lg border-2 border-dashed border-neutral-600 
                     hover:border-neutral-500 bg-neutral-900/50 hover:bg-neutral-800 transition-all duration-300 
                     flex flex-col items-center justify-center gap-4 p-8 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-neutral-700 group-hover:bg-neutral-500/20 
                          flex items-center justify-center transition-all duration-300">
              <Plus className="w-6 h-6 text-neutral-400 group-hover:text-neutral-400" />
            </div>
            <div className="text-neutral-400 group-hover:text-neutral-400 font-medium text-center transition-all duration-300">
              Add New Account
            </div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={accountToDelete !== null} onOpenChange={() => setAccountToDelete(null)}>
        <AlertDialogContent className="bg-neutral-800 border border-neutral-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-200">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete this account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600 border-neutral-600"
              onClick={() => setAccountToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-neutral-200 hover:bg-red-700"
              onClick={removeAccount}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountManagerApp;