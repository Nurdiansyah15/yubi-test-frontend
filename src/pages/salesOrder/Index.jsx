import React, { useEffect } from "react";
import { useLayout } from "../../contexts/LayoutContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { salesOrderService } from "../../services/salesOrderService";
import { orderType, customers, status } from "../../data/data";
import { FcDocument } from "react-icons/fc";
import CustomToast from "../../components/global/CustomToast";

export default function Index() {
  const navigate = useNavigate();
  const { setTitle, setBreadcrumb } = useLayout();
  const [salesOrders, setSalesOrders] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    setTitle("Sales Orders");
    setBreadcrumb([{ label: "Sales Orders", path: "/sales" }]);
  }, []);

  const fetchSalesOrders = async () => {
    try {
      const response = await salesOrderService.getAllSalesOrders();
      setSalesOrders(response.data.data || []);
      console.log("data", response.data);
    } catch (error) {
      console.log("Error fetching sales orders:", error);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const handleEdit = (salesOrderId) => {
    navigate("/sales/" + salesOrderId + "/edit/");
  };

  const handleDetail = (salesOrderId) => {
    navigate("/sales/" + salesOrderId + "/detail/");
  };

  const handleDelete = async (salesOrderId) => {
    try {
      await salesOrderService.deleteSalesOrder(salesOrderId);
      CustomToast("Sales order deleted successfully", "success");
      fetchSalesOrders();
    } catch (error) {
      console.log("Error deleting sales order:", error);
    }
  };

  const filteredSalesOrders = salesOrders.filter((so) => {
    const keyword = searchTerm.toLowerCase();
    const customer = customers.find((c) => c.id == so.customer_id);
    return (
      so.po_buyer_no?.toLowerCase().includes(keyword) ||
      customer.name?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6 border border-gray-300 rounded-md p-4">
      {/* Search bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari berdasarkan PO Buyer No atau Nama..."
          className="w-full max-w-md border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/sales/create">
          <button className="bg-neutral-600 hover:bg-neutral-700 text-white w-40 py-1 rounded-md cursor-pointer">
            + Tambah Order
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow border border-gray-200">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-neutral-600 text-white">
            <tr>
              <th className="w-[50px] px-3 py-2 border">No</th>
              <th className="w-[140px] px-3 py-2 border">PO Buyer No</th>
              <th className="w-[120px] px-3 py-2 border">Order Type</th>
              <th className="w-[160px] px-3 py-2 border">Nama</th>
              <th className="w-[100px] px-3 py-2 border">Status</th>
              <th className="w-[120px] px-3 py-2 border">Order Date</th>
              <th className="w-[120px] px-3 py-2 border">Shipping Date</th>
              <th className="w-[160px] px-3 py-2 border">Remark</th>
              <th className="w-[140px] px-3 py-2 border text-right">
                Total Amount
              </th>
              <th className="w-[80px] px-3 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesOrders?.length > 0 ? (
              filteredSalesOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50 border-t">
                  <td className="px-3 py-2 text-center">{index + 1}</td>
                  <td className="px-3 py-2">{order.po_buyer_no}</td>
                  <td className="px-3 py-2">
                    {orderType.find((t) => t.id === order.order_type_id)
                      ?.type || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {customers.find((c) => c.id === order.customer_id)?.name ||
                      "-"}
                  </td>
                  <td
                    className={`px-3 py-2 font-medium text-center ${
                      order.status === "approved"
                        ? "text-green-600"
                        : order.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {status.find((s) => s.id == order.status)?.status || "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {new Date(order.order_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {new Date(order.shipping_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 truncate">{order.remark}</td>
                  <td className="px-3 py-2 text-right">
                    Rp {order.grand_total.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 flex justify-center gap-2">
                    <button
                      className="text-green-600 hover:text-green-800 cursor-pointer"
                      title="Detail"
                      onClick={() => handleDetail(order.id)}
                    >
                      <FcDocument />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Edit"
                      onClick={() => handleEdit(order.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      title="Delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center text-gray-500 italic py-6 border-t"
                >
                  Tidak ada data sales order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
