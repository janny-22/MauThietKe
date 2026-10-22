package com.dhupl;

import java.io.IOException;
import java.util.List;

/**
 Toàn bộ mã nguồn java cốt lõi
1.Khởi tạo đối tượng DHUPL.
2.Gọi chạy ví dụ chuẩn bài báo với 
3.In bảng kết quả 18 tập HUI ra màn hình console.
4.Gọi LogExporter.exportLog(...) để tự động xuất ra file dhupl_execution.log.
5.Gọi DatasetBenchmark.runAllBenchmarks() để chạy đánh giá hiệu năng Phần IV trên 4 bộ dữ liệu.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println("   DHUPL: Damped High Utility Pattern Mining with List Structure (Java)  ");
        System.out.println("==========================================================================");

        DHUPL dhupl = new DHUPL();

        // 1. Run standard paper example (Example 6, T1-T8, f = 0.5, delta = 2%)
        System.out.println("\n>>> [PHAN 1] KHAI PHA VI DU CHUAN BAI BAO (u(D)=124, f=0.5, delta=2%)");
        double decayFactor = 0.5;
        double deltaPercent = 2.0;
        int maxTid = 8;

        dhupl.runPaperExample(maxTid, decayFactor, deltaPercent);
        List<Pattern> huis = dhupl.getDiscoveredHuis();

        System.out.println("\n>>> KET QUA: TIM THAY " + huis.size() + " TAP HUI (Chuan bai bao: 18 tap HUI):");
        System.out.printf("%-4s | %-16s | %-6s | %-12s | %-10s | %-16s%n",
                "#", "Pattern (HUI)", "Length", "DampedUtil", "RawUtil", "Transactions");
        System.out.println("-----+------------------+--------+--------------+------------+------------------");

        int rank = 1;
        for (Pattern p : huis) {
            System.out.printf("%-4d | %-16s | %-6d | %-12.4f | %-10.1f | %s%n",
                    rank++,
                    p.getPatternString(),
                    p.getLength(),
                    p.getDampedUtility(),
                    p.getRawUtility(),
                    p.getTransactionsString());
        }

        // 2. Export log file
        String logFilePath = "dhupl_execution.log";
        try {
            LogExporter.exportLog(dhupl, logFilePath);
            System.out.println("\n[OK] Da xuat toan bo nhat ky tinh toan ra file: " + logFilePath);
        } catch (IOException e) {
            System.err.println("Loi khi ghi file log: " + e.getMessage());
        }

        // 3. Run Part IV Benchmarks
        System.out.println("\n>>> [PHAN IV] DANH GIA HIEU NANG TREN ACCIDENTS, MUSHROOM, CHAIN-STORE, RETAIL");
        DatasetBenchmark.runAllBenchmarks();

        System.out.println("\n==========================================================================");
        System.out.println("   HOAN THANH TOAN BO CHUONG TRINH JAVA THUAT TOAN DHUPL");
        System.out.println("==========================================================================");
    }
}
