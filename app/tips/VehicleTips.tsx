import TipPage from '@/components/TipPage';
export default function VehicleTip() {
  return (
    <TipPage
      icon="car"
      color="#E65100"
      bgColor="#FFF8F0"
      title="Switch Off Your Engine"
      subtitle="Silence keeps everyone safe"
      heroEmoji="🚗"
      sections={[
        { heading: 'Why engines are a threat', body: 'Engine noise and vibrations alarm elephants. They associate loud vehicles with danger and may charge to defend their herd.' },
        { heading: 'When to switch off', body: 'Turn off your engine as soon as an elephant is spotted within 200 metres of your vehicle. Do not restart until it has moved away.' },
        { heading: 'Stay inside the vehicle', body: 'Your vehicle is a protective shell. Never exit while elephants are nearby, even if they seem calm. Smells and sounds from humans are threatening.' },
        { heading: 'If the elephant approaches', body: 'Remain still and silent. Only start the engine quietly and reverse slowly if the elephant comes within 30 metres and shows aggression.' },
      ]}
    />
  );
}