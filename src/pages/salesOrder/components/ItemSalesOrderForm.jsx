import React from "react";
import { FaTrash } from "react-icons/fa";
import { itemTypes, products, unitTypes } from "../../../data/data";
import { salesOrderDetailService } from "../../../services/salesOrderDetailService";
import { useParams } from "react-router-dom";
import CustomToast from "../../../components/global/CustomToast";

export default function ItemSalesOrderForm({
  soDetails,
  setSoDetails,
  soDtErrors,
  isViewOnly = false,
}) {
  const { salesOrderId } = useParams();
  const handleAddRow = () => {
    setSoDetails([
      ...soDetails,
      {
        refType: "",
        refNum: "",
        itemType: "",
        productCode: "",
        productName: "",
        unit: "",
        price: "",
        qty: "",
        discPercent: "",
        discAmount: "",
        totalAmount: "",
        remark: "",
      },
    ]);
  };

  // const handleDeleteRow = (index) => {
  //   const updatedItems = soDetails.filter((_, i) => i !== index);
  //   setSoDetails(updatedItems);
  // };

  const handleDeleteRow = async (index) => {
    const itemToDelete = soDetails[index];

    // Jika item sudah punya id (berarti sudah tersimpan di DB), panggil API delete
    if (itemToDelete.id && !isNaN(parseInt(itemToDelete.id)) && salesOrderId) {
      try {
        await salesOrderDetailService.deleteDetail(
          parseInt(salesOrderId),
          parseInt(itemToDelete.id)
        );
        await CustomToast("Detail berhasil dihapus dari server", "success");
      } catch (error) {
        console.error("Gagal menghapus detail dari server:", error);
        CustomToast("Gagal hapus detail dari server", "error");
        return; // keluar supaya tidak dihapus dari state jika gagal
      }
    }

    // Lanjut hapus dari state
    const updatedItems = soDetails.filter((_, i) => i !== index);
    setSoDetails(updatedItems);
  };

  const handleChange = (index, field, value) => {
    setSoDetails((prevItems) => {
      const updated = [...prevItems];
      const item = { ...updated[index], [field]: value };

      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.qty) || 0;

      let discPercent = parseFloat(item.discPercent) || 0;
      let discAmount = parseFloat(item.discAmount) || 0;

      if (field === "discPercent") {
        item.discAmount = "";
        discAmount = (price * qty * discPercent) / 100;
      } else if (field === "discAmount") {
        item.discPercent = "";
      } else {
        if (item.discPercent !== "") {
          discPercent = parseFloat(item.discPercent) || 0;
          discAmount = (price * qty * discPercent) / 100;
        } else if (item.discAmount !== "") {
          discAmount = parseFloat(item.discAmount) || 0;
        }
      }

      const total = price * qty - discAmount;
      item.totalAmount = total > 0 ? total.toFixed(2) : "0.00";

      updated[index] = item;
      return updated;
    });
  };

  return (
    <div>
      <div className="bg-white border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-950">Order Items</h2>
          {!isViewOnly && (
            <button
              onClick={handleAddRow}
              className="bg-neutral-600 hover:bg-neutral-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              + Add Row
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="bg-neutral-500 text-white">
              <tr>
                <th className="px-3 py-2 border w-[100px]">Ref Type</th>
                <th className="px-3 py-2 border w-[100px]">Ref Num</th>
                <th className="px-3 py-2 border w-[120px]">Item Type</th>
                <th className="px-3 py-2 border w-[160px]">Product Code</th>
                <th className="px-3 py-2 border w-[160px]">Product Name</th>
                <th className="px-3 py-2 border w-[100px]">Unit</th>
                <th className="px-3 py-2 border w-[100px]">Price</th>
                <th className="px-3 py-2 border w-[100px]">Qty</th>
                <th className="px-3 py-2 border w-[100px]">Disc (%)</th>
                <th className="px-3 py-2 border w-[100px]">Disc Amount</th>
                <th className="px-3 py-2 border w-[120px]">Total Amount</th>
                <th className="px-3 py-2 border w-[140px]">Remark</th>
                {!isViewOnly && (
                  <th className="px-3 py-2 border w-[60px]">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {soDetails.map((item, index) => (
                <tr key={index} className="odd:bg-gray-50 border-b">
                  {[
                    { name: "refType" },
                    { name: "refNum" },
                    {
                      name: "itemType",
                      type: "select",
                      options: itemTypes.map((i) => ({
                        value: i.id,
                        label: i.name,
                      })),
                    },
                    {
                      name: "productCode",
                      type: "select",
                      options: products.map((p) => ({
                        value: p.code,
                        label: `${p.code}`,
                      })),
                    },
                    {
                      name: "productName",
                      type: "select",
                      options: products.map((p) => ({
                        value: p.code,
                        label: `${p.name}`,
                      })),
                    },
                    {
                      name: "unit",
                      type: "select",
                      options: unitTypes.map((u) => ({
                        value: u.id,
                        label: u.name,
                      })),
                    },
                    { name: "price" },
                    { name: "qty" },
                    { name: "discPercent" },
                    { name: "discAmount" },
                    { name: "totalAmount", disabled: true },
                    { name: "remark" },
                  ].map(({ name, type = "text", options = [], disabled }) => (
                    <td
                      key={name}
                      className="border border-gray-300 px-2 py-1 align-top"
                    >
                      {type === "select" ? (
                        <>
                          <select
                            value={item[name]}
                            onChange={(e) =>
                              handleChange(index, name, e.target.value)
                            }
                            disabled={disabled || isViewOnly}
                            className={`w-full px-1 py-2 text-sm rounded focus:outline-none focus:ring-1 ${
                              name === "totalAmount"
                                ? "text-right text-gray-700 bg-gray-200"
                                : "bg-white"
                            } ${
                              soDtErrors?.[index]?.[name]
                                ? "border border-red-500 ring-red-400"
                                : "border border-gray-300"
                            }`}
                          >
                            <option value="">Select...</option>
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {soDtErrors?.[index]?.[name] && (
                            <p className="text-xs text-red-600 mt-1">
                              {soDtErrors[index][name]}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type={type}
                            value={item[name]}
                            onChange={(e) =>
                              handleChange(index, name, e.target.value)
                            }
                            disabled={disabled || isViewOnly}
                            className={`w-full px-1 py-2 text-sm rounded focus:outline-none focus:ring-1 ${
                              name === "totalAmount"
                                ? "text-right text-gray-700 bg-gray-200"
                                : "bg-white"
                            } ${
                              soDtErrors?.[index]?.[name]
                                ? "border border-red-500 ring-red-400"
                                : "border border-gray-300"
                            }`}
                          />
                          {soDtErrors?.[index]?.[name] && (
                            <p className="text-xs text-red-600 mt-1">
                              {soDtErrors[index][name]}
                            </p>
                          )}
                        </>
                      )}
                    </td>
                  ))}
                  {!isViewOnly && (
                    <td className="px-2 py-2 border text-center">
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {soDetails.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center py-4 text-gray-500 italic border"
                  >
                    No items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
