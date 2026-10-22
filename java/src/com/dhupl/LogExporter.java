package com.dhupl;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
/*
 Ghi toàn bộ dấu vết thực thi thuật toán ra file 
 văn bản dhupl_execution.log trên ổ cứng (bao gồm bảng dtwu, cấu trúc Global Lists, chi tiết 18 tập HUI và thời gian chạy
*/
public class LogExporter {
    public static void exportLog(DHUPL dhupl, String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            String divider = "=".repeat(80);
            String subDivider = "-".repeat(80);

            writer.write(divider); writer.newLine();
            writer.write("  DHUPL (JAVA): DAMPED HIGH UTILITY PATTERN MINING EXECUTION LOG"); writer.newLine();
            writer.write("  Reference Paper: IEEE Access, Vol. 8, pp. 50958-50968, 2020"); writer.newLine();
            writer.write(divider); writer.newLine();
            writer.write("Exported Time  : " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))); writer.newLine();
            writer.write("Total DB Util  : u(D) = " + String.format("%.2f", dhupl.getTotalDbUtility())); writer.newLine();
            writer.write("Threshold Min  : minutil = " + String.format("%.4f", dhupl.getMinUtil())); writer.newLine();
            writer.newLine();

            writer.write(subDivider); writer.newLine();
            writer.write("1. ASCENDING DTWU ORDER & ITEMS"); writer.newLine();
            writer.write(subDivider); writer.newLine();
            for (String item : dhupl.getSortedItemsAscDtwu()) {
                DtwuEntry e = dhupl.getDtwuTable().get(item);
                writer.write(String.format("  Item %-4s | dtwu: %12.4f | endTID: %3d%n", item, e.getDtwu(), e.getEndTID()));
            }
            writer.newLine();

            writer.write(subDivider); writer.newLine();
            writer.write("2. RESTRUCTURED GLOBAL UTILITY LISTS (GL)"); writer.newLine();
            writer.write(subDivider); writer.newLine();
            for (String item : dhupl.getSortedItemsAscDtwu()) {
                UtilityList ul = dhupl.getGlobalLists().get(item);
                if (ul == null) continue;
                writer.write("  UL(" + item + "): sumDu=" + String.format("%.4f", ul.getSumDu())
                        + ", sumRu=" + String.format("%.4f", ul.getSumRu())
                        + ", ub=" + String.format("%.4f", ul.getUpperBound()));
                writer.newLine();
                for (Element elem : ul.getElements()) {
                    writer.write("    " + elem.toString());
                }
                writer.newLine();
            }
            writer.newLine();

            writer.write(subDivider); writer.newLine();
            writer.write("3. DISCOVERED HIGH UTILITY PATTERNS (" + dhupl.getDiscoveredHuis().size() + " HUIs)"); writer.newLine();
            writer.write(subDivider); writer.newLine();
            writer.write(String.format("  %-4s | %-16s | %-6s | %-12s | %-10s | %s%n",
                    "#", "Pattern", "Len", "DampedUtil", "RawUtil", "Transactions"));
            int idx = 1;
            for (Pattern p : dhupl.getDiscoveredHuis()) {
                writer.write(String.format("  %-4d | %-16s | %-6d | %-12.4f | %-10.1f | %s%n",
                        idx++, p.getPatternString(), p.getLength(), p.getDampedUtility(), p.getRawUtility(), p.getTransactionsString()));
            }
            writer.newLine();

            writer.write(divider); writer.newLine();
            writer.write("  EXECUTION LOG COMPLETED SUCCESSFULLY"); writer.newLine();
            writer.write(divider); writer.newLine();
        }
    }
}
