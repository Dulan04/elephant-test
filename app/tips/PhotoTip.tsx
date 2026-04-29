import TipPage from '@/components/TipPage';
export default function PhotoTip() {
  return (
    <TipPage
      icon="camera"
      color="#B71C1C"
      bgColor="#FFF5F5"
      title="No Flash Photography"
      subtitle="Protect both you and the elephant"
      heroEmoji="📸"
      sections={[
        { heading: 'Why flash is dangerous', body: 'A camera flash can startle an elephant instantly, triggering a defensive charge. Their eyesight is sensitive and sudden light feels threatening.' },
        { heading: 'Safe photography tips', body: 'Use your phone camera in natural light mode. Keep your phone low and avoid pointing it directly at the elephant\'s face.' },
        { heading: 'Drone rules', body: 'Flying drones near elephants is strictly prohibited. The noise and sight of a drone causes extreme stress and can separate mothers from calves.' },
        { heading: 'The best shot is a safe shot', body: 'Use zoom lenses or digital zoom from a safe distance. A blurry photo is far better than triggering a dangerous encounter.' },
      ]}
    />
  );
}