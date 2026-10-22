import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Table as TableIcon, 
  LayoutGrid, 
  Calculator, 
  Sparkles, 
  X, 
  Layers, 
  Clock, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { HuiPattern } from '../types/dhupl';
//Bảng danh sách 18 tập HUI
/*
Ô tìm kiếm nhanh item (ví dụ: gõ "A", "BC"...).
Các nút lọc theo độ dài: Tất cả (18), 1-item (3), 2-item (9), 3-item (5), 4-item (1).
Sắp xếp theo Damped Utility, Raw Utility, độ dài, hoặc tỷ lệ vượt ngưỡng.
Nút [Tính toán]: Khi bấm vào sẽ mở một cửa sổ popup hiển thị chi tiết công thức toán học và bảng tính từng giao dịch 
với trọng số 
*/
interface HuiResultsViewProps {
  huis: HuiPattern[];
  minUtil: number;
  decayFactor: number;
  currentT: number;
}

export const HuiResultsView: React.FC<HuiResultsViewProps> = ({
  huis,
  minUtil,
  decayFactor,
  currentT,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lengthFilter, setLengthFilter] = useState<'all' | number>('all');
  const [sortBy, setSortBy] = useState<'du' | 'raw' | 'length' | 'ratio'>('du');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedHuiForDetail, setSelectedHuiForDetail] = useState<HuiPattern | null>(null);

  // Length counts for filter badges
  const countsByLength = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    huis.forEach((h) => {
      if (counts[h.length] !== undefined) {
        counts[h.length]++;
      }
    });
    return counts;
  }, [huis]);

  // Filtered & Sorted list
  const filteredHuis = useMemo(() => {
    return huis
      .filter((h) => {
        // Length filter
        if (lengthFilter !== 'all' && h.length !== lengthFilter) {
          return false;
        }
        // Search term filter
        if (searchTerm.trim()) {
          const cleanSearch = searchTerm.toUpperCase().replace(/[\s,{}]/g, '');
          const patternStr = h.pattern.join('').toUpperCase();
          if (!patternStr.includes(cleanSearch) && !h.pattern.some(it => it.toUpperCase().includes(cleanSearch))) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'du') diff = a.dampedUtility - b.dampedUtility;
        else if (sortBy === 'raw') diff = a.rawUtility - b.rawUtility;
        else if (sortBy === 'length') diff = a.length - b.length;
        else if (sortBy === 'ratio') diff = a.ratioOverMinutil - b.ratioOverMinutil;
        return sortAsc ? diff : -diff;
      });
  }, [huis, lengthFilter, searchTerm, sortBy, sortAsc]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all">
      {/* Search and Filters Bar matching Screenshot 2 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tập item (ví dụ: A, BC, D, G)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills & Action controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Length Pills */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLengthFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lengthFilter === 'all'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({huis.length})
            </button>
            <button
              onClick={() => setLengthFilter(1)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lengthFilter === 1
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-item ({countsByLength[1] || 0})
            </button>
            <button
              onClick={() => setLengthFilter(2)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lengthFilter === 2
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2-item ({countsByLength[2] || 0})
            </button>
            <button
              onClick={() => setLengthFilter(3)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lengthFilter === 3
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3-item ({countsByLength[3] || 0})
            </button>
            <button
              onClick={() => setLengthFilter(4)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lengthFilter === 4
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4-item ({countsByLength[4] || 0})
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="du">Sắp xếp: Damped Utility (du)</option>
              <option value="raw">Sắp xếp: Raw Utility (u)</option>
              <option value="length">Sắp xếp: Độ dài item</option>
              <option value="ratio">Sắp xếp: % Vượt ngưỡng</option>
            </select>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              title={sortAsc ? 'Tăng dần' : 'Giảm dần'}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-sky-600" />
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 font-semibold ${
                viewMode === 'table' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Bảng</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 font-semibold ${
                viewMode === 'cards' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Thẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Mode */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto mt-4 -mx-4 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] sm:text-xs font-bold text-sky-950 uppercase tracking-wider bg-sky-50/40">
                <th className="py-3 px-3 sm:px-4 text-center w-12">#</th>
                <th className="py-3 px-3 sm:px-4">TẬP MẪU (HUI PATTERN)</th>
                <th className="py-3 px-3 sm:px-4 text-center">ĐỘ DÀI</th>
                <th className="py-3 px-3 sm:px-4 text-right">DAMPED UTILITY (DU)</th>
                <th className="py-3 px-3 sm:px-4 text-right">RAW UTILITY (U)</th>
                <th className="py-3 px-3 sm:px-4 text-center">SỐ GIAO DỊCH</th>
                <th className="py-3 px-3 sm:px-4 min-w-[160px]">VƯỢT NGƯỠNG (DU / MINUTIL)</th>
                <th className="py-3 px-3 sm:px-4 text-center">CHI TIẾT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHuis.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Không tìm thấy tập HUI nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredHuis.map((hui) => {
                  const percent = Math.min(hui.ratioOverMinutil, 800);
                  const barWidth = Math.min(100, Math.max(12, Math.round((hui.dampedUtility / 18.0) * 100)));

                  return (
                    <tr 
                      key={hui.id}
                      className="hover:bg-sky-50/30 transition-colors group"
                    >
                      {/* Rank ID */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-bold text-sky-700">
                        {hui.id}
                      </td>

                      {/* Pattern Name */}
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {`{ ${hui.pattern.join(', ')} }`}
                          </span>
                          {hui.isTop1 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                              HUI Top 1
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Length */}
                      <td className="py-3.5 px-3 sm:px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-600 bg-slate-100">
                          {hui.length}-item
                        </span>
                      </td>

                      {/* Damped Utility */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-slate-900">
                        {hui.dampedUtility.toFixed(4)}
                      </td>

                      {/* Raw Utility */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono text-slate-600">
                        {hui.rawUtility.toFixed(1)}
                      </td>

                      {/* Transaction Count */}
                      <td className="py-3.5 px-3 sm:px-4 text-center text-xs text-slate-600">
                        <span>
                          {hui.transactions.length} ({hui.transactions.map((t) => `T${t}`).join(', ')})
                        </span>
                      </td>

                      {/* Ratio & Progress bar */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-semibold text-sky-700">
                              {hui.ratioOverMinutil}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ≥ 100%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-sky-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Calculation Detail Button */}
                      <td className="py-3.5 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => setSelectedHuiForDetail(hui)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5 text-sky-600" />
                          <span>Tính toán</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredHuis.map((hui) => (
            <div 
              key={hui.id}
              className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 p-4 transition-all shadow-2xs hover:shadow-xs hover:border-sky-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-sky-700">
                  #{hui.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                  {hui.length}-item
                </span>
              </div>

              <div className="text-base font-bold text-slate-900 font-mono mb-3">
                {`{ ${hui.pattern.join(', ')} }`}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 mb-3">
                <div>
                  <span className="text-slate-500">du(P): </span>
                  <span className="font-mono font-bold text-sky-700">{hui.dampedUtility.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-500">Raw u: </span>
                  <span className="font-mono text-slate-700">{hui.rawUtility.toFixed(1)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Giao dịch: </span>
                  <span className="font-mono text-slate-700">[{hui.transactions.map(t => `T${t}`).join(', ')}]</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-emerald-700">
                  {hui.ratioOverMinutil}% minutil
                </span>
                <button
                  onClick={() => setSelectedHuiForDetail(hui)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-700 bg-sky-100/70 hover:bg-sky-200 transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Chi tiết</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step-by-Step Calculation Breakdown Modal */}
      {selectedHuiForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-mono">
                    Chi tiết tính toán HUI: {`{ ${selectedHuiForDetail.pattern.join(', ')} }`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Công thức Định nghĩa 1 (Definition 1) bài báo: du(P) = ∑ u(P, Td) × f^(T - t)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHuiForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-sky-50/70 rounded-xl p-4 border border-sky-100 text-xs sm:text-sm text-sky-950 font-mono">
                <div>Thời điểm dòng hiện tại: <strong>T = {currentT}</strong></div>
                <div>Hệ số suy giảm: <strong>f = {decayFactor}</strong></div>
                <div>Ngưỡng minutil: <strong>{minUtil.toFixed(4)}</strong></div>
                <div className="mt-2 pt-2 border-t border-sky-200/80 font-bold text-sky-800">
                  Tổng Damped Utility: du(P) = {selectedHuiForDetail.dampedUtility.toFixed(4)} ≥ {minUtil.toFixed(4)} (HUI hợp lệ)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                      <th className="py-2 px-2">Giao dịch</th>
                      <th className="py-2 px-2">Thời điểm t</th>
                      <th className="py-2 px-2">Trọng số suy giảm f^(T - t)</th>
                      <th className="py-2 px-2 text-right">Raw u(P, Td)</th>
                      <th className="py-2 px-2 text-right font-bold text-sky-700">Damped Util</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedHuiForDetail.stepDetails?.tids.map((tid, idx) => {
                      const weight = selectedHuiForDetail.stepDetails!.weights[idx];
                      const raw = selectedHuiForDetail.stepDetails!.rawUtils[idx];
                      const weighted = selectedHuiForDetail.stepDetails!.weightedUtils[idx];
                      return (
                        <tr key={tid}>
                          <td className="py-2.5 px-2 font-bold text-slate-800">T{tid}</td>
                          <td className="py-2.5 px-2 text-slate-600">t = {tid}</td>
                          <td className="py-2.5 px-2 text-slate-600">
                            {decayFactor}^({currentT} - {tid}) = {weight.toFixed(6)}
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-700">{raw.toFixed(1)}</td>
                          <td className="py-2.5 px-2 text-right font-bold text-sky-700">
                            {weighted.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <strong>Ý nghĩa thuật toán:</strong> Dù giao dịch cũ có thể có độ thỏa dụng thô lớn, trọng số lũy thừa suy giảm sẽ làm giảm tầm quan trọng của nó, ưu tiên các giao dịch xuất hiện gần với thời điểm T={currentT}.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedHuiForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
