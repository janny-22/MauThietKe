import React from 'react';
import { 
  Cpu, 
  FileText, 
  BarChart3, 
  Layers, 
  Code2, 
  BookOpen, 
  DownloadCloud, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
//Thanh điều hướng trên cùng
interface NavbarProps {
  activeTab: 'mining' | 'charts' | 'structures' | 'java' | 'theory';
  setActiveTab: (tab: 'mining' | 'charts' | 'structures' | 'java' | 'theory') => void;
  onOpenLogModal: () => void;
  is18HuisStandard: boolean;
  totalHuis: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogModal,
  is18HuisStandard,
  totalHuis,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Paper branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">DHUPL Algorithm</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  Java Native & IEEE Access
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Damped Window-Based High Utility Pattern Mining With List Structure
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('mining')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'mining'
                  ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Khai phá 18 HUI</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'charts'
                  ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Phần IV: Biểu đồ thực nghiệm</span>
            </button>

            <button
              onClick={() => setActiveTab('structures')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'structures'
                  ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Cấu trúc GL & DTWU</span>
            </button>

            <button
              onClick={() => setActiveTab('java')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'java'
                  ? 'bg-amber-50 text-amber-800 shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-700">Mã nguồn Java</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('theory')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'theory'
                  ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lý thuyết bài báo</span>
            </button>
          </nav>

          {/* Action Header Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {is18HuisStandard && (
              <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Chuẩn 18 tập HUI</span>
              </div>
            )}

            <button
              onClick={onOpenLogModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Xuất file Log</span>
            </button>

            <button
              onClick={() => setActiveTab('java')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Java Core</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 space-x-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('mining')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'mining' ? 'bg-sky-600 text-white' : 'text-slate-600'
            }`}
          >
            18 HUI ({totalHuis})
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'charts' ? 'bg-sky-600 text-white' : 'text-slate-600'
            }`}
          >
            Phần IV Biểu đồ
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'structures' ? 'bg-sky-600 text-white' : 'text-slate-600'
            }`}
          >
            GL & DTWU
          </button>
          <button
            onClick={() => setActiveTab('java')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap text-amber-700 ${
              activeTab === 'java' ? 'bg-amber-100 text-amber-900' : 'text-slate-600'
            }`}
          >
            Mã Java
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'theory' ? 'bg-sky-600 text-white' : 'text-slate-600'
            }`}
          >
            Lý thuyết
          </button>
        </div>
      </div>
    </header>
  );
};
