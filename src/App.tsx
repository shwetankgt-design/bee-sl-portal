import { Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { ChatProvider } from "./context/ChatContext";
import { RoleProvider } from "./context/RoleContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ChatWidget } from "./components/ChatWidget";
import RoleDashboard from "./modules/dashboards/RoleDashboard";
import Explore from "./modules/Home";
import Registration from "./modules/Registration";
import StarRating from "./modules/StarRating";
import QrVerification from "./modules/QrVerification";
import Blockchain from "./modules/Blockchain";
import Dashboard from "./modules/Dashboard";
import Grievance from "./modules/Grievance";
import OcrRegistration from "./modules/OcrRegistration";
import StarPredictor from "./modules/StarPredictor";
import SnapVerify from "./modules/SnapVerify";
import AnomalyDashboard from "./modules/AnomalyDashboard";

export default function App() {
  return (
    <RoleProvider>
      <LanguageProvider>
        <ChatProvider>
          <Shell>
            <Routes>
              <Route path="/" element={<RoleDashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/ocr-registration" element={<OcrRegistration />} />
              <Route path="/star-rating" element={<StarRating />} />
              <Route path="/star-predictor" element={<StarPredictor />} />
              <Route path="/qr-verification" element={<QrVerification />} />
              <Route path="/snap-verify" element={<SnapVerify />} />
              <Route path="/blockchain" element={<Blockchain />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/anomaly-dashboard" element={<AnomalyDashboard />} />
              <Route path="/grievance" element={<Grievance />} />
              <Route path="*" element={<RoleDashboard />} />
            </Routes>
          </Shell>
          <ChatWidget />
        </ChatProvider>
      </LanguageProvider>
    </RoleProvider>
  );
}
