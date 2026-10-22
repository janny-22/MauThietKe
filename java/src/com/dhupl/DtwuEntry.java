package com.dhupl;
/*
Lưu trữ thông tin từng item trong bảng suy giảm:
 tên item, giá trị dtwu tích lũy và endTID (thời điểm giao dịch gần nhất chứa item đó)
*/
public class DtwuEntry {
    private String item;
    private double dtwu;
    private int endTID;

    public DtwuEntry(String item, double dtwu, int endTID) {
        this.item = item;
        this.dtwu = dtwu;
        this.endTID = endTID;
    }

    public String getItem() { return item; }
    public double getDtwu() { return dtwu; }
    public int getEndTID() { return endTID; }

    public void setDtwu(double dtwu) { this.dtwu = dtwu; }
    public void setEndTID(int endTID) { this.endTID = endTID; }
}
