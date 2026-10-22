import { PAPER_EXTERNAL_UTILITIES, PAPER_TRANSACTIONS } from '../data/paperDataset';
import { DtwuEntry, HuiPattern, MiningLogEntry, Transaction, UtilityList, UtilityListEntry } from '../types/dhupl';
/*Bản cài đặt thuật toán DHUPL chạy trực tiếp trên trình duyệt, đồng bộ 100% logic với file DHUPL.java.
Khi bạn thay đổi hoặc trên giao diện, hàm runDhuplMining() sẽ tính toán lại ngay tức thì và cập nhật danh sách 18 HUI */
export interface MiningResult {
  currentT: number;
  totalDatabaseUtility: number;
  minUtil: number;
  decayFactor: number;
  deltaPercent: number;
  transactionsProcessed: Transaction[];
  dtwuTable: Record<string, DtwuEntry>;
  sortedItemsAscDtwu: string[];
  globalLists: Record<string, UtilityList>;
  discoveredHuis: HuiPattern[];
  totalCandidatesEvaluated: number;
  totalPrunedByUb: number;
  logs: MiningLogEntry[];
}

export function runDhuplMining(
  maxTid: number = 8,
  decayFactor: number = 0.5,
  deltaPercent: number = 2.0,
  manualMinutil?: number
): MiningResult {
  const logs: MiningLogEntry[] = [];
  const addLog = (level: MiningLogEntry['level'], message: string, details?: any) => {
    logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    });
  };

  addLog('INFO', `Bắt đầu thuật toán DHUPL: T=${maxTid}, f=${decayFactor}, delta=${deltaPercent}%`);

  // 1. Filter transactions up to maxTid
  const activeTransactions = PAPER_TRANSACTIONS.filter((t) => t.tid <= maxTid);
  const totalDatabaseUtility = activeTransactions.reduce((acc, t) => acc + t.transactionUtility, 0);

  const minUtil = manualMinutil !== undefined && manualMinutil > 0
    ? manualMinutil
    : (totalDatabaseUtility * deltaPercent) / 100.0;

  addLog('INFO', `Tổng độ thỏa dụng cơ sở dữ liệu u(D) = ${totalDatabaseUtility}, minutil = ${minUtil.toFixed(4)}`);

  // 2. Build dtwu-table and un-restructured global lists
  // Formula:
  // For each transaction Td with tid:
  //   For item ik in Td:
  //     if ik not in dT:
  //       dT[ik] = tu(Td), endTID = tid
  //     else:
  //       dT[ik] = dT[ik] * f^(tid - endTID) + tu(Td)
  //       endTID = tid
  //     du(ik, Td) = iu(ik, Td) * eu(ik) (raw inside this transaction, decayed later to reference T)
  const dtwuTable: Record<string, DtwuEntry> = {};
  const rawLists: Record<string, { tid: number; rawUtil: number }[]> = {};

  activeTransactions.forEach((t) => {
    const tid = t.tid;
    t.items.forEach((item) => {
      const ik = item.name;
      const prevEntry = dtwuTable[ik];
      if (!prevEntry) {
        dtwuTable[ik] = {
          item: ik,
          dtwu: t.transactionUtility,
          endTID: tid,
        };
      } else {
        const gap = tid - prevEntry.endTID;
        const decayed = prevEntry.dtwu * Math.pow(decayFactor, gap);
        prevEntry.dtwu = decayed + t.transactionUtility;
        prevEntry.endTID = tid;
      }

      if (!rawLists[ik]) {
        rawLists[ik] = [];
      }
      rawLists[ik].push({ tid, rawUtil: item.utility });
    });
  });

  // Finish scanning DB: decay remaining items whose endTID < maxTid
  Object.keys(dtwuTable).forEach((ik) => {
    const entry = dtwuTable[ik];
    if (entry.endTID < maxTid) {
      const gap = maxTid - entry.endTID;
      entry.dtwu = entry.dtwu * Math.pow(decayFactor, gap);
    }
  });

  addLog('STEP', 'Đã xây dựng xong bảng dtwu-table sau khi quét qua luồng giao dịch.');

  // 3. Sort items in ascending order of dtwu (tie-break alphabetically)
  const sortedItems = Object.keys(dtwuTable).sort((a, b) => {
    const diff = dtwuTable[a].dtwu - dtwuTable[b].dtwu;
    if (Math.abs(diff) > 1e-6) {
      return diff;
    }
    return a.localeCompare(b);
  });

  addLog('STEP', `Thứ tự sắp xếp các item theo dtwu tăng dần: ${sortedItems.join(' - ')}`);

  // 4. Build Restructured Global Lists with decayed utilities du and calculate ru
  // Calculate du for each entry: du = rawUtil * f^(maxTid - tid)
  const globalLists: Record<string, UtilityList> = {};

  sortedItems.forEach((ik) => {
    const rawEntries = rawLists[ik] || [];
    const entries: UtilityListEntry[] = rawEntries.map((e) => {
      const weight = Math.pow(decayFactor, maxTid - e.tid);
      const du = e.rawUtil * weight;
      return {
        tid: e.tid,
        du,
        ru: 0,
      };
    });

    const sumDu = entries.reduce((acc, e) => acc + e.du, 0);

    globalLists[ik] = {
      itemOrPattern: ik,
      items: [ik],
      entries,
      sumDu,
      sumRu: 0,
    };
  });

  // Calculate ru using the temporary array SDU as specified in Section III-B & Figure 3
  // Process from the last item in sortedItems down to the first
  const sduMap: Record<number, number> = {}; // <TID, SDU>

  for (let idx = sortedItems.length - 1; idx >= 0; idx--) {
    const ik = sortedItems[idx];
    const ulist = globalLists[ik];

    ulist.entries.forEach((entry) => {
      // If tid exists in SDU, ru is that value, else 0
      entry.ru = sduMap[entry.tid] || 0;
    });

    // Update sumRu
    ulist.sumRu = ulist.entries.reduce((acc, e) => acc + e.ru, 0);

    // Now add du of ik to SDU for subsequent items
    ulist.entries.forEach((entry) => {
      sduMap[entry.tid] = (sduMap[entry.tid] || 0) + entry.du;
    });
  }

  addLog('STEP', 'Đã tái cấu trúc danh sách Global Utility Lists và tính toán giá trị ru hoàn tất.');

  // 5. Mining high utility patterns with Lemma 2 pruning (ub = du + ru >= minutil)
  const discoveredHuis: HuiPattern[] = [];
  let evaluatedCandidatesCount = 0;
  let prunedCount = 0;

  // Function to join two utility lists
  const constructUtilityList = (
    prefix: string[],
    itemA: string,
    itemB: string,
    ulA: UtilityList,
    ulB: UtilityList
  ): UtilityList | null => {
    const newItems = [...prefix, itemA, itemB];
    const newPatternName = newItems.join(', ');
    const newEntries: UtilityListEntry[] = [];

    let i = 0;
    let j = 0;
    while (i < ulA.entries.length && j < ulB.entries.length) {
      const entryA = ulA.entries[i];
      const entryB = ulB.entries[j];

      if (entryA.tid === entryB.tid) {
        // du(i1i2, Td) = du(i1, Td) + du(i2, Td) (when prefix is empty)
        // or in general: du(Pij) = du(Pi) + du(Pj) - du(P)
        // In DHUPL Section III-D:
        // "du(i1i2, Td) = du(i1, Td) + du(i2, Td). ru(i1i2, Td) = min(ru(i1, Td), ru(i2, Td))."
        // For general extension with prefix:
        let combinedDu: number;
        if (prefix.length === 0) {
          combinedDu = entryA.du + entryB.du;
        } else {
          // Find prefix du in this tid
          // Find the single itemB's decayed utility in transaction
          const baseBEntry = globalLists[itemB]?.entries.find((e) => e.tid === entryA.tid);
          const baseBDu = baseBEntry ? baseBEntry.du : 0;
          combinedDu = entryA.du + baseBDu;
        }

        const combinedRu = Math.min(entryA.ru, entryB.ru);

        newEntries.push({
          tid: entryA.tid,
          du: combinedDu,
          ru: combinedRu,
        });

        i++;
        j++;
      } else if (entryA.tid < entryB.tid) {
        i++;
      } else {
        j++;
      }
    }

    if (newEntries.length === 0) return null;

    const sumDu = newEntries.reduce((acc, e) => acc + e.du, 0);
    const sumRu = newEntries.reduce((acc, e) => acc + e.ru, 0);

    return {
      itemOrPattern: newPatternName,
      items: newItems,
      entries: newEntries,
      sumDu,
      sumRu,
    };
  };

  // Compute raw utility of a pattern across active transactions
  const computeRawUtility = (items: string[], tids: number[]): number => {
    let rawTotal = 0;
    tids.forEach((tid) => {
      const t = activeTransactions.find((x) => x.tid === tid);
      if (t) {
        items.forEach((item) => {
          const it = t.items.find((x) => x.name === item);
          if (it) {
            rawTotal += it.utility;
          }
        });
      }
    });
    return rawTotal;
  };

  const registerHui = (patternItems: string[], ul: UtilityList) => {
    const sortedPattern = [...patternItems].sort();
    const tids = ul.entries.map((e) => e.tid);
    const rawUtil = computeRawUtility(sortedPattern, tids);
    const ratio = (ul.sumDu / minUtil) * 100.0;

    const stepDetails = {
      tids,
      tValues: tids,
      weights: tids.map((tid) => Math.pow(decayFactor, maxTid - tid)),
      rawUtils: tids.map((tid) => {
        const t = activeTransactions.find((x) => x.tid === tid);
        if (!t) return 0;
        return sortedPattern.reduce((acc, item) => {
          const it = t.items.find((x) => x.name === item);
          return acc + (it ? it.utility : 0);
        }, 0);
      }),
      weightedUtils: ul.entries.map((e) => e.du),
    };

    discoveredHuis.push({
      id: discoveredHuis.length + 1,
      pattern: sortedPattern,
      length: sortedPattern.length,
      dampedUtility: Number(ul.sumDu.toFixed(4)),
      rawUtility: Number(rawUtil.toFixed(1)),
      transactions: tids,
      ratioOverMinutil: Math.round(ratio),
      stepDetails,
    });
  };

  // Recursive search matching DHUPL algorithm
  const mine = (prefix: string[], prefixUL: UtilityList, candidateItems: string[]) => {
    for (let i = 0; i < candidateItems.length; i++) {
      evaluatedCandidatesCount++;
      const itemX = candidateItems[i];
      const ulX = globalLists[itemX];
      if (!ulX) continue;

      let newUL: UtilityList | null = null;
      if (prefix.length === 0) {
        // Combining two single items
        newUL = constructUtilityList([], prefixUL.items[0], itemX, prefixUL, ulX);
      } else {
        const lastPrefixItem = prefixUL.items[prefixUL.items.length - 1];
        newUL = constructUtilityList(
          prefixUL.items.slice(0, -1),
          lastPrefixItem,
          itemX,
          prefixUL,
          ulX
        );
      }

      if (!newUL) continue;

      const newPatternItems = newUL.items;
      const ub = newUL.sumDu + newUL.sumRu;

      // Check if HUI
      if (newUL.sumDu >= minUtil - 1e-6) {
        registerHui(newPatternItems, newUL);
        addLog('HUI', `Tìm thấy HUI: { ${newPatternItems.join(', ')} } với du = ${newUL.sumDu.toFixed(4)} >= minutil (${minUtil.toFixed(4)})`);
      }

      // Lemma 2 Pruning
      if (ub >= minUtil - 1e-6) {
        const remainingAfterX = candidateItems.slice(i + 1);
        if (remainingAfterX.length > 0) {
          mine(newPatternItems, newUL, remainingAfterX);
        }
      } else {
        prunedCount++;
        addLog('PRUNE', `Nhánh { ${newPatternItems.join(', ')} } bị cắt tỉa do ub=${ub.toFixed(4)} < minutil`);
      }
    }
  };

  // Step 1: Evaluate 1-itemsets
  sortedItems.forEach((ik, idx) => {
    evaluatedCandidatesCount++;
    const ul = globalLists[ik];
    if (ul.sumDu >= minUtil - 1e-6) {
      registerHui([ik], ul);
      addLog('HUI', `Item 1-itemset { ${ik} } là HUI với du = ${ul.sumDu.toFixed(4)} >= minutil`);
    }

    const ub = ul.sumDu + ul.sumRu;
    if (ub >= minUtil - 1e-6) {
      const candidatesAfter = sortedItems.slice(idx + 1);
      if (candidatesAfter.length > 0) {
        mine([], ul, candidatesAfter);
      }
    } else {
      prunedCount++;
    }
  });

  // Sort discovered HUIs descending by dampedUtility
  discoveredHuis.sort((a, b) => b.dampedUtility - a.dampedUtility);

  // Assign clean IDs and mark top 1
  discoveredHuis.forEach((h, idx) => {
    h.id = idx + 1;
    if (idx === 0) h.isTop1 = true;
  });

  addLog('INFO', `Khai phá hoàn tất! Đã tìm thấy ${discoveredHuis.length} tập HUI.`);

  return {
    currentT: maxTid,
    totalDatabaseUtility,
    minUtil,
    decayFactor,
    deltaPercent,
    transactionsProcessed: activeTransactions,
    dtwuTable,
    sortedItemsAscDtwu: sortedItems,
    globalLists,
    discoveredHuis,
    totalCandidatesEvaluated: evaluatedCandidatesCount,
    totalPrunedByUb: prunedCount,
    logs,
  };
}
