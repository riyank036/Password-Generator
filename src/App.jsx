import { useState, useCallback, useEffect, useRef } from 'react'

export default function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // useRef hook
  const passwordRef = useRef(null) 

  // Calculate password strength
  const calculateStrength = useCallback(() => {
    let strength = 0;
    
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;
    
    if (numberAllowed) strength += 1;
    if (charAllowed) strength += 1;
    
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', percent: 20 };
    if (strength === 2) return { label: 'Fair', color: 'bg-orange-500', percent: 40 };
    if (strength === 3) return { label: 'Good', color: 'bg-yellow-500', percent: 60 };
    if (strength === 4) return { label: 'Strong', color: 'bg-lime-500', percent: 80 };
    return { label: 'Very Strong', color: 'bg-green-500', percent: 100 };
  }, [length, numberAllowed, charAllowed]);

  // useCallback Hook
  const passwordGenerator = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let pass = ""
      let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      
      if (numberAllowed) {
        str = str + "0123456789"
      }
      if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"
  
      for (let i = 1; i <= length; i++) {
        let char = Math.floor(Math.random() * str.length + 1)
        pass += str.charAt(char)
      }
  
      setPassword(pass)
      setIsGenerating(false);
    }, 300);
  }, [length, numberAllowed, charAllowed, setPassword])

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 1000);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [password])

  // Handler functions for toggles

  function toggleNumbers() {
    setNumberAllowed(function(prev) {
      return !prev;
    });
  }  
  const toggleCharacters = () => setCharAllowed(prev => !prev);

  // useEffect hook
  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  // Get current strength
  const strengthInfo = calculateStrength();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12 transition-all">
        <div className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl px-6 py-8 border border-gray-700/30 transition-all hover:shadow-indigo-900/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Password Generator
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Create strong, secure passwords instantly</p>
          </div>

          <div className="relative flex shadow-lg rounded-lg overflow-hidden mb-3 group hover:shadow-md transition-shadow duration-300">
            <input
              type="text"
              value={isGenerating ? "••••••••••" : password}
              className={`outline-none w-full py-3 px-4 bg-gray-800 text-gray-200 font-mono text-lg transition-all ${isGenerating ? 'animate-pulse' : ''}`}
              placeholder="Your password"
              readOnly
              ref={passwordRef}
            />

            <button
              onClick={copyPasswordToClipboard}
              disabled={isGenerating}
              className={`outline-none px-4 flex items-center justify-center transition-all duration-300 ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : isGenerating 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </span>
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Password Strength</span>
              <span className={`text-xs font-medium ${
                strengthInfo.label === 'Weak' ? 'text-red-400' :
                strengthInfo.label === 'Fair' ? 'text-orange-400' :
                strengthInfo.label === 'Good' ? 'text-yellow-400' :
                strengthInfo.label === 'Strong' ? 'text-lime-400' :
                'text-green-400'
              }`}>{strengthInfo.label}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${strengthInfo.color}`}
                style={{ width: `${strengthInfo.percent}%`, transition: 'width 0.5s ease-in-out' }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-gray-300 text-sm font-medium">Password Length</label>
                <span className="text-indigo-400 font-bold">{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={100}
                value={length}
                className="cursor-pointer w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-indigo-400 transition-colors"
                onChange={(e) => { setLength(e.target.value) }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="numberInput"
                    checked={numberAllowed}
                    onChange={toggleNumbers}
                    className="sr-only peer"
                  />
                  <div 
                    onClick={toggleNumbers}
                    className="block h-6 rounded-full bg-gray-700 w-full peer-checked:bg-indigo-600 transition-colors duration-300 cursor-pointer"
                  ></div>
                  <div 
                    onClick={toggleNumbers}
                    className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-300 peer-checked:left-5 cursor-pointer"
                  ></div>
                </div>
                <label 
                  htmlFor="numberInput" 
                  className="text-gray-300 text-sm"
                >
                  Include Numbers
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="characterInput"
                    checked={charAllowed}
                    onChange={toggleCharacters}
                    className="sr-only peer"
                  />
                  <div 
                    onClick={toggleCharacters}
                    className="block h-6 rounded-full bg-gray-700 w-full peer-checked:bg-indigo-600 transition-colors duration-300 cursor-pointer"
                  ></div>
                  <div 
                    onClick={toggleCharacters}
                    className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-300 peer-checked:left-5 cursor-pointer"
                  ></div>
                </div>
                <label 
                  htmlFor="characterInput" 
                  className="text-gray-300 text-sm"
                >
                  Include Symbols
                </label>
              </div>
            </div>
            
            <button 
              onClick={passwordGenerator}
              disabled={isGenerating}
              className={`w-full py-3 mt-4 text-white font-medium rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 ${
                isGenerating 
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-indigo-500/30'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : "Generate New Password"}
            </button>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Your passwords are generated locally and never stored or transmitted.</p>
          </div>
        </div>
      </main>
      
     
    </div>
  )
}

