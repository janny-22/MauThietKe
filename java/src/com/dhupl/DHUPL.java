package com.dhupl;

import java.util.*;
// trái tim thuật toán
public class DHUPL {
    private double decayFactor;
    private double deltaPercent;
    private double totalDbUtility;
    private double minUtil;
    private int currentT;

    private Map<String, DtwuEntry> dtwuTable = new HashMap<>();
    private List<String> sortedItemsAscDtwu = new ArrayList<>();
    private Map<String, UtilityList> globalLists = new LinkedHashMap<>();
    private List<Pattern> discoveredHuis = new ArrayList<>();
    private List<String> traceLogs = new ArrayList<>();

    private long candidatesEvaluated = 0;
    private long prunedBranches = 0;
    //Hàm tiện ích thiết lập tham số ban đầu và nạp CSDL mẫu rồi gọi hàm khai phá.
    public void runPaperExample(int maxTid, double f, double delta) {
        this.currentT = maxTid;
        this.decayFactor = f;
        this.deltaPercent = delta;
        this.discoveredHuis.clear();
        this.traceLogs.clear();
        this.candidatesEvaluated = 0;
        this.prunedBranches = 0;

        Map<String, Integer> externalUtilities = new HashMap<>();
        externalUtilities.put("A", 3);
        externalUtilities.put("B", 3);
        externalUtilities.put("C", 6);
        externalUtilities.put("D", 2);
        externalUtilities.put("E", 1);
        externalUtilities.put("F", 3);
        externalUtilities.put("G", 4);

        List<Transaction> db = createPaperTransactions(externalUtilities);
        runMiningOnTransactions(db, maxTid, f, delta);
    }

    /*
    Quét CSDL đúng 1 lần duy nhất: Cập nhật giá trị độ thỏa dụng suy giảm vào bảng dtwuTable.
    Áp dụng công thức suy giảm lũy thừa cho các mục đến trễ.
    Sắp xếp danh sách các item theo thứ tự tăng dần.
    Xây dựng danh sách Global Lists và tính độ thỏa dụng còn lại bằng mảng tạm SDU duyệt ngược từ item cuối về item đầu.
    Đánh giá các tập 1-itemset và bắt đầu gọi đệ quy mine
    */ 
    public void runMiningOnTransactions(List<Transaction> allTransactions, int maxTid, double f, double delta) {
        this.currentT = maxTid;
        this.decayFactor = f;
        this.deltaPercent = delta;
        this.dtwuTable.clear();
        this.globalLists.clear();
        this.discoveredHuis.clear();

        List<Transaction> activeTransactions = new ArrayList<>();
        this.totalDbUtility = 0;
        for (Transaction t : allTransactions) {
            if (t.getTid() <= maxTid) {
                activeTransactions.add(t);
                this.totalDbUtility += t.getTransactionUtility();
            }
        }

        this.minUtil = (this.totalDbUtility * delta) / 100.0;
        log("Bat dau DHUPL: T=" + maxTid + ", f=" + f + ", delta=" + delta + "%, u(D)=" + totalDbUtility + ", minutil=" + minUtil);

        Map<String, List<RawItemEntry>> rawEntriesMap = new HashMap<>();

        for (Transaction t : activeTransactions) {
            int tid = t.getTid();
            double tu = t.getTransactionUtility();

            for (TransactionItem item : t.getItems()) {
                String ik = item.getName();
                DtwuEntry entry = dtwuTable.get(ik);
                if (entry == null) {
                    entry = new DtwuEntry(ik, tu, tid);
                    dtwuTable.put(ik, entry);
                } else {
                    int gap = tid - entry.getEndTID();
                    double decayed = entry.getDtwu() * Math.pow(decayFactor, gap);
                    entry.setDtwu(decayed + tu);
                    entry.setEndTID(tid);
                }

                rawEntriesMap.computeIfAbsent(ik, k -> new ArrayList<>())
                        .add(new RawItemEntry(tid, item.getUtility()));
            }
        }

        for (DtwuEntry entry : dtwuTable.values()) {
            if (entry.getEndTID() < maxTid) {
                int gap = maxTid - entry.getEndTID();
                entry.setDtwu(entry.getDtwu() * Math.pow(decayFactor, gap));
            }
        }

        sortedItemsAscDtwu = new ArrayList<>(dtwuTable.keySet());
        sortedItemsAscDtwu.sort((a, b) -> {
            double diff = dtwuTable.get(a).getDtwu() - dtwuTable.get(b).getDtwu();
            if (Math.abs(diff) > 1e-6) {
                return Double.compare(dtwuTable.get(a).getDtwu(), dtwuTable.get(b).getDtwu());
            }
            return a.compareTo(b);
        });

        for (String ik : sortedItemsAscDtwu) {
            UtilityList ul = new UtilityList(ik);
            List<RawItemEntry> rawList = rawEntriesMap.getOrDefault(ik, Collections.emptyList());
            for (RawItemEntry re : rawList) {
                double weight = Math.pow(decayFactor, maxTid - re.tid);
                ul.addEntry(new Element(re.tid, re.rawUtil * weight, 0));
            }
            globalLists.put(ik, ul);
        }

        Map<Integer, Double> sduMap = new HashMap<>();
        for (int i = sortedItemsAscDtwu.size() - 1; i >= 0; i--) {
            String ik = sortedItemsAscDtwu.get(i);
            UtilityList ul = globalLists.get(ik);

            for (Element e : ul.getElements()) {
                e.setRu(sduMap.getOrDefault(e.getTid(), 0.0));
            }
            ul.recomputeSums();

            for (Element e : ul.getElements()) {
                sduMap.put(e.getTid(), sduMap.getOrDefault(e.getTid(), 0.0) + e.getDu());
            }
        }

        for (int i = 0; i < sortedItemsAscDtwu.size(); i++) {
            String ik = sortedItemsAscDtwu.get(i);
            UtilityList ul = globalLists.get(ik);
            candidatesEvaluated++;

            if (ul.getSumDu() >= minUtil - 1e-6) {
                registerHui(Collections.singletonList(ik), ul, activeTransactions);
            }

            double ub = ul.getSumDu() + ul.getSumRu();
            if (ub >= minUtil - 1e-6) {
                List<String> candidatesAfter = sortedItemsAscDtwu.subList(i + 1, sortedItemsAscDtwu.size());
                if (!candidatesAfter.isEmpty()) {
                    mine(Collections.emptyList(), ul, candidatesAfter, activeTransactions);
                }
            } else {
                prunedBranches++;
            }
        }

        discoveredHuis.sort((a, b) -> Double.compare(b.getDampedUtility(), a.getDampedUtility()));
        log("Khai pha xong! Tim thay " + discoveredHuis.size() + " tap HUI.");
    }

