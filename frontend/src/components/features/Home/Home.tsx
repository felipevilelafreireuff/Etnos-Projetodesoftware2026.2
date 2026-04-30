'use client';
import { useHomeScreen } from '@/src/hooks/home/useHomeScreen';
import HeroSection from './components/HeroSection/HeroSection';
import VisaoGeralSection from './components/VisaoGeralSection/VisaoGeralSection';
import RequisitosSection from './components/RequisitosSection/RequisitosSection';

export default function Home() {
  const { tab, setTab } = useHomeScreen();
  return (
    <>
      <HeroSection />
      <VisaoGeralSection />
      <RequisitosSection tab={tab} setTab={setTab} />
    </>
  );
}
