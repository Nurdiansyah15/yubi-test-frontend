import React, { useEffect } from "react";
import {
  currency,
  customers,
  orderType,
  pph,
  status,
} from "../../../data/data";

export default function SalesOrderForm({
  salesOrders,
  setSalesOrders,
  soErrors,
  isViewOnly = false,
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSalesOrders((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const customer = customers.find((c) => c.id == salesOrders.name);
    if (customer) {
      setSalesOrders((prev) => ({
        ...prev,
        email: customer.email,
        phone: customer.phone,
        buyerAddress: customer.address,
      }));
    }
  }, [salesOrders.name]);

  return (
    <div>
      <div className="bg-white border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold mb-4 text-blue-950">
            Basic Information
          </h2>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          {[
            { label: "PO Buyer No", name: "poBuyerNo" },
            {
              label: "Order Type",
              name: "orderType",
              type: "select",
              options: orderType.map((o) => ({ value: o.id, label: o.type })),
            },
            {
              label: "Name",
              name: "name",
              type: "select",
              options: customers.map((c) => ({ value: c.id, label: c.name })),
            },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "tel" },
            {
              label: "Status",
              name: "status",
              type: "select",
              options: status.map((s) => ({
                value: s.id,
                label: s.status,
              })),
            },
          ].map(({ label, name, type = "text", options }) => (
            <div className="relative col-span-1" key={name}>
              <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-500 z-10">
                {label}
              </label>

              {type === "select" ? (
                <select
                  name={name}
                  value={salesOrders[name]}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className={`border p-2 rounded w-full bg-white ${
                    soErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={salesOrders[name]}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className={`border p-2 rounded w-full ${
                    soErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
              {soErrors[name] && (
                <p className="text-red-500 text-xs">{soErrors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-6 gap-4 mb-4 items-center">
          {[
            { label: "Order Date", name: "orderDate", type: "date" },
            { label: "Shipping Date", name: "shippingDate", type: "date" },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: currency.map((c) => ({
                value: c.id,
                label: `${c.acronim} - ${c.name}`,
              })),
            },
            { label: "Exchange Rate", name: "exchangeRate", type: "number" },
            {
              label: "PPH",
              name: "pph",
              type: "select",
              options: pph.map((s) => ({
                value: s.id,
                label: s.name,
              })),
            },
          ].map(({ label, name, type = "text", options }) => (
            <div className="relative col-span-1" key={name}>
              <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-500 z-10">
                {label}
              </label>
              {type === "select" ? (
                <select
                  name={name}
                  value={salesOrders[name]}
                  disabled={isViewOnly}
                  onChange={handleChange}
                  className={`border p-2 rounded w-full ${
                    soErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={salesOrders[name]}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className={`border p-2 rounded w-full ${
                    soErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
              {soErrors[name] && (
                <p className="text-red-500 text-xs">{soErrors[name]}</p>
              )}
            </div>
          ))}

          <label className="flex items-center space-x-2 col-span-1">
            <input
              type="checkbox"
              name="isVAT"
              checked={salesOrders.isVAT}
              disabled={isViewOnly}
              onChange={handleChange}
            />
            <span>VAT</span>
          </label>
        </div>

        {/* Row 3: Buyer Address */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-500 z-10">
              Buyer Address
            </label>
            <textarea
              name="buyerAddress"
              value={salesOrders.buyerAddress}
              onChange={handleChange}
              disabled={isViewOnly}
              className={`w-full border border-gray-300 p-2 rounded ${
                soErrors.buyerAddress ? "border-red-500" : "border-gray-300"
              }`}
              rows="3"
            />
            {soErrors.buyerAddress && (
              <p className="text-red-500 text-xs">{soErrors.buyerAddress}</p>
            )}
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-500 z-10">
              Remark
            </label>
            <textarea
              name="remark"
              value={salesOrders.remark}
              onChange={handleChange}
              disabled={isViewOnly}
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
            />
          </div>
        </div>

        {/* Row 4: Summary */}
        <div className="grid grid-cols-12 gap-4 items-center">
          {[
            { label: "Sub Amount", name: "subAmount" },
            { label: "Total Discount", name: "totalDiscount" },
            { label: "After Discount", name: "afterDiscount" },
            { label: "Total VAT", name: "totalVAT" },
            { label: "Total PPH 23", name: "totalPPH23" },
            { label: "Grand Total", name: "grandTotal" },
          ].map(({ label, name }) => (
            <React.Fragment key={name}>
              <label className="col-span-1 text-sm font-medium text-gray-600 px-2 py-1 rounded">
                {label}
              </label>
              <input
                type="number"
                name={name}
                value={salesOrders[name]}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 p-2 rounded text-gray-500 bg-gray-100"
                disabled
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
