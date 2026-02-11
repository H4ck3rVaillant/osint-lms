import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ padding: "40px 60px" }}>
        <Outlet />
      </main>
    </>
  );
}
