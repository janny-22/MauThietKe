import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ParameterControls } from './components/ParameterControls';
import { HuiResultsView } from './components/HuiResultsView';
import { VisualCharts } from './components/VisualCharts';
import { DataStructuresView } from './components/DataStructuresView';
import { TheorySection } from './components/TheorySection';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { LogExportModal } from './components/LogExportModal';
import { runDhuplMining } from './utils/dhuplEngine';
/*Quản lý trạng thái trung tâm của trang web: tab đang chọn (activeTab), 
hệ số , ngưỡng , giai đoạn luồng 
Gọi runDhuplMining khi có sự thay đổi tham số.
Điều phối và lắp ráp các component (Navbar, ParameterControls, HuiResultsView, VisualCharts,...) thành một ứng dụng hoàn chỉnh. */
export default function App() {
  const [activeTab, setActiveTab] = useState<'mining' | 'charts' | 'structures' | 'java' | 'theory'>('mining');
  const [decayFactor, setDecayFactor] = useState<number>(0.5);
  const [deltaPercent, setDeltaPercent] = useState<number>(2.0);
  const [streamStage, setStreamStage] = useState<number>(8); // T1-T4=4, T1-T6=6, T1-T8=8
  const [manualMinUtil, setManualMinUtil] = useState<number>(2.48);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Compute live mining results via DHUPL algorithm
  const miningResult = useMemo(() => {
    return runDhuplMining(streamStage, decayFactor, deltaPercent, manualMinUtil);
  }, [streamStage, decayFactor, deltaPercent, manualMinUtil]);

  // Is standard 18 HUIs active?
  const is18HuisStandard = useMemo(() => {
    return (
      streamStage === 8 &&
      Math.abs(decayFactor - 0.5) < 0.001 &&
      (Math.abs(deltaPercent - 2.0) < 0.05 || Math.abs(manualMinUtil - 2.48) < 0.05) &&
      miningResult.discoveredHuis.length === 18
    );
  }, [streamStage, decayFactor, deltaPercent, manualMinUtil, miningResult]);

  const highestHui = miningResult.discoveredHuis.length > 0 ? miningResult.discoveredHuis[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        is18HuisStandard={is18HuisStandard}
        totalHuis={miningResult.discoveredHuis.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Mining & 18 HUIs View */}
        {activeTab === 'mining' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ParameterControls
              decayFactor={decayFactor}
              setDecayFactor={setDecayFactor}
              deltaPercent={deltaPercent}
              setDeltaPercent={setDeltaPercent}
              minUtil={miningResult.minUtil}
              setMinUtilManual={setManualMinUtil}
              streamStage={streamStage}
              setStreamStage={setStreamStage}
              totalDbUtility={miningResult.totalDatabaseUtility}
              totalHuis={miningResult.discoveredHuis.length}
              is18HuisStandard={is18HuisStandard}
              highestHui={highestHui}
              onOpenLogModal={() => setIsLogModalOpen(true)}
            />

            <HuiResultsView
              huis={miningResult.discoveredHuis}
              minUtil={miningResult.minUtil}
              decayFactor={decayFactor}
              currentT={streamStage}
            />
          </div>
        )}

        {/* Tab 2: Visual Charts (Section IV Performance Evaluation) */}
        {activeTab === 'charts' && (
          <div className="animate-in fade-in duration-200">
            <VisualCharts />
          </div>
        )}

        {/* Tab 3: Data Structures (GL, DTWU Table, SDU array) */}
        {activeTab === 'structures' && (
          <div className="animate-in fade-in duration-200">
            <DataStructuresView miningResult={miningResult} />
          </div>
        )}

        {/* Tab 4: Java Codebase Viewer */}
        {activeTab === 'java' && (
          <div className="animate-in fade-in duration-200">
            <JavaCodeViewer />
          </div>
        )}

        {/* Tab 5: Theoretical Foundations */}
        {activeTab === 'theory' && (
          <div className="animate-in fade-in duration-200">
            <TheorySection />
          </div>
        )}
      </main>

      {/* Log Export Modal */}
      <LogExportModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        miningResult={miningResult}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-700">
            Cài đặt hoàn chỉnh thuật toán DHUPL (Java &amp; Interactive Web Suite) — IEEE Access 2020
          </p>
          <p>
            Mã hóa theo bài báo: <em>"Efficient Approach for Damped Window-Based High Utility Pattern Mining With List Structure"</em>
          </p>
        </div>
      </footer>
    </div>
  );
}