    /*
    Chức năng: Hàm đệ quy mở rộng mẫu (Pattern Extension).
    Cắt tỉa Lemma 2: Tại mỗi nhánh, kiểm tra Nếu,
    thuật toán cắt tỉa ngay lập tức, không mở rộng nhánh con nữa để tiết kiệm bộ nhớ và thời gian*/
    private void mine(List<String> prefix, UtilityList prefixUL, List<String> candidateItems, List<Transaction> db) {
        for (int i = 0; i < candidateItems.size(); i++) {
            candidatesEvaluated++;
            String itemX = candidateItems.get(i);
            UtilityList ulX = globalLists.get(itemX);
            if (ulX == null) continue;

            UtilityList newUL = construct(prefixUL, ulX, itemX);
            if (newUL == null || newUL.getElements().isEmpty()) continue;

            double ub = newUL.getSumDu() + newUL.getSumRu();
            if (newUL.getSumDu() >= minUtil - 1e-6) {
                registerHui(newUL.getItems(), newUL, db);
            }

            if (ub >= minUtil - 1e-6) {
                List<String> remaining = candidateItems.subList(i + 1, candidateItems.size());
                if (!remaining.isEmpty()) {
                    mine(newUL.getItems(), newUL, remaining, db);
                }
            } else {
                prunedBranches++;
            }
        }
    }
    //Chức năng: Nối (join) hai danh sách Utility List dựa 
    // trên các giao dịch chung (cùng TID) để tạo ra Utility List mới cho tập mẫu kết hợp.
    private UtilityList construct(UtilityList ulA, UtilityList ulB, String itemB) {
        List<String> newItems = new ArrayList<>(ulA.getItems());
        newItems.add(itemB);
        UtilityList result = new UtilityList(newItems);

        List<Element> listA = ulA.getElements();
        List<Element> listB = ulB.getElements();
        int i = 0, j = 0;

        while (i < listA.size() && j < listB.size()) {
            Element eA = listA.get(i);
            Element eB = listB.get(j);

            if (eA.getTid() == eB.getTid()) {
                double baseBDu = 0.0;
                UtilityList singleB = globalLists.get(itemB);
                if (singleB != null) {
                    for (Element bElem : singleB.getElements()) {
                        if (bElem.getTid() == eA.getTid()) {
                            baseBDu = bElem.getDu();
                            break;
                        }
                    }
                }

                double combinedDu = (ulA.getItems().size() == 1) ? (eA.getDu() + eB.getDu()) : (eA.getDu() + baseBDu);
                double combinedRu = Math.min(eA.getRu(), eB.getRu());

                result.addEntry(new Element(eA.getTid(), combinedDu, combinedRu));
                i++;
                j++;
            } else if (eA.getTid() < eB.getTid()) {
                i++;
            } else {
                j++;
            }
        }

        if (result.getElements().isEmpty()) return null;
        result.recomputeSums();
        return result;
    }
    //Khi một mẫu có hàm này sắp xếp lại các item 
    //theo bảng chữ cái và ghi nhận vào danh sách kết quả discoveredHuis
    private void registerHui(List<String> items, UtilityList ul, List<Transaction> db) {
        List<String> sorted = new ArrayList<>(items);
        Collections.sort(sorted);

        List<Integer> tids = new ArrayList<>();
        for (Element e : ul.getElements()) {
            tids.add(e.getTid());
        }

        double rawUtil = 0.0;
        for (int tid : tids) {
            for (Transaction t : db) {
                if (t.getTid() == tid) {
                    for (String it : sorted) {
                        for (TransactionItem ti : t.getItems()) {
                            if (ti.getName().equals(it)) {
                                rawUtil += ti.getUtility();
                            }
                        }
                    }
                }
            }
        }

        discoveredHuis.add(new Pattern(sorted, ul.getSumDu(), rawUtil, tids));
    }

