import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Search from './pages/Search';
import MyQuestions from './pages/MyQuestions';
import Streak from './pages/Streak';
import CodeEditor from './pages/CodeEditor';
import MatrixRain from './components/ui/MatrixRain';
import AIHintsPanel from './components/ui/AIHintsPanel';
import PillChoice from './components/ui/PillChoice';

export default function App() {
  const [pillSelected, setPillSelected] = useState(null); // 'red', 'blue', or null
  const [activePanel, setActivePanel] = useState('search');
  const [activeLanguage, setLanguage] = useState('python');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeProblemId, setActiveProblemId] = useState(null);

  const handleSetPanel = (panel) => {
    if (panel === 'ai-hints') {
      setIsAIOpen(true);
    } else {
      setActivePanel(panel);
    }
  };

  const handleSetProblemId = (id) => {
    setActiveProblemId(id);
    setActivePanel('editor');
  };

  // If no pill has been selected, force the immersive 3D choice interface
  if (pillSelected === null) {
    return <PillChoice onSelect={setPillSelected} />;
  }

  // If the user chooses the Blue Pill (Language Syntax Sandbox), show fallback
  if (pillSelected === 'blue') {
    return (
      <div className="w-full h-screen bg-void-black flex flex-col items-center justify-center font-code relative overflow-hidden">
        <MatrixRain />
        <div className="z-10 bg-editor-dark/80 border border-subtle-line p-10 rounded-lg text-center backdrop-blur-md shadow-[0_0_50px_rgba(0,0,255,0.1)]">
          <h1 className="text-3xl text-[#1166ff] font-display font-bold tracking-[8px] mb-4 text-glow-alt">THE ILLUSION TERMINAL</h1>
          <p className="text-muted-text text-lg tracking-[2px] mb-8 max-w-md">
            Bro, this practice terminal is currently under development. Please go back and choose the Red Capsule to enter the DSA Matrix Engine.
          </p>
          <button
            onClick={() => setPillSelected(null)}
            className="px-6 py-3 border border-accent-dim text-accent-primary hover:bg-accent-primary/10 tracking-[4px] uppercase font-bold text-sm transition-all"
          >
            ← RETURN TO CHOICE
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MatrixRain />

      <div className="flex flex-col h-screen bg-transparent text-accent-primary overflow-hidden font-code relative z-10">

        {/* Top Bar now spans fully across */}
        <TopBar activeLanguage={activeLanguage} setLanguage={setLanguage} />

        <div className="flex flex-1 overflow-hidden">
          {/* Fixed Left Sidebar */}
          <Sidebar activePanel={activePanel} setActivePanel={handleSetPanel} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative w-[calc(100vw-56px)] bg-transparent">

            {/* Main View Switcher */}
            {activePanel === 'search' && <Search setActivePanel={handleSetPanel} setActiveProblemId={setActiveProblemId} />}
            {activePanel === 'my-questions' && <MyQuestions />}
            {activePanel === 'streak' && <Streak />}
            {activePanel === 'editor' && <CodeEditor activeLanguage={activeLanguage} activeProblemId={activeProblemId} setActiveProblemId={setActiveProblemId} />}

            {/* Floating AI Panel */}
            <AIHintsPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
          </div>
        </div>

      </div>
    </>
  );
}
