import { DatasetPerformanceData, ItemUtility, Transaction } from '../types/dhupl';
/*Lưu trữ giá trị (độ thỏa dụng ngoại biên: ).
Lưu 8 giao dịch với TU gán cứng trực tiếp ().
Lưu trữ sẵn bảng số liệu thực nghiệm chuẩn bài báo của 4 bộ dữ liệu Retail, Mushroom, Accidents, Chain-store cho phần biểu đồ. */
export const PAPER_EXTERNAL_UTILITIES: Record<string, number> = {
  A: 3,
  B: 3,
  C: 6,
  D: 2,
  E: 1,
  F: 3,
  G: 4,
};

export const PAPER_ITEMS: ItemUtility[] = [
  { name: 'A', externalUtility: 3 },
  { name: 'B', externalUtility: 3 },
  { name: 'C', externalUtility: 6 },
  { name: 'D', externalUtility: 2 },
  { name: 'E', externalUtility: 1 },
  { name: 'F', externalUtility: 3 },
  { name: 'G', externalUtility: 4 },
];

export const PAPER_TRANSACTIONS: Transaction[] = [
  {
    tid: 1,
    streamGroup: 'Original',
    transactionUtility: 10,
    items: [
      { name: 'A', quantity: 2, utility: 6 },
      { name: 'E', quantity: 1, utility: 1 },
      { name: 'F', quantity: 1, utility: 3 },
    ],
  },
  {
    tid: 2,
    streamGroup: 'Original',
    transactionUtility: 22,
    items: [
      { name: 'A', quantity: 2, utility: 6 },
      { name: 'C', quantity: 2, utility: 12 },
      { name: 'D', quantity: 1, utility: 2 },
      { name: 'E', quantity: 2, utility: 2 },
    ],
  },
  {
    tid: 3,
    streamGroup: 'Original',
    transactionUtility: 11,
    items: [
      { name: 'B', quantity: 1, utility: 3 },
      { name: 'D', quantity: 1, utility: 2 },
      { name: 'F', quantity: 2, utility: 6 },
    ],
  },
  {
    tid: 4,
    streamGroup: 'Original',
    transactionUtility: 18,
    items: [
      { name: 'C', quantity: 1, utility: 6 },
      { name: 'D', quantity: 3, utility: 6 },
      { name: 'F', quantity: 2, utility: 6 },
    ],
  },
  {
    tid: 5,
    streamGroup: 'DB1+',
    transactionUtility: 28,
    items: [
      { name: 'B', quantity: 2, utility: 6 },
      { name: 'C', quantity: 3, utility: 18 },
      { name: 'D', quantity: 1, utility: 2 },
      { name: 'E', quantity: 2, utility: 2 },
    ],
  },
  {
    tid: 6,
    streamGroup: 'DB1+',
    transactionUtility: 8,
    items: [
      { name: 'D', quantity: 2, utility: 4 },
      { name: 'E', quantity: 1, utility: 1 },
      { name: 'F', quantity: 1, utility: 3 },
    ],
  },
  {
    tid: 7,
    streamGroup: 'DB2+',
    transactionUtility: 9,
    items: [
      { name: 'A', quantity: 1, utility: 3 },
      { name: 'E', quantity: 2, utility: 2 },
      { name: 'G', quantity: 1, utility: 4 },
    ],
  },
  {
    tid: 8,
    streamGroup: 'DB2+',
    transactionUtility: 18,
    items: [
      { name: 'A', quantity: 2, utility: 6 },
      { name: 'B', quantity: 2, utility: 6 },
      { name: 'C', quantity: 1, utility: 6 },
    ],
  },
];

