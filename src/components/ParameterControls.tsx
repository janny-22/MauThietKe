import React from 'react';
import { 
  Sliders, 
  FileText, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Database, 
  Sparkles,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { HuiPattern } from '../types/dhupl';
//Phần trên của màn hình Khai phá, các cột 1,2,3 và 4 thẻ kpi bên dưới
interface ParameterControlsProps {
  decayFactor: number;
  setDecayFactor: (val: number) => void;
  deltaPercent: number;
  setDeltaPercent: (val: number) => void;
  minUtil: number;
  setMinUtilManual: (val: number) => void;
  streamStage: number; // 4, 6, 8
  setStreamStage: (stage: number) => void;
  totalDbUtility: number;
  totalHuis: number;
  is18HuisStandard: boolean;
  highestHui: HuiPattern | null;
  onOpenLogModal: () => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  decayFactor,
  setDecayFactor,
  deltaPercent,
  setDeltaPercent,
  minUtil,
  setMinUtilManual,
  streamStage,
  setStreamStage,
  totalDbUtility,
  totalHuis,
  is18HuisStandard,
  highestHui,
  onOpenLogModal,
}) => {
  // Handler when delta changes
  const handleDeltaChange = (newDelta: number) => {
    setDeltaPercent(newDelta);
    const calculatedMinutil = (totalDbUtility * newDelta) / 100.0;
    setMinUtilManual(Number(calculatedMinutil.toFixed(4)));
  };

  // Handler when minutil is typed directly
  const handleMinUtilInput = (val: number) => {
    setMinUtilManual(val);
    if (totalDbUtility > 0) {
      const calculatedDelta = (val / totalDbUtility) * 100.0;
      setDeltaPercent(Number(calculatedDelta.toFixed(3)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Parameter Control Card matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 sm:p-7 transition-all">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Nhập tham số mô hình Damped Window & Khai phá
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Nhập trực tiếp hệ số suy giảm f và ngưỡng tối thiểu δ (hoặc minutil) theo ý bạn để cập nhật danh sách 18 HUI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onOpenLogModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-sm font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Xuất file Log</span>
            </button>

            {is18HuisStandard && (
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đang ở chuẩn 18 tập HUI</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Parameter Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Column 1: Decay Factor f */}
          <div className="flex flex-col justify-between bg-slate-50/70 rounded-xl p-5 border border-slate-200/70">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                  1. NHẬP HỆ SỐ SUY GIẢM (F)
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-700 font-mono">
                  0 &lt; f ≤ 1.0
                </span>
              </div>

              <div className="relative mb-2">
                <input
                  type="number"
                  step="0.05"
                  min="0.00001"
                  max="1.0"
                  value={decayFactor}
                  onChange={(e) => setDecayFactor(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 pr-20 text-slate-900 font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-mono"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-slate-500 font-medium">
                  hệ số f
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Trọng số giao dịch: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700 font-mono">f^(T - t)</code>. Càng nhỏ thì giao dịch cũ càng giảm giá trị nhanh.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                GỢI Ý CHỌN NHANH GIÁ TRỊ F:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDecayFactor(0.5)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    decayFactor === 0.5
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  f = 0.5 (Ví dụ 6 bài báo)
                </button>
                <button
                  type="button"
                  onClick={() => setDecayFactor(0.7)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    decayFactor === 0.7
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  0.7
                </button>
                <button
                  type="button"
                  onClick={() => setDecayFactor(0.9)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    decayFactor === 0.9
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  0.9 (Ví dụ 2)
                </button>
                <button
                  type="button"
                  onClick={() => setDecayFactor(0.99999)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    decayFactor === 0.99999
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  0.99999
                </button>
                <button
                  type="button"
                  onClick={() => setDecayFactor(1.0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    decayFactor === 1.0
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  1.0 (Tĩnh)
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Threshold delta or minutil */}
          <div className="flex flex-col justify-between bg-slate-50/70 rounded-xl p-5 border border-slate-200/70">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                  2. NHẬP NGƯỠNG TỐI THIỂU
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-700 font-mono">
                  δ (%) hoặc minutil
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Ngưỡng phần trăm (δ %):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      max="100"
                      value={deltaPercent}
                      onChange={(e) => handleDeltaChange(parseFloat(e.target.value) || 0.1)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 pr-8 text-slate-900 font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-500 font-bold text-sm">
                      %
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Hoặc nhập minutil:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={minUtil}
                      onChange={(e) => handleMinUtilInput(parseFloat(e.target.value) || 0.01)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 pr-8 text-slate-900 font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-500 font-bold text-sm">
                      u
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Công thức: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700 font-mono">
                  minutil = u(D) × δ = {totalDbUtility} × {(deltaPercent / 100).toFixed(3)} = {minUtil.toFixed(2)}
                </code>
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                GỢI Ý CHỌN NHANH NGƯỠNG:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDeltaChange(2.0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deltaPercent === 2.0
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  2.0% (minutil = 2.48 - Chuẩn bài báo)
                </button>
                <button
                  type="button"
                  onClick={() => handleDeltaChange(5.0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deltaPercent === 5.0
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  5.0%
                </button>
                <button
                  type="button"
                  onClick={() => handleDeltaChange(10.0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deltaPercent === 10.0
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  10.0%
                </button>
                <button
                  type="button"
                  onClick={() => handleDeltaChange(15.0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deltaPercent === 15.0
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  15.0%
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Stream Stage */}
          <div className="flex flex-col justify-between bg-slate-50/70 rounded-xl p-5 border border-slate-200/70">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                  3. DÒNG DỮ LIỆU TÍCH LŨY (STREAM STAGE)
                </span>
                <Database className="w-4 h-4 text-sky-600" />
              </div>

              <div className="space-y-2 mb-3">
                <button
                  type="button"
                  onClick={() => setStreamStage(8)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    streamStage === 8
                      ? 'bg-sky-700 text-white shadow-xs ring-2 ring-sky-600/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>Toàn bộ DB (T1 - T8)</span>
                  <span className="font-mono font-bold">u(D) = 124</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStreamStage(6)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    streamStage === 6
                      ? 'bg-sky-700 text-white shadow-xs ring-2 ring-sky-600/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>Original + DB1+ (T1 - T6)</span>
                  <span className="font-mono font-bold">u(D) = 97</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStreamStage(4)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    streamStage === 4
                      ? 'bg-sky-700 text-white shadow-xs ring-2 ring-sky-600/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>Original DB (T1 - T4)</span>
                  <span className="font-mono font-bold">u(D) = 61</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              TU gán cứng trực tiếp từ bài báo: T1=10, T2=22, T3=11, T4=18, T5=28, T6=8, T7=9, T8=18.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-900 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Trùng khớp 100% với Ví dụ 6 bài báo IEEE Access</strong> (u(D)=124, f=0.5, δ=2% cho ra đúng 18 tập HUI)!
            </span>
          </div>

          <button
            onClick={onOpenLogModal}
            className="inline-flex items-center space-x-1 font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            <span>Xem &amp; Tải toàn bộ nhật ký tính toán (Log file)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Số tập HUI tìm thấy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            SỐ TẬP HUI TÌM THẤY
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {totalHuis}
            </span>
            {is18HuisStandard && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800">
                Chuẩn 18 tập bài báo
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
            <span>Thỏa mãn du(P) ≥ {minUtil.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 2: Ngưỡng tối thiểu */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            NGƯỠNG TỐI THIỂU (MINUTIL)
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {minUtil.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-500 font-mono">u</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            u(D) = {totalDbUtility} · f = {decayFactor.toFixed(2)}
          </div>
        </div>

        {/* Card 3: HUI Cao nhất */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            HUI CAO NHẤT
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {highestHui ? `{ ${highestHui.pattern.join(', ')} }` : '—'}
            </span>
            {highestHui && (
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 font-mono">
                {highestHui.dampedUtility.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Tại giao dịch gần nhất (T{highestHui?.transactions[highestHui.transactions.length - 1] || '8'})
          </div>
        </div>

        {/* Card 4: Thời điểm dòng hiện tại */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            THỜI ĐIỂM DÒNG HIỆN TẠI
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              T = {streamStage}
            </span>
            <span className="text-xs font-medium text-slate-500">giao dịch</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Hệ số suy giảm f = {decayFactor}
          </div>
        </div>
      </div>
    </div>
  );
};
