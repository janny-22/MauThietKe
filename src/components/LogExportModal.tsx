import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  X, 
  Search, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MiningResult } from '../utils/dhuplEngine';
import { generateExecutionLog } from '../utils/logGenerator';

interface LogExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  miningResult: MiningResult;
}
/*
Xem trực tiếp nội dung file log hoàn chỉnh.
Ô tìm kiếm từ khóa bên trong nội dung log.
Nút Tải file .log và Tải file .txt để lưu về máy tính*/
export const LogExportModal: React.FC<LogExportModalProps> = ({
  isOpen,
  onClose,
  miningResult,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fullLog = generateExecutionLog(miningResult);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (ext: 'log' | 'txt') => {
    const blob = new Blob([fullLog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dhupl_execution_T${miningResult.currentT}_f${miningResult.decayFactor}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter lines if search term is provided
  const displayedLog = searchTerm.trim()
    ? fullLog
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
        .join('\n')
    : fullLog;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xuất Nhật Ký Tính Toán (Execution Log File)
              </h3>
              <p className="text-xs text-slate-500">
                Lưu giữ đầy đủ từng bước thực thi: dtwu-table, Global Lists, quá trình đệ quy và danh sách 18 HUI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          {/* Quick search inside log */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Lọc trong log (ví dụ: HUI, dtwu, T8)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép Log'}</span>
            </button>

            <button
              onClick={() => handleDownload('log')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải file .log</span>
            </button>

            <button
              onClick={() => handleDownload('txt')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải file .txt</span>
            </button>
          </div>
        </div>

        {/* Log Viewer Container */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre">
            <code>{displayedLog}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã ghi nhận {miningResult.discoveredHuis.length} tập HUI tại T={miningResult.currentT}.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
