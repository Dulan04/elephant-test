import TipPage from '@/components/TipPage';
export default function NightTip() {
  return (
    <TipPage
      icon="moon"
      color="#4A148C"
      bgColor="#F5F0FF"
      title="Stay Indoors at Night"
      subtitle="Dusk to dawn in high-alert zones"
      heroEmoji="🌙"
      sections={[
        { heading: 'Night-time movement', body: 'Elephants are most active between dusk and dawn, moving between water sources and feeding grounds. They are harder to spot at night and more likely to feel cornered.' },
        { heading: 'High-alert zones', body: 'Areas marked in red on the EleAlert map are active elephant corridors. Avoid all outdoor activity in these zones after 6 PM.' },
        { heading: 'Protect your home', body: 'Keep lights on near your compound perimeter. Elephants are deterred by well-lit areas. Avoid leaving food or crops uncovered outside overnight.' },
        { heading: 'Emergency protocol', body: 'If you hear elephants near your home at night, stay inside, call the Wildlife Emergency Hotline immediately, and turn on all exterior lights.' },
      ]}
    />
  );
}