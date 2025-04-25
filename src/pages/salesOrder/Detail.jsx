import React, { useEffect, useState } from "react";
import { useLayout } from "../../contexts/LayoutContext";

import { useLocation, useParams } from "react-router-dom";
import { products } from "../../data/data";
import { salesOrderDetailService } from "../../services/salesOrderDetailService";
import { salesOrderService } from "../../services/salesOrderService";
import ItemSalesOrderForm from "./components/ItemSalesOrderForm";
import SalesOrderForm from "./components/SalesOrderForm";
import Index from "./Index";

export default function Detail() {
  const location = useLocation();
  const isViewOnly = location.pathname.includes("detail");

  const { salesOrderId } = useParams();
  const { setTitle, setBreadcrumb } = useLayout();
  useEffect(() => {
    setTitle("Detail Sales Order");
    setBreadcrumb([
      { label: "Sales Orders", path: "/sales" },
      { label: "Detail" },
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
        email: "",
        phone: "",
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

      if (response.data.data !== null) {
        setSoDetails(() => {
          return response.data.data?.map((item) => ({
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
        });
      } else {
        setSoDetails([]);
      }

      console.log("data sales order detail", response.data);
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

  useEffect(() => {
    let subAmount = 0;
    let totalDiscount = 0;

    soDetails
      .filter((item) => !item.isDeleted)
      .forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseFloat(item.qty) || 0;

        console.log(index, item.discAmount);
        console.log(item.discAmount && item.discAmount !== "");

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
          console.log("dis", discAmount);
        }

        const total = price * qty;

        subAmount += total;
        totalDiscount += discAmount;
        console.log("total", totalDiscount);
      });

    console.log(totalDiscount);

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

  return (
    <div className="space-y-6 ">
      {/* Card 1: Basic Information */}
      <SalesOrderForm
        salesOrders={salesOrders}
        setSalesOrders={setSalesOrders}
        soErrors={soErrors}
        isViewOnly={isViewOnly}
      />
      {/* Card 2: Items */}
      <ItemSalesOrderForm
        soDetails={soDetails}
        setSoDetails={setSoDetails}
        soDtErrors={soDtErrors}
        isViewOnly={isViewOnly}
      />
    </div>
  );
}
