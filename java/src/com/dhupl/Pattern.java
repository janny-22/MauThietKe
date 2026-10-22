package com.dhupl;

import java.util.List;
/*Chức năng: Chứa thông tin của một tập mẫu thỏa mãn điều kiện
Danh sách các item trong tập mẫu (ví dụ: [A, B, C]).
Giá trị (Damped Utility), (Raw Utility gốc chưa suy giảm).
Danh sách các giao dịch chứa tập mẫu đó (ví dụ: [T8]). */
public class Pattern {
    private List<String> items;
    private double dampedUtility;
    private double rawUtility;
    private List<Integer> transactions;

    public Pattern(List<String> items, double dampedUtility, double rawUtility, List<Integer> transactions) {
        this.items = items;
        this.dampedUtility = dampedUtility;
        this.rawUtility = rawUtility;
        this.transactions = transactions;
    }

    public List<String> getItems() { return items; }
    public int getLength() { return items.size(); }
    public double getDampedUtility() { return dampedUtility; }
    public double getRawUtility() { return rawUtility; }
    public List<Integer> getTransactions() { return transactions; }

    public String getPatternString() {
        return "{ " + String.join(", ", items) + " }";
    }

    public String getTransactionsString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < transactions.size(); i++) {
            sb.append("T").append(transactions.get(i));
            if (i < transactions.size() - 1) sb.append(", ");
        }
        sb.append("]");
        return sb.toString();
    }
}
