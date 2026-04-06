import { Header } from './components/Layout/Header'
import { Footer } from './components/Layout/Footer'
import { SupportCard } from './components/Layout/SupportCard'
import { VoiceStatus } from './components/VoiceSupport/VoiceStatus'
import { VoiceWidget } from './components/VoiceSupport/VoiceWidget'
import { TranscriptDisplay } from './components/VoiceSupport/TranscriptDisplay'
import { useVoiceStatus } from './hooks/useVoiceStatus'
import { useState } from 'react'

function App() {
  const { status, setStatus, micPermission } = useVoiceStatus();
  const [transcriptHistory, setTranscriptHistory] = useState([
    // Example initial message
    // { role: 'assistant', text: 'Hello! I am your AI assistant. How can I help you today?', timestamp: new Date() }
  ]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleTranscriptUpdate = (newTranscript) => {
    setTranscriptHistory(newTranscript);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <SupportCard>
        <VoiceStatus status={status} micPermission={micPermission} />
        
        <VoiceWidget 
          onStatusChange={handleStatusChange} 
          onTranscriptUpdate={handleTranscriptUpdate} 
        />

        {status !== 'error' && (
          <TranscriptDisplay transcriptHistory={transcriptHistory} />
        )}
      </SupportCard>

      <Footer />
    </div>
  )
}

export default App
