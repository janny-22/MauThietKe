import React, { useState } from 'react';
import { BENCHMARK_DATASETS } from '../data/paperDataset';

// Dữ liệu kiểm thử độ chịu tải (Scalability - Data Size từ 20% -> 100%) trích từ IEEE Access
const DATASET_SCALABILITY: Record<
  string,
  {
    name: string;
    fixedDelta: string;
    data: { sizePct: string; txns: string; runtime: number; memory: number }[];
  }
> = {
  retail: {
    name: 'Retail',
    fixedDelta: '0.2%',
    data: [
      { sizePct: '20%', txns: '17,632', runtime: 1.2, memory: 22.0 },
      { sizePct: '40%', txns: '35,265', runtime: 3.5, memory: 31.0 },
      { sizePct: '60%', txns: '52,897', runtime: 7.2, memory: 40.0 },
      { sizePct: '80%', txns: '70,530', runtime: 14.0, memory: 46.0 },
      { sizePct: '100%', txns: '88,162', runtime: 25.0, memory: 52.0 },
    ],
  },
  mushroom: {
    name: 'Mushroom',
    fixedDelta: '10%',
    data: [
      { sizePct: '20%', txns: '1,625', runtime: 1.1, memory: 45.0 },
      { sizePct: '40%', txns: '3,250', runtime: 3.8, memory: 72.0 },
      { sizePct: '60%', txns: '4,874', runtime: 8.2, memory: 95.0 },
      { sizePct: '80%', txns: '6,499', runtime: 14.5, memory: 110.0 },
      { sizePct: '100%', txns: '8,124', runtime: 22.0, memory: 125.0 },
    ],
  },
  accidents: {
    name: 'Accidents',
    fixedDelta: '30%',
    data: [
      { sizePct: '20%', txns: '68,036', runtime: 0.8, memory: 72.0 },
      { sizePct: '40%', txns: '136,073', runtime: 2.4, memory: 145.0 },
      { sizePct: '60%', txns: '204,110', runtime: 4.8, memory: 220.0 },
      { sizePct: '80%', txns: '272,146', runtime: 8.2, memory: 305.0 },
      { sizePct: '100%', txns: '340,183', runtime: 12.0, memory: 384.0 },
    ],
  },
  'chain-store': {
    name: 'Chain-store',
    fixedDelta: '0.25%',
    data: [
      { sizePct: '20%', txns: '222,590', runtime: 1.5, memory: 148.0 },
      { sizePct: '40%', txns: '445,180', runtime: 4.2, memory: 198.0 },
      { sizePct: '60%', txns: '667,769', runtime: 8.1, memory: 248.0 },
      { sizePct: '80%', txns: '890,359', runtime: 12.8, memory: 298.0 },
      { sizePct: '100%', txns: '1,112,949', runtime: 18.0, memory: 350.0 },
    ],
  },
};

