package com.dhupl;

import java.util.List;
/* và TransactionItem.java
Biểu diễn một giao dịch (gồm mã tid, độ thỏa dụng giao dịch gán cứng transactionUtility) và danh sách các 
mặt hàng TransactionItem (tên item, số lượng , độ thỏa dụng ). */
public class Transaction {
    private int tid;
    private double transactionUtility;
    private List<TransactionItem> items;

    public Transaction(int tid, double tu, List<TransactionItem> items) {
        this.tid = tid;
        this.transactionUtility = tu;
        this.items = items;
    }

    public int getTid() { return tid; }
    public double getTransactionUtility() { return transactionUtility; }
    public List<TransactionItem> getItems() { return items; }
}
