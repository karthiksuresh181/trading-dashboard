import { useState, useEffect } from 'react';
import { Plus, Trash2, History, TrendingUp, TrendingDown, AlertCircle, Clock, Power } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const PairManagerApp = () => {
  const [pairs, setPairs] = useState(() => {
    const savedPairs = localStorage.getItem('tradingPairs');
    return savedPairs ? JSON.parse(savedPairs) : [];
  });
  const [showHistory, setShowHistory] = useState({});
  const [pairToDelete, setPairToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('tradingPairs', JSON.stringify(pairs));
  }, [pairs]);

  // Auto-delete unnamed pairs after 30 seconds
  useEffect(() => {
    const timeouts = pairs.map(pair => {
      if (pair.isEditing && !pair.name) {
        return setTimeout(() => {
          setPairs(currentPairs =>
            currentPairs.filter(p => !(p.id === pair.id && !p.name))
          );
        }, 30000);
      }
    });
    return () => timeouts.forEach(timeout => timeout && clearTimeout(timeout));
  }, [pairs]);

  // Check if a date is from today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a pair is valid (updated today)
  const isPairValid = (pair) => {
    return isToday(pair.lastUpdated) && !pair.manuallyInvalidated;
  };

  const addPair = () => {
    const newPair = {
      id: Date.now(),
      name: '',
      weeklyBias: 'bearish',
      dailyBias: 'bearish',
      lastUpdated: new Date().toISOString(),
      history: [],
      isEditing: true,
      manuallyInvalidated: false
    };
    setPairs([...pairs, newPair]);
  };

  const removePair = (pairId) => {
    if (pairToDelete) {
      setPairs(pairs.filter(p => p.id !== pairId));
      setPairToDelete(null);
    }
  };

  const updatePair = (pairId, field, value) => {
    setPairs(pairs.map(p => {
      if (p.id === pairId) {
        if (field === 'dailyBias') {
          const newHistory = [
            {
              date: p.lastUpdated,
              dailyBias: p.dailyBias,
              weeklyBias: p.weeklyBias
            },
            ...p.history.slice(0, 6)
          ];

          return {
            ...p,
            [field]: value,
            lastUpdated: new Date().toISOString(),
            history: newHistory,
            manuallyInvalidated: false
          };
        }
        return {
          ...p,
          [field]: value,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const toggleValidation = (pairId) => {
    setPairs(pairs.map(p => {
      if (p.id === pairId) {
        return {
          ...p,
          manuallyInvalidated: !p.manuallyInvalidated
        };
      }
      return p;
    }));
  };

  const handleKeyPress = (e, pairId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim()) {
        updatePair(pairId, 'isEditing', false);
      }
    }
  };

  const toggleHistory = (pairId) => {
    setShowHistory(prev => ({
      ...prev,
      [pairId]: !prev[pairId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-[1400px]">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairs.map((pair) => {
            const valid = isPairValid(pair);
            return (
              <Card
                key={pair.id}
                className={`bg-gray-800 border-gray-700 shadow-xl transition-all duration-300
                ${!valid ? 'opacity-75 border-red-500/50' : ''}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        onClick={() => toggleValidation(pair.id)}
                        className={`transition-colors p-1 rounded-lg ${pair.manuallyInvalidated
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                          : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                          }`}
                      >
                        <Power className={`w-5 h-5 ${pair.manuallyInvalidated ? 'opacity-50' : ''}`} />
                      </button>
                      {pair.isEditing ? (
                        <input
                          type="text"
                          value={pair.name}
                          onChange={(e) => updatePair(pair.id, 'name', e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, pair.id)}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              updatePair(pair.id, 'isEditing', false);
                            }
                          }}
                          placeholder="Enter pair name"
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 
                                 focus:border-sky-500 focus:outline-none text-white"
                          autoFocus
                        />
                      ) : (
                        <div className="flex-1">
                          <CardTitle
                            className="text-xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 
                                   text-transparent bg-clip-text cursor-pointer hover:from-sky-200 
                                   hover:to-sky-400 transition-all duration-300"
                            onClick={() => updatePair(pair.id, 'isEditing', true)}
                          >
                            {pair.name || 'Unnamed Pair'}
                          </CardTitle>
                          <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-transparent 
                                     rounded-full mt-1"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="group relative">
                        <Clock
                          className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-help"
                        />
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-gray-900 text-white text-xs rounded p-2 shadow-lg whitespace-nowrap">
                            Last updated: {new Date(pair.lastUpdated).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setPairToDelete(pair.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg 
                               hover:bg-red-500/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Bias Selection Section */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Weekly Bias */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sky-300">
                        Weekly Bias
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updatePair(pair.id, 'weeklyBias', 'bullish')}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border 
                                 transition-all duration-200 ${pair.weeklyBias === 'bullish'
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-green-500/10 hover:border-green-500/50'
                            }`}
                        >
                          <TrendingUp className="w-5 h-5" />
                          Bullish
                        </button>
                        <button
                          onClick={() => updatePair(pair.id, 'weeklyBias', 'bearish')}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border 
                                 transition-all duration-200 ${pair.weeklyBias === 'bearish'
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-red-500/10 hover:border-red-500/50'
                            }`}
                        >
                          <TrendingDown className="w-5 h-5" />
                          Bearish
                        </button>
                      </div>
                    </div>

                    {/* Daily Bias */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sky-300">
                        Daily Bias
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updatePair(pair.id, 'dailyBias', 'bullish')}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border 
                                 transition-all duration-200 ${pair.dailyBias === 'bullish'
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-green-500/10 hover:border-green-500/50'
                            }`}
                        >
                          <TrendingUp className="w-5 h-5" />
                          Bullish
                        </button>
                        <button
                          onClick={() => updatePair(pair.id, 'dailyBias', 'bearish')}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border 
                                 transition-all duration-200 ${pair.dailyBias === 'bearish'
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-red-500/10 hover:border-red-500/50'
                            }`}
                        >
                          <TrendingDown className="w-5 h-5" />
                          Bearish
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* History Section */}
                  <div className="pt-4 space-y-4">
                    {pair.history.length > 0 && (
                      <button
                        onClick={() => toggleHistory(pair.id)}
                        className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <History className="w-4 h-4" />
                        <span className="text-sm">{showHistory[pair.id] ? 'Hide History' : 'View History'}</span>
                      </button>
                    )}

                    {showHistory[pair.id] && pair.history.length > 0 && (
                      <div className="space-y-3">
                        {pair.history.map((entry, index) => (
                          <div key={index} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                            <div className="text-sm text-gray-400">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <span className="text-xs text-gray-500">Daily:</span>
                                <span className={`ml-2 text-sm ${entry.dailyBias === 'bullish' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                  {entry.dailyBias}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Weekly:</span>
                                <span className={`ml-2 text-sm ${entry.weeklyBias === 'bullish' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                  {entry.weeklyBias}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Indicators */}
                  {!valid && (
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-900/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-sm text-red-400">
                          {pair.manuallyInvalidated ? 'Manually deactivated' : 'Needs daily update'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Add New Pair Button */}
          <button
            onClick={addPair}
            className="group h-full min-h-[200px] rounded-lg border-2 border-dashed border-gray-600 
                     hover:border-sky-500 bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 
                     flex flex-col items-center justify-center gap-4 p-8 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-gray-700 group-hover:bg-sky-500/20 
                          flex items-center justify-center transition-all duration-300">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-sky-400" />
            </div>
            <div className="text-gray-400 group-hover:text-sky-400 font-medium text-center transition-all duration-300">
              Add New Trading Pair
            </div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={pairToDelete !== null} onOpenChange={() => setPairToDelete(null)}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this trading pair? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
              onClick={() => setPairToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={removePair}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PairManagerApp;