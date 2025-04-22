import React, { useEffect, useState } from "react";
import { useLayout } from "../../contexts/LayoutContext";

import { useNavigate, useParams } from "react-router-dom";
import CustomToast from "../../components/global/CustomToast";
import { products } from "../../data/data";
import { salesOrderDetailService } from "../../services/salesOrderDetailService";
import { salesOrderService } from "../../services/salesOrderService";
import ItemSalesOrderForm from "./components/ItemSalesOrderForm";
import SalesOrderForm from "./components/SalesOrderForm";

export default function Edit() {
  const { salesOrderId } = useParams();
  const navigate = useNavigate();
  const { setTitle, setBreadcrumb } = useLayout();
  useEffect(() => {
    setTitle("Edit Sales Order");
    setBreadcrumb([
      { label: "Sales Orders", path: "/sales" },
      { label: "Edit" },
    ]);
  }, []);

  const fetchSalesOrderById = async () => {
    try {
      const response = await salesOrderService.getSalesOrderById(
        parseInt(salesOrderId)
      );
      setSalesOrders({
        id: response.data.data.id,
        poBuyerNo: response.data.data.po_buyer_no || "",
        orderType: response.data.data.order_type_id?.toString() || "",
        name: response.data.data.customer_id?.toString() || "",
        email: "", // Optional, tergantung BE
        phone: "", // Optional, tergantung BE
        status: response.data.data.status || "",
        orderDate: response.data.data.order_at
          ? response.data.data.order_at.split("T")[0]
          : "",
        shippingDate: response.data.data.shipping_at
          ? response.data.data.shipping_at.split("T")[0]
          : "",
        currency: response.data.data.currency_id?.toString() || "",
        exchangeRate: response.data.data.exchange_rate?.toString() || "",
        pph: response.data.data.pph23_id?.toString() || "",
        isVAT: response.data.data.is_vat || false,
        buyerAddress: "", // Ambil dari customer kalau ada
        subAmount: response.data.data.sub_total?.toString() || "",
        totalDiscount: response.data.data.total_discount?.toString() || "",
        afterDiscount: (
          (response.data.data.sub_total || 0) -
          (response.data.data.total_discount || 0)
        ).toString(),
        totalVAT: response.data.data.total_vat?.toString() || "",
        totalPPH23: response.data.data.total_pph23?.toString() || "",
        grandTotal: response.data.data.grand_total?.toString() || "",
        remark: response.data.data.remark || "",
        soDts: response.data.data.so_dts || [],
      });

      console.log("data", response.data);
    } catch (error) {
      console.log("Error fetching sales order:", error);
    }
  };

  const fecthSalesOrderDetails = async () => {
    try {
      const response =
        await salesOrderDetailService.getAllDetailsBySalesOrderId(
          parseInt(salesOrderId)
        );
      const parsedSoDetails = response.data.data.map((item) => ({
        id: item.id,
        refType: item.ref_type || "",
        refNum: item.ref_type || "",
        itemType: item.item_type || "",
        productCode:
          products.find((p) => p.id === item.product_uuid)?.code || "",
        productName:
          products.find((p) => p.id === item.product_uuid)?.code || "",
        unit: item.item_unit_id?.toString() || "",
        price: item.price_sell?.toString() || "",
        qty: item.qty?.toString() || "",
        discPercent: item.disc_perc?.toString() || "",
        discAmount: item.disc_am?.toString() || "",
        totalAmount: item.total_am?.toString() || "",
        remark: item.remark || "",
      }));

      setSoDetails(parsedSoDetails);

      console.log("data", response.data);
    } catch (error) {
      console.log("Error fetching sales order details:", error);
    }
  };

  useEffect(() => {
    fetchSalesOrderById();
    fecthSalesOrderDetails();
  }, []);

  const [soErrors, setSoErrors] = useState({});
  const [soDtErrors, setSoDtErrors] = useState([]);

  const [salesOrders, setSalesOrders] = useState({
    id: "",
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
      id: "",
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

    soDetails.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.qty) || 0;

      let discAmount = 0;
      if (item.discPercent && item.discPercent !== "") {
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

    salesOrders.soDts.forEach((item, idx) => {
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

      const soId = salesOrders.id;
      await salesOrderService.updateSalesOrder(soId, soPayload);

      const soDtPayloads = soDetails.map((item) => ({
        id: parseInt(item.id),
        ref_num: item.refType || "",
        ref_type: item.refType || "",
        item_type: item.itemType || "",
        product_uuid:
          products.find(
            (p) => p.name === item.productName || p.code === item.productCode
          )?.id || "",
        item_unit_id: parseInt(item.unit) || 0,
        price_sell: parseFloat(item.price) || 0,
        qty: parseFloat(item.qty) || 0,
        disc_perc: parseFloat(item.discPercent) || 0,
        disc_am: parseFloat(item.discAmount) || 0,
        total_am: parseFloat(item.totalAmount) || 0,
        remark: item.remark || "",
      }));

      await Promise.all(
        soDtPayloads.map((detail) => {
          if (detail.id && !isNaN(detail.id)) {
            return salesOrderDetailService.updateDetail(
              soId,
              detail.id,
              detail
            );
          } else {
            return salesOrderDetailService.createDetail(soId, detail);
          }
        })
      );

      CustomToast("Sales order berhasil diperbarui!", "success");
      navigate("/sales");
    } catch (error) {
      console.error("Gagal update sales order:", error);
    }
  };

  // console.log({ ...salesOrders, soDts: soDetails });

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