export const VisualCharts: React.FC = () => {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>('retail');

  const dataset = BENCHMARK_DATASETS[selectedDatasetKey] || BENCHMARK_DATASETS['retail'];
  const scalabilityInfo = DATASET_SCALABILITY[selectedDatasetKey] || DATASET_SCALABILITY['retail'];

  // --- 1. Tính toán cho Biểu đồ Threshold ---
  const thresholds = dataset.varyingThreshold.thresholds;
  const runtimesThreshold = dataset.varyingThreshold.runtimesDHUPL;
  const memoryThreshold = dataset.varyingThreshold.memoryDHUPL;

  const maxRuntimeThresh = Math.max(...runtimesThreshold) * 1.15;
  const maxMemoryThresh = Math.max(...memoryThreshold) * 1.25;

  // --- 2. Tính toán cho Biểu đồ Data Size ---
  const sizes = scalabilityInfo.data.map((item) => item.sizePct);
  const runtimesSize = scalabilityInfo.data.map((item) => item.runtime);
  const memorySize = scalabilityInfo.data.map((item) => item.memory);

  const maxRuntimeSize = Math.max(...runtimesSize) * 1.2;
  const maxMemorySize = Math.max(...memorySize) * 1.25;

  // Khung hình SVG
  const chartWidth = 470;
  const chartHeight = 260;
  const padding = { top: 30, right: 30, bottom: 45, left: 45 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Điểm tọa độ Runtime Threshold
  const threshPoints = thresholds.map((_, idx) => {
    const x = padding.left + (idx / (thresholds.length - 1)) * graphWidth;
    const yVal = runtimesThreshold[idx];
    const y = padding.top + graphHeight - (yVal / maxRuntimeThresh) * graphHeight;
    return { x, y, val: yVal };
  });

  const threshPathD = threshPoints.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  // Điểm tọa độ Runtime Data Size
  const sizePoints = sizes.map((_, idx) => {
    const x = padding.left + (idx / (sizes.length - 1)) * graphWidth;
    const yVal = runtimesSize[idx];
    const y = padding.top + graphHeight - (yVal / maxRuntimeSize) * graphHeight;
    return { x, y, val: yVal };
  });

  const sizePathD = sizePoints.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-10">
      {/* HEADER BẬC CAO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Biểu Đồ Đánh Giá Hiệu Năng Thuật Toán DHUPL
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đánh giá theo Ngưỡng tối thiểu (Threshold) và Quy mô Dữ liệu (Data Size / Scalability)
          </p>
        </div>

        {/* Dropdown chọn Dataset */}
        <div className="flex items-center space-x-2.5">
          <label className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
            Chọn Tập Dữ Liệu:
          </label>
          <select
            value={selectedDatasetKey}
            onChange={(e) => setSelectedDatasetKey(e.target.value)}
            className="bg-white border border-sky-300 hover:border-sky-500 text-sky-950 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="retail">Retail (Thưa - Sparse)</option>
            <option value="mushroom">Mushroom (Dày - Dense)</option>
            <option value="accidents">Accidents (Rất dày - Very Dense)</option>
            <option value="chain-store">Chain-store (Lớn thưa - Large Sparse)</option>
          </select>
        </div>
      </div>

      {/* ================= PHẦN 1: THỬ NGHIỆM THEO NGƯỠNG (THRESHOLD TEST) ================= */}
      <div className="space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-sky-900 flex items-center gap-2">
          <span>🎯</span> 1. Đánh giá theo Ngưỡng tối thiểu (Varying Threshold δ Test)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ (a) Runtime according to Threshold */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 text-center mb-2">
              (a) Runtime of DHUPL on {dataset.name} (sec)
            </h4>

            <div className="w-full flex justify-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[500px]">
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
                  const y = padding.top + graphHeight * (1 - frac);
                  const labelVal = Math.round(maxRuntimeThresh * frac);
                  return (
                    <g key={i}>
                      <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                      <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">{labelVal}</text>
                    </g>
                  );
                })}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={padding.left} y1={padding.top + graphHeight} x2={chartWidth - padding.right} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                {threshPoints.map((pt, idx) => (
                  <g key={idx}>
                    <line x1={pt.x} y1={padding.top + graphHeight} x2={pt.x} y2={padding.top + graphHeight + 6} stroke="#94a3b8" />
                    <text x={pt.x} y={padding.top + graphHeight + 20} textAnchor="middle" fontSize="11" fill="#475569">{thresholds[idx]}</text>
                  </g>
                ))}
                <path d={threshPathD} fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {threshPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-3 text-xs font-semibold text-slate-700">
              <span className="w-5 h-0.5 bg-sky-600 inline-block relative">
                <span className="w-2 h-2 rounded-full border border-sky-600 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </span>
              <span className="text-sky-700 font-bold">DHUPL Algorithm</span>
            </div>
          </div>

          {/* Biểu đồ (b) Memory according to Threshold */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 text-center mb-2">
              (b) Memory Usage of DHUPL on {dataset.name} (MB)
            </h4>

            <div className="w-full flex justify-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[500px]">
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
                  const y = padding.top + graphHeight * (1 - frac);
                  const labelVal = Math.round(maxMemoryThresh * frac);
                  return (
                    <g key={i}>
                      <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                      <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">{labelVal}</text>
                    </g>
                  );
                })}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={padding.left} y1={padding.top + graphHeight} x2={chartWidth - padding.right} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                {thresholds.map((t, idx) => {
                  const slotWidth = graphWidth / thresholds.length;
                  const barWidth = slotWidth * 0.48;
                  const x = padding.left + idx * slotWidth + (slotWidth - barWidth) / 2;
                  const memVal = memoryThreshold[idx];
                  const barHeight = (memVal / maxMemoryThresh) * graphHeight;
                  const y = padding.top + graphHeight - barHeight;
                  return (
                    <g key={idx}>
                      <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="#0284c7" />
                      <text x={x + barWidth / 2} y={padding.top + graphHeight + 20} textAnchor="middle" fontSize="11" fill="#475569">{t}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-3 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 bg-sky-600 rounded-xs inline-block" />
              <span className="text-sky-700 font-bold">DHUPL Algorithm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 2: BẢNG SỐ LIỆU DATA SIZE ================= */}
<div className="space-y-3 bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
      <span>📋</span> Bảng Dữ Liệu Thực Nghiệm Theo Data Size (Scalability - Cố định δ = {scalabilityInfo.fixedDelta})
    </h3>

    {/* ĐÃ THAY BẰNG THẺ CHỌN TẬP DỮ LIỆU ĐỘNG (DROPDOWN SELECT) */}
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-sky-900">Chọn Tập dữ liệu:</span>
      <select
        value={selectedDatasetKey}
        onChange={(e) => setSelectedDatasetKey(e.target.value)}
        className="px-3 py-1.5 bg-white border border-sky-300 hover:border-sky-500 rounded-xl text-xs font-bold text-sky-950 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
      >
        <option value="retail">Retail (Thưa - 88k txns)</option>
        <option value="mushroom">Mushroom (Dày - 8.1k txns)</option>
        <option value="accidents">Accidents (Rất dày - 340k txns)</option>
        <option value="chain-store">Chain-store (Lớn thưa - 1.11M txns)</option>
      </select>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs font-mono bg-white border border-sky-200 rounded-xl overflow-hidden shadow-2xs">
      <thead className="bg-sky-100/70 text-sky-900 font-bold border-b border-sky-200">
        <tr>
          <th className="py-2.5 px-4">Kích thước CSDL (%)</th>
          <th className="py-2.5 px-4 text-right">Số giao dịch</th>
          <th className="py-2.5 px-4 text-right">Runtime DHUPL (giây)</th>
          <th className="py-2.5 px-4 text-right">Memory DHUPL (MB)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sky-100">
        {scalabilityInfo.data.map((row) => (
          <tr key={row.sizePct} className="hover:bg-sky-50 font-medium">
            <td className="py-2 px-4 font-bold text-sky-950">{row.sizePct} CSDL</td>
            <td className="py-2 px-4 text-right text-slate-700">{row.txns}</td>
            <td className="py-2 px-4 text-right font-extrabold text-sky-950">{row.runtime.toFixed(1)} s</td>
            <td className="py-2 px-4 text-right font-semibold text-sky-800">{row.memory.toFixed(1)} MB</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      {/* ================= PHẦN 3: BIỂU ĐỒ VẼ TỪ BẢNG DATA SIZE ================= */}
      <div className="space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-sky-900 flex items-center gap-2">
          <span>📈</span> 2. Biểu Đồ Đánh Giá Độ Khả Mở (Scalability Chart according to Data Size)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ (c) Runtime according to Data Size */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 text-center mb-2">
              (c) Scalability: Runtime vs Data Size on {scalabilityInfo.name} (sec)
            </h4>

            <div className="w-full flex justify-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[500px]">
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
                  const y = padding.top + graphHeight * (1 - frac);
                  const labelVal = Math.round(maxRuntimeSize * frac);
                  return (
                    <g key={i}>
                      <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                      <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">{labelVal}</text>
                    </g>
                  );
                })}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={padding.left} y1={padding.top + graphHeight} x2={chartWidth - padding.right} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                {sizePoints.map((pt, idx) => (
                  <g key={idx}>
                    <line x1={pt.x} y1={padding.top + graphHeight} x2={pt.x} y2={padding.top + graphHeight + 6} stroke="#94a3b8" />
                    <text x={pt.x} y={padding.top + graphHeight + 20} textAnchor="middle" fontSize="11" fill="#475569">{sizes[idx]}</text>
                  </g>
                ))}
                <path d={sizePathD} fill="none" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {sizePoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-3 text-xs font-semibold text-slate-700">
              <span className="w-5 h-0.5 bg-teal-600 inline-block relative">
                <span className="w-2 h-2 rounded-full border border-teal-600 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </span>
              <span className="text-teal-700 font-bold">DHUPL (Scalability Test)</span>
            </div>
          </div>

          {/* Biểu đồ (d) Memory according to Data Size */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 text-center mb-2">
              (d) Scalability: Memory vs Data Size on {scalabilityInfo.name} (MB)
            </h4>

            <div className="w-full flex justify-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[500px]">
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
                  const y = padding.top + graphHeight * (1 - frac);
                  const labelVal = Math.round(maxMemorySize * frac);
                  return (
                    <g key={i}>
                      <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                      <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">{labelVal}</text>
                    </g>
                  );
                })}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={padding.left} y1={padding.top + graphHeight} x2={chartWidth - padding.right} y2={padding.top + graphHeight} stroke="#cbd5e1" strokeWidth="1.5" />
                {sizes.map((s, idx) => {
                  const slotWidth = graphWidth / sizes.length;
                  const barWidth = slotWidth * 0.48;
                  const x = padding.left + idx * slotWidth + (slotWidth - barWidth) / 2;
                  const memVal = memorySize[idx];
                  const barHeight = (memVal / maxMemorySize) * graphHeight;
                  const y = padding.top + graphHeight - barHeight;
                  return (
                    <g key={idx}>
                      <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="#0d9488" />
                      <text x={x + barWidth / 2} y={padding.top + graphHeight + 20} textAnchor="middle" fontSize="11" fill="#475569">{s}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-3 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 bg-teal-600 rounded-xs inline-block" />
              <span className="text-teal-700 font-bold">DHUPL (Scalability Test)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};