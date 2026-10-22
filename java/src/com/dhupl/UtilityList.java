package com.dhupl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
/*
Chức năng: Đại diện cho danh sách tiện ích của một item hoặc một tập mẫu:
Chứa danh sách các phần tử List<Element>.
Quản lý tổng sumDu (dùng để kiểm tra xem có phải là HUI không).
Quản lý tổng sumRu (dùng để tính cận trên).
Hàm getUpperBound(): trả về để thực hiện cắt tỉa Lemma 2 */
public class UtilityList {
    private List<String> items;
    private List<Element> elements;
    private double sumDu;
    private double sumRu;

    public UtilityList(String singleItem) {
        this.items = Collections.singletonList(singleItem);
        this.elements = new ArrayList<>();
        this.sumDu = 0;
        this.sumRu = 0;
    }

    public UtilityList(List<String> items) {
        this.items = new ArrayList<>(items);
        this.elements = new ArrayList<>();
        this.sumDu = 0;
        this.sumRu = 0;
    }

    public void addEntry(Element element) {
        elements.add(element);
        sumDu += element.getDu();
        sumRu += element.getRu();
    }

    public void recomputeSums() {
        sumDu = 0;
        sumRu = 0;
        for (Element e : elements) {
            sumDu += e.getDu();
            sumRu += e.getRu();
        }
    }

    public List<String> getItems() { return items; }
    public List<Element> getElements() { return elements; }
    public double getSumDu() { return sumDu; }
    public double getSumRu() { return sumRu; }

    public double getUpperBound() {
        return sumDu + sumRu;
    }

    public String getItemsetName() {
        return String.join(", ", items);
    }
}
