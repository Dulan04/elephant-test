import TipPage from '@/components/TipPage';
export default function SpaceTip() {
  return (
    <TipPage
      icon="paw"
      color="#1B5E20"
      bgColor="#F0FDF4"
      title="Keep Your Distance"
      subtitle="100 metres minimum at all times"
      heroEmoji="🐘"
      sections={[
        { heading: 'Why 100 metres?', body: 'Elephants can charge at speeds up to 25 km/h. 100 metres gives you enough time to safely retreat without provoking the animal.' },
        { heading: 'How to judge the distance', body: 'Imagine a football pitch — that is roughly 100 metres. If the elephant fills more than two fingers of your outstretched hand, you are too close.' },
        { heading: 'What to do if one approaches', body: 'Stay calm. Do not run. Back away slowly while facing the elephant. Speak in a low, calm voice and avoid eye contact.' },
        { heading: 'Extra caution needed', body: 'Mother elephants with calves, bulls in musth, and injured elephants are especially dangerous. Double your safe distance in these situations.' },
      ]}
    />
  );
}