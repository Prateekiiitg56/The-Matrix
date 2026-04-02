import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Search from './pages/Search';
import MyQuestions from './pages/MyQuestions';
import Streak from './pages/Streak';
import CodeEditor from './pages/CodeEditor';
import MatrixRain from './components/ui/MatrixRain';
import AIHintsPanel from './components/ui/AIHintsPanel';
import IntroSequence from './components/intro/IntroSequence';

import ConstructApp from './pages/construct/ConstructApp';

// Check if we've already seen the intro this session
const hasSeenIntro = () => sessionStorage.getItem('matrix-intro-done') === 'true';

export default function App() {
  const [introComplete, setIntroComplete] = useState(hasSeenIntro());
  const [selectedWorld, setSelectedWorld] = useState(sessionStorage.getItem('matrix-world') || null); // 'red' or 'blue'
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

  const handleIntroComplete = (world) => {
    sessionStorage.setItem('matrix-intro-done', 'true');
    sessionStorage.setItem('matrix-world', world);
    setSelectedWorld(world);
    setIntroComplete(true);
  };

  // Show the cinematic intro until the user makes their pill choice
  if (!introComplete || !selectedWorld) {
    return <IntroSequence onIntroComplete={handleIntroComplete} />;
  }

  // The Blue Pill path
  if (selectedWorld === 'blue') {
    return <ConstructApp onExit={() => {
      sessionStorage.removeItem('matrix-world');
      setSelectedWorld(null);
      setIntroComplete(false); // Restart intro for demo purposes
    }} />;
  }

  // The Red Pill path (Main DSA Component)
  return (
    <>
      <MatrixRain />

      <div className="flex flex-col h-screen bg-transparent text-accent-primary overflow-hidden font-code relative z-10">

        <TopBar activeLanguage={activeLanguage} setLanguage={setLanguage} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar activePanel={activePanel} setActivePanel={handleSetPanel} />

          <div className="flex-1 flex flex-col relative w-[calc(100vw-56px)] bg-transparent">

            {activePanel === 'search' && <Search setActivePanel={handleSetPanel} setActiveProblemId={setActiveProblemId} />}
            {activePanel === 'my-questions' && <MyQuestions />}
            {activePanel === 'streak' && <Streak />}
            {activePanel === 'editor' && <CodeEditor activeLanguage={activeLanguage} activeProblemId={activeProblemId} setActiveProblemId={setActiveProblemId} />}

            <AIHintsPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
          </div>
        </div>

      </div>
    </>
  );
}
