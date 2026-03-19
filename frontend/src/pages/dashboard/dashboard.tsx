import ChartsSection from "./components/ChartsSection/ChartsSection";
import LatestSignups from "./components/LatestSignups/LatestSignups";
import StatsCards from "./components/StatsCard/StatsCard";
import WelcomeHeader from "./components/WelcomeHeader/WelcomHeader";

export default function Dashboard() {
  return (
    <div className="space-y-16">
      <WelcomeHeader />
      <StatsCards />
      <ChartsSection />
      <LatestSignups />
    </div>
  );
}
