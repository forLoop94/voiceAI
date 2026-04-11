import { Header } from './components/Layout/Header'
import { Footer } from './components/Layout/Footer'
import { SupportCard } from './components/Layout/SupportCard'
import { VoiceStatus } from './components/VoiceSupport/VoiceStatus'
import { VoiceWidget } from './components/VoiceSupport/VoiceWidget'
import { TranscriptDisplay } from './components/VoiceSupport/TranscriptDisplay'
import { PreCallForm } from './components/PreCallForm/PreCallForm'
import { useVoiceStatus } from './hooks/useVoiceStatus'
import { useState, useEffect } from 'react'

function App() {
  const { status, setStatus, micPermission, checkMicPermission } = useVoiceStatus();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [transcriptHistory, setTranscriptHistory] = useState([]);

  useEffect(() => {
    checkMicPermission();
  }, [checkMicPermission]);

  const handleFormSubmit = (info) => {
    setCustomerInfo(info);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleTranscriptUpdate = (newTranscript) => {
    setTranscriptHistory(newTranscript);
  };

  if (!customerInfo) {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <SupportCard
          title="Before We Connect You"
        >
          <PreCallForm onSubmit={handleFormSubmit} />
        </SupportCard>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <SupportCard
        title="AI Voice Assistant"
        description="Speak directly with our AI support agent to get help with payments, invoices, or account settings."
      >
        <VoiceStatus status={status} micPermission={micPermission} />

        <VoiceWidget
          onStatusChange={handleStatusChange}
          onTranscriptUpdate={handleTranscriptUpdate}
          customerInfo={customerInfo}
        />

        {status !== 'error' && (
          <TranscriptDisplay transcriptHistory={transcriptHistory} />
        )}
      </SupportCard>

      <Footer />
    </div>
  );
}

export default App
