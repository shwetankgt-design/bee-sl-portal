import { Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { ChatProvider } from "./context/ChatContext";
import { ChatWidget } from "./components/ChatWidget";
import Home from "./modules/Home";
import Registration from "./modules/Registration";
import StarRating from "./modules/StarRating";
import QrVerification from "./modules/QrVerification";
import Blockchain from "./modules/Blockchain";
import Dashboard from "./modules/Dashboard";
import Grievance from "./modules/Grievance";

export default function App() {
  return (
    <ChatProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/star-rating" element={<StarRating />} />
          <Route path="/qr-verification" element={<QrVerification />} />
          <Route path="/blockchain" element={<Blockchain />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Shell>
      <ChatWidget />
    </ChatProvider>
  );
}
