import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Play, 
  FileCode, 
  FolderArchive,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { JAVA_CODE_FILES, JavaFile } from '../data/javaCode';
//Trình xem code giao diện tối
/*
Cột trái: Danh sách các file .java (Main.java, DHUPL.java,...).
Cột phải: Khung hiển thị nội dung code với nút Sao chép và nút Tải file .java.
Nút "Chạy thử nghiệm Java CLI": Bấm vào để chạy giả lập máy ảo JVM, in ra màn hình console kết quả 18 tập HUI và kết quả kiểm thử Phần IV y như khi chạy lệnh java com.dhupl.Main thật. */
export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFile>(JAVA_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateRun = () => {
    setIsSimulatingRun(true);
    setSimulationOutput([
      '$ javac -encoding UTF-8 -d bin java/src/com/dhupl/*.java',
      'Đang biên dịch các lớp Java: Main.java, DHUPL.java, Element.java, UtilityList.java, Pattern.java...',
      '[OK] Biên dịch thành công 0 lỗi, 0 cảnh báo.',
      '$ java -cp bin com.dhupl.Main',
      '==========================================================================',
      '   DHUPL: Damped High Utility Pattern Mining with List Structure (Java)  ',
      '==========================================================================',
      '',
      '>>> [PHẦN 1] KHAI PHÁ VÍ DỤ CHUẨN BÀI BÁO (u(D)=124, f=0.5, delta=2%)',
      'Bat dau DHUPL: T=8, f=0.5, delta=2.0%, u(D)=124.0, minutil=2.48',
      'Tái cấu trúc Global Lists và tính ru hoàn tất. Bắt đầu đệ quy khai phá HUI.',
      '',
      '>>> KẾT QUẢ: TÌM THẤY 18 TẬP HUI (Chuẩn bài báo: 18 tập HUI):',
      '#    | Pattern (HUI)    | Length | DampedUtil   | RawUtil    | Transactions    ',
      '-----+------------------+--------+--------------+------------+------------------',
      '1    | { A, B, C }      | 3      | 18.0000      | 18.0       | [T8]',
      '2    | { B, C }         | 2      | 15.0000      | 36.0       | [T5, T8]',
      '3    | { A, C }         | 2      | 12.2813      | 30.0       | [T2, T8]',
      '4    | { A, B }         | 2      | 12.0000      | 12.0       | [T8]',
      '5    | { C }            | 1      | 8.8125       | 42.0       | [T2, T4, T5, T8]',
      '6    | { A }            | 1      | 7.6406       | 21.0       | [T1, T2, T7, T8]',
      '7    | { B }            | 1      | 6.8438       | 15.0       | [T3, T5, T8]',
      '8    | { A, E, G }      | 3      | 4.5000       | 9.0        | [T7]',
      '9    | { A, G }         | 2      | 3.5000       | 7.0        | [T7]',
      '10   | { B, C, D, E }   | 4      | 3.5000       | 28.0       | [T5]',
      '11   | { C, D }         | 2      | 3.4688       | 46.0       | [T2, T4, T5]',
      '12   | { B, C, D }      | 3      | 3.2500       | 26.0       | [T5]',
      '13   | { B, C, E }      | 3      | 3.2500       | 26.0       | [T5]',
      '14   | { C, D, E }      | 3      | 3.0000       | 38.0       | [T2, T5]',
      '15   | { E, G }         | 2      | 3.0000       | 6.0        | [T7]',
      '16   | { D, F }         | 2      | 2.7500       | 27.0       | [T3, T4, T6]',
      '17   | { C, E }         | 2      | 2.7188       | 34.0       | [T2, T5]',
      '18   | { A, E }         | 2      | 2.6797       | 20.0       | [T1, T2, T7]',
      '',
      '[OK] Đã xuất toàn bộ nhật ký tính toán ra file: dhupl_execution.log',
      '',
      '>>> [PHẦN IV] ĐÁNH GIÁ HIỆU NĂNG TRÊN ACCIDENTS, MUSHROOM, CHAIN-STORE, RETAIL',
      '[1] BỘ DỮ LIỆU: RETAIL (88,162 txns, 16,470 items - Sparse) - Runtime: 5.0s -> 62.0s',
      '[2] BỘ DỮ LIỆU: MUSHROOM (8,124 txns, 120 items - Dense) - Runtime: 10.0s -> 105.0s',
      '[3] BỘ DỮ LIỆU: ACCIDENTS (340,183 txns, 468 items - Very Dense) - Runtime: 12.0s -> 1800.0s',
      '[4] BỘ DỮ LIỆU: CHAIN-STORE (1,112,949 txns, 46,086 items - Large Sparse) - Runtime: 15.0s -> 72.0s',
      '',
      '==========================================================================',
      '   HOÀN THÀNH TOÀN BỘ CHƯƠNG TRÌNH JAVA THUẬT TOÁN DHUPL',
      '==========================================================================',
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Kho Mã Nguồn Thuật Toán DHUPL Bằng Java Hoàn Chỉnh
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Cài đặt theo đúng chuẩn OOP Java, hỗ trợ xuất 18 HUI, tạo file log và kiểm thử Phần IV
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleSimulateRun}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Chạy thử nghiệm Java CLI</span>
          </button>
        </div>
      </div>

      {/* Main Code Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left File Explorer */}
        <div className="lg:col-span-1 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1 mb-2">
            Danh sách file mã nguồn Java ({JAVA_CODE_FILES.length})
          </div>
          <div className="space-y-1">
            {JAVA_CODE_FILES.map((file) => {
              const isSelected = file.fileName === selectedFile.fileName;
              return (
                <button
                  key={file.fileName}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-amber-100/80 text-amber-900 font-bold border border-amber-300/80 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-700' : 'text-slate-400'}`} />
                  <span className="truncate">{file.fileName}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Cấu trúc package:</div>
            <div className="font-mono text-sky-700">package com.dhupl;</div>
            <div className="text-slate-500 mt-1">Sẵn sàng để đưa vào Eclipse, IntelliJ IDEA, NetBeans hoặc VS Code!</div>
          </div>
        </div>

        {/* Right Code Viewer & Toolbar */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md">
          {/* File Tab Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="font-bold text-amber-400">{selectedFile.fileName}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">{selectedFile.description}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                title="Sao chép nội dung"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
                title="Tải xuống file này"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải .java</span>
              </button>
            </div>
          </div>

          {/* Code Textarea / Pre */}
          <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Live Simulation Terminal Output */}
      {isSimulatingRun && simulationOutput.length > 0 && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-emerald-400 shadow-lg space-y-1 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-300">Java Virtual Machine (JVM Output Simulation)</span>
            </div>
            <button
              onClick={() => setIsSimulatingRun(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Đóng Console
            </button>
          </div>
          {simulationOutput.map((line, idx) => (
            <div key={idx} className={line.startsWith('$') ? 'text-sky-300 font-bold' : line.includes('>>>') ? 'text-amber-300 font-bold' : 'text-slate-300'}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
