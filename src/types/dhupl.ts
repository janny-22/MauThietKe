export interface ItemUtility {
  name: string;
  externalUtility: number;
}
/*Khai báo các giao diện (interface) dữ liệu: Transaction, 
UtilityList, HuiPattern, DtwuEntry, DatasetPerformanceData để đảm bảo code an toàn kiểu dữ liệu. */
export interface TransactionItem {
  name: string;
  quantity: number; // internal utility (iu)
  utility: number;  // eu * iu
}

export interface Transaction {
  tid: number;
  items: TransactionItem[];
  transactionUtility: number; // tu(Td)
  streamGroup: 'Original' | 'DB1+' | 'DB2+';
}

export interface UtilityListEntry {
  tid: number;
  du: number; // damped utility in this transaction
  ru: number; // remaining utility after this item
}

export interface UtilityList {
  itemOrPattern: string; // e.g. "A" or "A, B, C"
  items: string[];
  entries: UtilityListEntry[];
  sumDu: number;
  sumRu: number;
}

export interface DtwuEntry {
  item: string;
  dtwu: number;
  endTID: number;
}

export interface HuiPattern {
  id: number;
  pattern: string[];
  length: number;
  dampedUtility: number;
  rawUtility: number;
  transactions: number[];
  ratioOverMinutil: number; // du / minutil in %
  isTop1?: boolean;
  stepDetails?: {
    tids: number[];
    tValues: number[];
    weights: number[];
    rawUtils: number[];
    weightedUtils: number[];
  };
}

export interface MiningLogEntry {
  timestamp: string;
  level: 'INFO' | 'STEP' | 'HUI' | 'PRUNE' | 'BENCHMARK';
  message: string;
  details?: any;
}

export interface DatasetPerformanceData {
  datasetKey: 'retail' | 'mushroom' | 'accidents' | 'chain-store';
  name: string;
  label: string;
  type: string;
  numTransactions: number;
  numItems: number;
  avgLength: number;
  varyingThreshold: {
    thresholds: string[];
    runtimesDHUPL: number[];
    runtimesGENHUI?: number[];
    runtimesLIHUP?: number[];
    memoryDHUPL: number[];
    memoryGENHUI?: number[];
    memoryLIHUP?: number[];
  };
  varyingSize: {
    sizes: string[]; // 20%, 40%, 60%, 80%, 100%
    runtimesDHUPL: number[];
    runtimesGENHUI: number[];
    runtimesLIHUP: number[];
    memoryDHUPL: number[];
    memoryGENHUI: number[];
    memoryLIHUP: number[];
  };
}
