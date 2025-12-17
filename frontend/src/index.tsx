import "./styles/global.scss";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserProvider } from "./config/UserContext";
import { ProtectedRoute } from "./config/ProtectedRoute";
import { Footer } from "./components/Footer";
import { NotFound } from "./pages/Not-found";
import { HomePage } from "./pages/HomePage";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Store } from "./pages/Store";
import { Products } from "./pages/Products";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <BrowserRouter>
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Store />} />
        <Route path="/products" element={<Products />} />
      </Routes>
      <Footer />
    </UserProvider>
  </BrowserRouter>
);
