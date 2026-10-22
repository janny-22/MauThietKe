import React from 'react';
import { BookOpen, CheckCircle, Lightbulb, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
//Màn hình tóm tắt cơ sở lý thuyết khoa học
export const TheorySection: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-100 flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cơ sở Lý thuyết Thuật toán DHUPL (IEEE Access 2020)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Damped High Utility Pattern mining based List: Cắt tỉa nhánh hiệu quả theo mô hình cửa sổ suy giảm thời gian
          </p>
        </div>
      </div>

      {/* Grid of Definitions & Lemmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Definition 1: Damped Utility */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-800 text-sm">Định nghĩa 1: Damped Utility (du)</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-700">du(P)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Độ thỏa dụng suy giảm của tập mẫu <em>P</em> trong cơ sở dữ liệu <em>D</em>:
          </p>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-800 text-center">
            du(P) = ∑ u(P, Td) × f^(T - t)
          </div>
          <p className="text-[11px] text-slate-500">
            Trong đó: <em>t</em> là thời điểm đến của giao dịch <em>Td</em>, <em>T</em> là thời điểm hiện tại, <em>f</em> là hệ số suy giảm (0 &lt; f ≤ 1.0).
          </p>
        </div>

        {/* Definition 2: Damped TWU */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-800 text-sm">Định nghĩa 2: Damped TWU (dtwu)</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-700">dtwu(P)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tổng độ thỏa dụng giao dịch có trọng số suy giảm của tập mẫu <em>P</em>:
          </p>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-800 text-center">
            dtwu(P) = ∑ tu(Td) × f^(T - t)
          </div>
          <p className="text-[11px] text-slate-500">
            Dùng để xác định thứ tự sắp xếp tăng dần của các mục trong bảng <code>dtwu-table</code> và Global Lists.
          </p>
        </div>

        {/* Definition 3 & 4: Remaining Utility and Upper Bound */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-800 text-sm">Định nghĩa 3 &amp; 4: Remaining Utility &amp; Upper-Bound</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-700">ub(P)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Độ thỏa dụng còn lại <em>ru(P, Td)</em> của các item đứng sau <em>P</em> theo thứ tự dtwu, và cận trên <em>ub(P)</em>:
          </p>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-800 text-center">
            ub(P) = du(P) + ru(P)
          </div>
          <p className="text-[11px] text-slate-500">
            Giá trị <em>ru</em> được tính nhanh chóng nhờ mảng tạm thời <code>SDU</code> duyệt ngược từ item cuối về item đầu.
          </p>
        </div>

        {/* Lemma 2: Lemma 2 Pruning Strategy */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 text-sm">Bổ đề 2 (Lemma 2): Chiến lược cắt tỉa cận trên</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Pruning</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            Với mọi tập cha <em>P'</em> mở rộng từ <em>P</em>, ta luôn có <strong>du(P') ≤ ub(P)</strong>:
          </p>
          <div className="bg-white p-2.5 rounded-lg border border-amber-200 font-mono text-xs font-bold text-amber-900 text-center">
            Nếu ub(P) &lt; minutil ⟹ CẮT TỈA TOÀN BỘ NHÁNH MỞ RỘNG
          </div>
          <p className="text-[11px] text-amber-800">
            Giúp loại bỏ sớm hàng triệu nhánh con không tiềm năng, không bao giờ phải sinh tập ứng viên giả mạo.
          </p>
        </div>
      </div>

      {/* Comparison why DHUPL is superior */}
      <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
        <h4 className="font-bold text-sky-900 text-sm mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Tại sao thuật toán DHUPL vượt trội hơn các giải thuật khác trong Phần IV?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="bg-white p-3 rounded-lg border border-sky-100 space-y-1">
            <span className="font-bold text-slate-900">So với GENHUI (Mô hình cây RHUI-tree):</span>
            <p className="text-slate-600 leading-relaxed">
              GENHUI xây dựng nhiều cây cục bộ đệ quy và sinh tập ứng viên (candidate generation). Khi dữ liệu lớn (như Accidents hoặc Retail), lượng ứng viên bùng nổ dẫn đến tràn bộ nhớ và thời gian quét lại rất lâu. DHUPL sử dụng danh sách 1 pha (one-phase) gọn gàng, tiết kiệm tới 60-70% bộ nhớ.
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-sky-100 space-y-1">
            <span className="font-bold text-slate-900">So với LIHUP (Không xét thời gian đến):</span>
            <p className="text-slate-600 leading-relaxed">
              LIHUP coi mọi giao dịch từ quá khứ đến hiện tại có tầm quan trọng ngang nhau. Do đó, các mẫu lỗi thời vẫn được lưu giữ và tính toán, làm tăng số lượng danh sách rác cần duyệt khi hạ thấp ngưỡng minutil. DHUPL tập trung vào tri thức mới nhất có giá trị thực tiễn cao hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
