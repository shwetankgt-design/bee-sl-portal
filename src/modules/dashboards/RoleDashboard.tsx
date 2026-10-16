import { useRole } from "../../context/RoleContext";
import ManufacturerDashboard from "./ManufacturerDashboard";
import ConsumerDashboard from "./ConsumerDashboard";
import OfficerDashboard from "./OfficerDashboard";

export default function RoleDashboard() {
  const { role } = useRole();
  if (role === "consumer") return <ConsumerDashboard />;
  if (role === "officer") return <OfficerDashboard />;
  return <ManufacturerDashboard />;
}
