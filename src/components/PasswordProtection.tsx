import React, { useState } from 'react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  // Das korrekte Passwort
  const CORRECT_PASSWORD = 'TeamWillenskraft2026';
  
  // Prüfen, ob der Benutzer bereits authentifiziert ist (Session Storage)
  React.useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      setError('');
    } else {
      setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
      setPassword('');
    }
  };
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <img 
            src="https://www.willenskraft.co.at/wp-content/uploads/2018/06/Final.-Logo-Hundeschule-Willenskraft.-Gute-Hundeschule-Graz-Gleisdorf.png" 
            alt="Willenskraft Logo" 
            className="mx-auto h-20 w-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-amber-500">Willenskraft</span> Futter-Rechner
          </h1>
          <p className="text-gray-600">Bitte geben Sie das Passwort ein, um auf die Anwendung zuzugreifen.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
              placeholder="Passwort eingeben"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105"
          >
            Anmelden
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Diese Anwendung ist passwortgeschützt. Bitte kontaktieren Sie den Administrator, 
            wenn Sie kein Passwort haben.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;