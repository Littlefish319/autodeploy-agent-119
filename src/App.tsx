import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Command,
  GitBranch,
  Server,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function App() {
  const [input, setInput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'preview'>('terminal');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: timeString,
      message,
      type
    }]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Initial greeting
  useEffect(() => {
    addLog('AutoDeploy Agent v1.0.0 initialized.', 'success');
    addLog('Connected to Google GenAI Service.', 'info');
    addLog('Waiting for user instructions...', 'warning');
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isDeploying) return;

    const command = input;
    setInput('');
    setIsDeploying(true);
    addLog(`> ${command}`, 'info');

    // Simulate AI processing and deployment steps
    const steps = [
      { msg: 'Analyzing requirements with Gemini Pro...', delay: 800 },
      { msg: 'Generating React component structure...', delay: 1500 },
      { msg: 'Creating src/components/Dashboard.tsx...', delay: 2200 },
      { msg: 'Optimizing assets and bundling...', delay: 3000 },
      { msg: 'Verifying build integrity...', delay: 3800 },
      { msg: 'Deploying to Vercel Edge Network...', delay: 4500 },
      { msg: 'Deployment successful! Available at https://autodeploy-agent.vercel.app', delay: 5500, type: 'success' as const }
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep >= steps.length) {
        setIsDeploying(false);
        return;
      }

      const step = steps[currentStep];
      setTimeout(() => {
        addLog(step.msg, step.type || 'info');
        currentStep++;
        processStep();
      }, step.delay - (currentStep > 0 ? steps[currentStep - 1].delay : 0));
    };

    processStep();
  };

  return (
    <div className="min-h-screen bg-deploy-dark text-gray-300 font-sans selection:bg-deploy-accent selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-deploy-border bg-deploy-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-deploy-accent flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-white tracking-tight">AutoDeploy<span className="text-deploy-accent">Agent</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </div>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Status */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-deploy-card border border-deploy-border rounded-lg p-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Environment</h2>
            <div className="space-y-3">
              <StatusItem icon={GitBranch} label="Branch" value="main" />
              <StatusItem icon={Server} label="Region" value="us-east-1" />
              <StatusItem icon={Globe} label="Framework" value="Vite + React" />
              <StatusItem icon={Zap} label="Build Engine" value="Turbo" />
            </div>
          </div>

          <div className="bg-deploy-card border border-deploy-border rounded-lg p-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Active Deployments</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">production-v2.4.0</div>
                  <div className="text-xs text-gray-500">2m ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Terminal/Preview Area */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('terminal')}
              className={cn(
                "px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === 'terminal' 
                  ? "bg-deploy-card text-white border-t border-x border-deploy-border" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Terminal className="w-4 h-4" />
              Console Output
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={cn(
                "px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === 'preview' 
                  ? "bg-deploy-card text-white border-t border-x border-deploy-border" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Globe className="w-4 h-4" />
              Live Preview
            </button>
          </div>

          {/* Terminal Window */}
          <div className="flex-1 bg-deploy-card border border-deploy-border rounded-b-lg rounded-tr-lg overflow-hidden flex flex-col min-h-[500px]">
            {activeTab === 'terminal' ? (
              <>
                <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-2 custom-scrollbar">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={cn(
                        "break-all",
                        log.type === 'error' ? "text-red-400" :
                        log.type === 'success' ? "text-green-400" :
                        log.type === 'warning' ? "text-yellow-400" :
                        "text-gray-300"
                      )}>
                        {log.type === 'success' && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                        {log.type === 'error' && <AlertCircle className="w-3 h-3 inline mr-2" />}
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-deploy-border bg-black/20">
                  <form onSubmit={handleDeploy} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {isDeploying ? (
                        <Loader2 className="w-4 h-4 text-deploy-accent animate-spin" />
                      ) : (
                        <Command className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your deployment (e.g., 'Deploy a Next.js blog with dark mode')..."
                      className="w-full bg-black/40 border border-deploy-border rounded-md py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-deploy-accent focus:ring-1 focus:ring-deploy-accent transition-all"
                      disabled={isDeploying}
                    />
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
                <div className="w-16 h-16 rounded-full bg-deploy-border/50 flex items-center justify-center">
                  <Globe className="w-8 h-8" />
                </div>
                <p>Preview will appear here after successful deployment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
}
