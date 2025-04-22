import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Index from "./pages/salesOrder/Index";
import Create from "./pages/salesOrder/Create";
import { Toaster } from "sonner";
import Edit from "./pages/salesOrder/Edit";
import Detail from "./pages/salesOrder/Detail";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/sales" element={<Index />} />
            <Route path="/sales/create" element={<Create />} />
            <Route path="/sales/:salesOrderId/edit" element={<Edit />} />
            <Route path="/sales/:salesOrderId/detail" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
