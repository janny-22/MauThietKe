package com.dhupl;
/*
Chức năng: Đại diện cho một bộ 3 giá trị 
 trong Utility List.
tid: Mã định danh giao dịch.
du: Damped Utility của tập mẫu trong giao dịch này (đã nhân trọng số suy giảm ).
ru: Remaining Utility (tổng của các item đứng sau tập mẫu theo thứ tự sắp xếp */
public class Element {
    private int tid;
    private double du;
    private double ru;

    public Element(int tid, double du, double ru) {
        this.tid = tid;
        this.du = du;
        this.ru = ru;
    }

    public int getTid() { return tid; }
    public double getDu() { return du; }
    public double getRu() { return ru; }

    public void setRu(double ru) { this.ru = ru; }
    public void setDu(double du) { this.du = du; }

    @Override
    public String toString() {
        return String.format("<T%d, du:%.4f, ru:%.4f>", tid, du, ru);
    }
}
