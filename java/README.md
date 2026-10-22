# Hướng Dẫn Biên Dịch & Chạy Thuật Toán DHUPL Bằng Java

Dự án này cài đặt đầy đủ thuật toán **DHUPL (Damped High Utility Pattern Mining based List)** theo bài báo:
> **"Efficient Approach for Damped Window-Based High Utility Pattern Mining With List Structure"**  
> *Hyoju Nam, Unil Yun, Bay Vo, Tin Truong, Zhi-Hong Deng, and Eunchul Yoon*  
> **IEEE Access**, Vol. 8, pp. 50958-50968, 2020.

---

## 1. Cấu trúc thư mục mã nguồn Java
```
java/
└── src/
    └── com/
        └── dhupl/
            ├── Main.java              # Entry point chạy ví dụ và benchmark
            ├── DHUPL.java             # Thuật toán cốt lõi (Algorithm 1, Figure 6)
            ├── Element.java           # Phần tử <TID, du, ru>
            ├── UtilityList.java       # Danh sách Utility List
            ├── Pattern.java           # Mẫu HUI tìm thấy
            ├── DtwuEntry.java         # Bản ghi trong dtwu-table
            ├── Transaction.java       # Giao dịch
            ├── TransactionItem.java   # Mục trong giao dịch (iu, eu, utility)
            ├── LogExporter.java       # Xuất file log chi tiết (dhupl_execution.log)
            └── DatasetBenchmark.java  # Đánh giá Phần IV (Accidents, Mushroom, Chain-store, Retail)
```

---

## 2. Hướng dẫn biên dịch và chạy bằng Java CLI

### Bước 1: Mở terminal tại thư mục gốc dự án:
```bash
# Tạo thư mục bin chứa bytecode
mkdir -p bin

# Biên dịch toàn bộ file .java
javac -encoding UTF-8 -d bin java/src/com/dhupl/*.java
```

### Bước 2: Thực thi chương trình
```bash
java -cp bin com.dhupl.Main
```

### Bước 3: Kiểm tra kết quả
1. Console sẽ in ra đúng **18 tập HUI** xếp theo thứ tự giảm dần của Damped Utility (du), trùng khớp 100% với Ví dụ 6 bài báo IEEE Access.
2. File log chi tiết `dhupl_execution.log` sẽ được tự động tạo tại thư mục hiện tại.
3. Phần đánh giá hiệu năng (Phần IV) sẽ chạy kiểm thử và so sánh trên 4 bộ dữ liệu:
   - **Accidents** (340,183 giao dịch, 468 items)
   - **Mushroom** (8,124 giao dịch, 120 items)
   - **Chain-store** (1,112,949 giao dịch, 46,086 items)
   - **Retail** (88,162 giao dịch, 16,470 items)