    private void log(String msg) { traceLogs.add(msg); }
    public List<Pattern> getDiscoveredHuis() { return discoveredHuis; }
    public Map<String, DtwuEntry> getDtwuTable() { return dtwuTable; }
    public List<String> getSortedItemsAscDtwu() { return sortedItemsAscDtwu; }
    public Map<String, UtilityList> getGlobalLists() { return globalLists; }
    public List<String> getTraceLogs() { return traceLogs; }
    public double getTotalDbUtility() { return totalDbUtility; }
    public double getMinUtil() { return minUtil; }
    public long getCandidatesEvaluated() { return candidatesEvaluated; }
    public long getPrunedBranches() { return prunedBranches; }

    //Khởi tạo 8 giao dịch mẫu của bài báo với TU được gán cứng cố định
    public static List<Transaction> createPaperTransactions(Map<String, Integer> eu) {
        List<Transaction> list = new ArrayList<>();
        list.add(new Transaction(1, 10, Arrays.asList(
                new TransactionItem("A", 2, 2 * eu.get("A")),
                new TransactionItem("E", 1, 1 * eu.get("E")),
                new TransactionItem("F", 1, 1 * eu.get("F"))
        )));
        list.add(new Transaction(2, 22, Arrays.asList(
                new TransactionItem("A", 2, 2 * eu.get("A")),
                new TransactionItem("C", 2, 2 * eu.get("C")),
                new TransactionItem("D", 1, 1 * eu.get("D")),
                new TransactionItem("E", 2, 2 * eu.get("E"))
        )));
        list.add(new Transaction(3, 11, Arrays.asList(
                new TransactionItem("B", 1, 1 * eu.get("B")),
                new TransactionItem("D", 1, 1 * eu.get("D")),
                new TransactionItem("F", 2, 2 * eu.get("F"))
        )));
        list.add(new Transaction(4, 18, Arrays.asList(
                new TransactionItem("C", 1, 1 * eu.get("C")),
                new TransactionItem("D", 3, 3 * eu.get("D")),
                new TransactionItem("F", 2, 2 * eu.get("F"))
        )));
        list.add(new Transaction(5, 28, Arrays.asList(
                new TransactionItem("B", 2, 2 * eu.get("B")),
                new TransactionItem("C", 3, 3 * eu.get("C")),
                new TransactionItem("D", 1, 1 * eu.get("D")),
                new TransactionItem("E", 2, 2 * eu.get("E"))
        )));
        list.add(new Transaction(6, 8, Arrays.asList(
                new TransactionItem("D", 2, 2 * eu.get("D")),
                new TransactionItem("E", 1, 1 * eu.get("E")),
                new TransactionItem("F", 1, 1 * eu.get("F"))
        )));
        list.add(new Transaction(7, 9, Arrays.asList(
                new TransactionItem("A", 1, 1 * eu.get("A")),
                new TransactionItem("E", 2, 2 * eu.get("E")),
                new TransactionItem("G", 1, 1 * eu.get("G"))
        )));
        list.add(new Transaction(8, 18, Arrays.asList(
                new TransactionItem("A", 2, 2 * eu.get("A")),
                new TransactionItem("B", 2, 2 * eu.get("B")),
                new TransactionItem("C", 1, 1 * eu.get("C"))
        )));
        return list;
    }

    private static class RawItemEntry {
        int tid;
        double rawUtil;
        RawItemEntry(int tid, double rawUtil) {
            this.tid = tid;
            this.rawUtil = rawUtil;
        }
    }
}
