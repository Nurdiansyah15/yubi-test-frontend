import React, { useEffect, useState } from "react";
import { useLayout } from "../../contexts/LayoutContext";

import { useNavigate } from "react-router-dom";
import CustomToast from "../../components/global/CustomToast";
import { products } from "../../data/data";
import { salesOrderDetailService } from "../../services/salesOrderDetailService";
import { salesOrderService } from "../../services/salesOrderService";
import ItemSalesOrderForm from "./components/ItemSalesOrderForm";
import SalesOrderForm from "./components/SalesOrderForm";

export default function Create() {
  const navigate = useNavigate();
  const { setTitle, setBreadcrumb } = useLayout();
  useEffect(() => {
    setTitle("Create Sales Order");
    setBreadcrumb([
      { label: "Sales Orders", path: "/sales" },
      { label: "Create" },
    ]);
  }, []);

  const [soErrors, setSoErrors] = useState({});
  const [soDtErrors, setSoDtErrors] = useState([]);

  const [salesOrders, setSalesOrders] = useState({
    poBuyerNo: "",
    orderType: "",
    name: "",
    email: "",
    phone: "",
    status: "",
    orderDate: "",
    shippingDate: "",
    currency: "",
    exchangeRate: "",
    pph: "",
    isVAT: false,
    buyerAddress: "",
    subAmount: "",
    totalDiscount: "",
    afterDiscount: "",
    totalVAT: "",
    totalPPH23: "",
    grandTotal: "",
    remark: "",
    soDts: [],
  });

  const [soDetails, setSoDetails] = useState([
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

  const handleClear = () => {
    setSalesOrders({
      poBuyerNo: "",
      orderType: "",
      name: "",
      email: "",
      phone: "",
      status: "",
      orderDate: "",
      shippingDate: "",
      currency: "",
      exchangeRate: "",
      pph: "",
      isVAT: false,
      buyerAddress: "",
      subAmount: "",
      totalDiscount: "",
      afterDiscount: "",
      totalVAT: "",
      totalPPH23: "",
      grandTotal: "",
      remark: "",
      soDts: [],
    });
    setSoDetails([
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
    setSoErrors({});
    setSoDtErrors({});
  };

  useEffect(() => {
    let subAmount = 0;
    let totalDiscount = 0;

    soDetails
      .filter((item) => !item.isDeleted)
      .forEach((item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseFloat(item.qty) || 0;

        let discAmount = 0;
        if (
          item.discPercent &&
          item.discPercent !== "" &&
          parseFloat(item.discPercent) !== 0
        ) {
          const discPercent = parseFloat(item.discPercent) || 0;
          discAmount = (price * qty * discPercent) / 100;
        } else if (item.discAmount && item.discAmount !== "") {
          discAmount = parseFloat(item.discAmount) || 0;
        }

        const total = price * qty;

        subAmount += total;
        totalDiscount += discAmount;
      });

    const afterDiscount = subAmount - totalDiscount;
    const grandTotal = afterDiscount;

    setSalesOrders((prev) => {
      const isSame =
        prev.subAmount === subAmount.toFixed(2) &&
        prev.totalDiscount === totalDiscount.toFixed(2) &&
        prev.afterDiscount === afterDiscount.toFixed(2) &&
        prev.grandTotal === grandTotal.toFixed(2) &&
        JSON.stringify(prev.soDts) === JSON.stringify(soDetails);

      if (isSame) return prev;

      return {
        ...prev,
        subAmount: subAmount.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        afterDiscount: afterDiscount.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        soDts: soDetails,
      };
    });
  }, [soDetails]);

  const validateForm = () => {
    const newErrors = {};
    const newItemErrors = [];

    if (!salesOrders.poBuyerNo.trim())
      newErrors.poBuyerNo = "PO Buyer No is required";
    if (!salesOrders.orderType) newErrors.orderType = "Order Type is required";
    if (!salesOrders.name.trim()) newErrors.name = "Name is required";
    if (!salesOrders.email.trim()) newErrors.email = "Email is required";
    if (!salesOrders.phone.trim()) newErrors.phone = "Phone is required";
    if (!salesOrders.status) newErrors.status = "Status is required";
    if (!salesOrders.orderDate) newErrors.orderDate = "Order Date is required";
    if (!salesOrders.shippingDate)
      newErrors.shippingDate = "Shipping Date is required";
    if (!salesOrders.currency) newErrors.currency = "Currency is required";
    if (!salesOrders.exchangeRate)
      newErrors.exchangeRate = "Exchange Rate is required";

    if (salesOrders.exchangeRate && isNaN(Number(salesOrders.exchangeRate))) {
      newErrors.exchangeRate = "Exchange Rate must be a number";
    }

    if (!salesOrders.pph) newErrors.pph = "PPH is required";
    if (!salesOrders.buyerAddress.trim())
      newErrors.buyerAddress = "Buyer Address is required";

    salesOrders.soDts
      .filter((item) => !item.isDeleted)
      .forEach((item, idx) => {
        const itemError = {};
        if (!item.refType) itemError.refType = "Required";
        if (!item.refNum) itemError.refNum = "Required";
        if (!item.itemType) itemError.itemType = "Required";
        if (!item.productCode) itemError.productCode = "Required";
        if (!item.productName) itemError.productName = "Required";
        if (!item.unit) itemError.unit = "Required";
        if (!item.price) itemError.price = "Required";
        if (!item.qty) itemError.qty = "Required";

        if (Object.keys(itemError).length > 0) {
          newItemErrors[idx] = itemError;
        }
      });

    setSoErrors(newErrors);
    setSoDtErrors(newItemErrors);
    console.log(newItemErrors);

    const isValid =
      Object.keys(newErrors).length === 0 && newItemErrors.length === 0;
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Validation failed!");
      return;
    }

    try {
      const soPayload = {
        po_buyer_no: salesOrders.poBuyerNo || "",
        order_type_id: parseInt(salesOrders.orderType) || 0,
        customer_id: parseInt(salesOrders.name) || 0,
        status: salesOrders.status || "",
        order_at: salesOrders.orderDate
          ? new Date(salesOrders.orderDate).toISOString()
          : null,
        shipping_at: salesOrders.shippingDate
          ? new Date(salesOrders.shippingDate).toISOString()
          : null,
        currency_id: parseInt(salesOrders.currency) || 0,
        exchange_rate: parseFloat(salesOrders.exchangeRate) || 1,
        is_vat: salesOrders.isVAT || false,
        is_pph23: false,
        vat_id: 1,
        pph23_id: 1,
        total_vat: parseFloat(salesOrders.totalVAT) || 0,
        total_pph23: parseFloat(salesOrders.totalPPH23) || 0,
        remark: salesOrders.remark || "",
      };

      const response = await salesOrderService.createSalesOrder(soPayload);
      const createdSalesOrderId = response.data.data.id;

      const soDtPayloads = soDetails.map((item) => ({
        ref_type: item.refType || "",
        item_type: item.itemType || "",
        product_uuid:
          products.find((c) => c.code === item.productCode)?.id || "",
        item_unit_id: parseInt(item.unit) || 0,
        price_sell: parseFloat(item.price) || 0,
        is_deleted: item.isDeleted || false,
        qty: parseFloat(item.qty) || 0,
        disc_perc: parseFloat(item.discPercent) || 0,
        disc_am: parseFloat(item.discAmount) || 0,
        remark: item.remark || "",
      }));

      await Promise.all(
        soDtPayloads.map((detail) => {
          if (!detail.is_deleted) {
            return salesOrderDetailService.createDetail(
              createdSalesOrderId,
              detail
            );
          }
          return Promise.resolve();
        })
      );

      CustomToast("Sales order dan semua detail berhasil dikirim!", "success");
      navigate("/sales");
      // console.log({ ...salesOrders, soDts: soDetails });
      // console.log("data", soPayload, soDtPayloads);
    } catch (error) {
      console.error("Gagal submit sales order:", error);
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Card 1: Basic Information */}
      <SalesOrderForm
        salesOrders={salesOrders}
        setSalesOrders={setSalesOrders}
        soErrors={soErrors}
      />
      {/* Card 2: Items */}
      <ItemSalesOrderForm
        soDetails={soDetails}
        setSoDetails={setSoDetails}
        soDtErrors={soDtErrors}
      />
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <button
            className="bg-neutral-600 hover:bg-neutral-700 text-white w-40 py-1 rounded-md cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-transparent hover:bg-gray-50 border border-gray-300 text-black w-40 py-1 rounded-md cursor-pointer"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
