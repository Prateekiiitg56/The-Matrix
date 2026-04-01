import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Search from './pages/Search';
import MyQuestions from './pages/MyQuestions';
import Streak from './pages/Streak';
import CodeEditor from './pages/CodeEditor';
import AIHintsPanel from './components/ui/AIHintsPanel';
import MatrixRain from './components/ui/MatrixRain';

function App() {
  const [activePanel, setActivePanel] = useState('editor');
  const [activeLanguage, setLanguage] = useState('python');
  const [isAIOpen, setIsAIOpen] = useState(false);

  const handleSetPanel = (panel) => {
    if (panel === 'ai-hints') {
      setIsAIOpen(true);
    } else {
      setActivePanel(panel);
    }
  };

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
            {activePanel === 'search' && <Search setActivePanel={handleSetPanel} />}
            {activePanel === 'my-questions' && <MyQuestions />}
            {activePanel === 'streak' && <Streak />}
            {activePanel === 'editor' && <CodeEditor activeLanguage={activeLanguage} />}

            {/* Floating AI Panel */}
            <AIHintsPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