export const BENCHMARK_DATASETS: Record<string, DatasetPerformanceData> = {
  retail: {
    datasetKey: 'retail',
    name: 'Retail',
    label: 'Retail (Thưa - Sparse)',
    type: 'Thưa (Sparse)',
    numTransactions: 88162,
    numItems: 16470,
    avgLength: 10.306,
    varyingThreshold: {
      thresholds: ['0.5%', '0.4%', '0.3%', '0.2%', '0.1%'],
      runtimesDHUPL: [5.0, 8.0, 12.0, 25.0, 62.0],
      memoryDHUPL: [45.0, 48.0, 50.0, 52.0, 58.0],
    },
    varyingSize: {
      sizes: ['20%', '40%', '60%', '80%', '100%'],
      runtimesDHUPL: [0.5, 0.9, 1.3, 1.7, 2.2],
      runtimesGENHUI: [1.2, 1.8, 2.4, 3.1, 3.8],
      runtimesLIHUP: [0.8, 1.3, 1.9, 2.5, 3.2],
      memoryDHUPL: [22.0, 26.5, 31.0, 35.5, 40.0],
      memoryGENHUI: [45.0, 55.0, 65.0, 75.0, 85.0],
      memoryLIHUP: [23.0, 27.5, 32.5, 37.0, 42.0],
    },
  },
  mushroom: {
    datasetKey: 'mushroom',
    name: 'Mushroom',
    label: 'Mushroom (Dày - Dense)',
    type: 'Dày (Dense)',
    numTransactions: 8124,
    numItems: 120,
    avgLength: 23.0,
    varyingThreshold: {
      thresholds: ['20%', '15%', '10%', '5%', '1%'],
      runtimesDHUPL: [10.0, 15.0, 22.0, 45.0, 105.0],
      memoryDHUPL: [120.0, 125.0, 125.0, 130.0, 140.0],
    },
    varyingSize: {
      sizes: ['20%', '40%', '60%', '80%', '100%'],
      runtimesDHUPL: [15.0, 32.0, 55.0, 78.0, 105.0],
      runtimesGENHUI: [22.0, 48.0, 85.0, 120.0, 155.0],
      runtimesLIHUP: [18.0, 40.0, 72.0, 105.0, 140.0],
      memoryDHUPL: [115.0, 120.0, 125.0, 130.0, 140.0],
      memoryGENHUI: [150.0, 168.0, 185.0, 202.0, 220.0],
      memoryLIHUP: [118.0, 122.0, 127.0, 132.0, 142.0],
    },
  },
  accidents: {
    datasetKey: 'accidents',
    name: 'Accidents',
    label: 'Accidents (Rất dày - Very Dense)',
    type: 'Rất dày (Very Dense)',
    numTransactions: 340183,
    numItems: 468,
    avgLength: 33.808,
    varyingThreshold: {
      thresholds: ['30%', '25%', '20%', '15%', '10%'],
      runtimesDHUPL: [12.0, 28.0, 95.0, 380.0, 1800.0],
      runtimesGENHUI: [25.0, 75.0, 290.0, 1450.0, 7200.0],
      runtimesLIHUP: [18.0, 48.0, 180.0, 850.0, 4100.0],
      memoryDHUPL: [384.0, 390.0, 400.0, 408.0, 414.0],
      memoryGENHUI: [652.0, 660.0, 672.0, 680.0, 689.0],
      memoryLIHUP: [515.0, 580.0, 670.0, 760.0, 868.0],
    },
    varyingSize: {
      sizes: ['20%', '40%', '60%', '80%', '100%'],
      runtimesDHUPL: [0.8, 2.4, 4.8, 8.2, 12.0],
      runtimesGENHUI: [2.1, 5.5, 9.8, 14.1, 18.2],
      runtimesLIHUP: [1.4, 3.8, 7.2, 11.0, 15.1],
      memoryDHUPL: [72.0, 145.0, 220.0, 305.0, 384.0],
      memoryGENHUI: [125.0, 250.0, 380.0, 510.0, 652.0],
      memoryLIHUP: [95.0, 190.0, 290.0, 400.0, 515.0],
    },
  },
  'chain-store': {
    datasetKey: 'chain-store',
    name: 'Chain-store',
    label: 'Chain-store (Lớn thưa - Large Sparse)',
    type: 'Lớn thưa (Large Sparse)',
    numTransactions: 1112949,
    numItems: 46086,
    avgLength: 7.2,
    varyingThreshold: {
      thresholds: ['0.30%', '0.25%', '0.20%', '0.15%', '0.10%'],
      runtimesDHUPL: [15.0, 18.0, 24.0, 38.0, 72.0],
      runtimesGENHUI: [35.0, 55.0, 95.0, 180.0, 360.0],
      runtimesLIHUP: [22.0, 32.0, 52.0, 98.0, 195.0],
      memoryDHUPL: [345.0, 350.0, 355.0, 358.0, 362.0],
      memoryGENHUI: [580.0, 620.0, 670.0, 710.0, 760.0],
      memoryLIHUP: [350.0, 358.0, 365.0, 372.0, 380.0],
    },
    varyingSize: {
      sizes: ['20%', '40%', '60%', '80%', '100%'],
      runtimesDHUPL: [1.5, 4.2, 8.1, 12.8, 18.0],
      runtimesGENHUI: [3.2, 8.8, 15.0, 21.5, 28.2],
      runtimesLIHUP: [2.1, 5.9, 11.2, 17.5, 24.0],
      memoryDHUPL: [148.0, 198.0, 248.0, 298.0, 350.0],
      memoryGENHUI: [280.0, 385.0, 490.0, 600.0, 710.0],
      memoryLIHUP: [160.0, 210.0, 260.0, 310.0, 360.0],
    },
  },
};
