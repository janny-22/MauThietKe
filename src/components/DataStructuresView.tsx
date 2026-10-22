import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  ArrowRight, 
  Table as TableIcon, 
  Sparkles,
  Info
} from 'lucide-react';
import { MiningResult } from '../utils/dhuplEngine';

interface DataStructuresViewProps {
  miningResult: MiningResult;
}
/*Hiển thị bảng dtwu-table và thứ tự sắp xếp tăng dần của các item.
Hiển thị từng danh sách Global Utility List với các bộ ba 
Minh họa cách mảng tạm SDU duyệt ngược từ item cuối về item đầu để tính */
export const DataStructuresView: React.FC<DataStructuresViewProps> = ({ miningResult }) => {
  const [selectedItem, setSelectedItem] = useState<string>(miningResult.sortedItemsAscDtwu[0] || 'A');

  const ul = miningResult.globalLists[selectedItem];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cấu trúc Dữ liệu Global Lists &amp; Bảng DTWU
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Khảo sát chi tiết bảng dtwu-table, danh sách Global Lists (GL) và giá trị ru (Fig 2, Fig 3, Fig 4 bài báo)
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold self-start sm:self-center">
          Thứ tự dtwu: {miningResult.sortedItemsAscDtwu.join(' ➔ ')}
        </div>
      </div>

      {/* DTWU Table & Ascending Ordering */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>1. Bảng Damped Transaction Weighted Utility (dtwu-table)</span>
          <span className="text-xs font-normal text-slate-500 font-mono">(Sau khi quét đến T = {miningResult.currentT})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3 text-right">Giá trị dtwu(item)</th>
                <th className="py-2.5 px-3 text-center">endTID</th>
                <th className="py-2.5 px-3 text-center">Thứ tự tăng dần (Ascending Rank)</th>
                <th className="py-2.5 px-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {miningResult.sortedItemsAscDtwu.map((item, idx) => {
                const entry = miningResult.dtwuTable[item];
                const isSelected = item === selectedItem;
                return (
                  <tr 
                    key={item} 
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-sky-50 font-bold text-sky-900' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      Item {item}
                    </td>
                    <td className="py-2.5 px-3 text-right text-sky-700 font-bold">
                      {entry.dtwu.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">
                      T{entry.endTID}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 text-xs">
                        Hạng {idx + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                      >
                        Xem UL({item})
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restructured Global Utility Lists (GL) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <span>2. Danh sách Global Utility List: UL({selectedItem})</span>
          </h3>

          {/* Quick Item Picker Buttons */}
          <div className="flex flex-wrap gap-1">
            {miningResult.sortedItemsAscDtwu.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedItem(item)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedItem === item
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                UL({item})
              </button>
            ))}
          </div>
        </div>

        {ul ? (
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-4">
            {/* Stats row for selected UL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs block">Tổng du:</span>
                <span className="text-base font-bold text-sky-700">{ul.sumDu.toFixed(4)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs block">Tổng ru:</span>
                <span className="text-base font-bold text-slate-800">{ul.sumRu.toFixed(4)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs block">Upper Bound ub:</span>
                <span className="text-base font-bold text-indigo-700">{(ul.sumDu + ul.sumRu).toFixed(4)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs block">Đủ điều kiện HUI / Mở rộng:</span>
                <span className={`text-xs font-bold ${ul.sumDu >= miningResult.minUtil ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {ul.sumDu >= miningResult.minUtil ? 'Là HUI' : 'Chưa đạt du'} | {ul.sumDu + ul.sumRu >= miningResult.minUtil ? 'Có thể mở rộng' : 'Bị cắt tỉa'}
                </span>
              </div>
            </div>

            {/* Elements table in this UL */}
            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3">TID</th>
                    <th className="py-2 px-3 text-right">du (Damped Utility)</th>
                    <th className="py-2 px-3 text-right">ru (Remaining Utility)</th>
                    <th className="py-2 px-3 text-right">du + ru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {ul.entries.map((e) => (
                    <tr key={e.tid} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800">T{e.tid}</td>
                      <td className="py-2 px-3 text-right text-sky-700">{e.du.toFixed(4)}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{e.ru.toFixed(4)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">
                        {(e.du + e.ru).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-xs">Không tìm thấy Utility List cho mục này.</p>
        )}
      </div>

      {/* SDU Calculation Method note */}
      <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
        <strong>Thuật toán tính Remaining Utility (ru) bằng mảng SDU tạm thời:</strong> Khi tái cấu trúc danh sách Global Lists theo thứ tự dtwu tăng dần, mảng tạm SDU lưu cặp <code>&lt;TID, sum(du)&gt;</code> được duyệt ngược từ item cuối (dtwu lớn nhất) về item đầu. Tại mỗi bước, ru của entry được gán bằng giá trị hiện tại trong SDU, sau đó cộng dồn du của item vào SDU cho các item đứng trước.
      </div>
    </div>
  );
};
