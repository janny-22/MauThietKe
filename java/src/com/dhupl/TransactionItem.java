package com.dhupl;

public class TransactionItem {
    private String name;
    private int quantity;
    private double utility;

    public TransactionItem(String name, int quantity, double utility) {
        this.name = name;
        this.quantity = quantity;
        this.utility = utility;
    }

    public String getName() { return name; }
    public int getQuantity() { return quantity; }
    public double getUtility() { return utility; }
}
