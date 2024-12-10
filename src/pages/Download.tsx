import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, Download as DownloadIcon } from "lucide-react"; // Renamed `Download` to `DownloadIcon`
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadPage() { // Renamed the function to `DownloadPage`
  const { data: orders, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("id");
      if (error) throw error;

      // Ensure the items are parsed as JSON
      return data.map((order) => ({
        ...order,
        items:
          typeof order.items === "string" ? JSON.parse(order.items) : order.items,
      }));
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          refetch(); // Refetch data on changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const downloadCSV = () => {
    const csvContent = [
      ["Order ID", "Customer Name", "Items", "Total Price", "Special Note", "Date"],
      ...orders.map((order) => [
        order.id,
        order.user_name,
        order.items
          .map((item) => `${item.name} ($${item.price})`)
          .join("; "),
        `$${order.total_price}`,
        order.special_note || "",
        new Date(order.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Orders Report - The Balm Family Store", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

    const tableData = orders.map((order) => [
      order.id,
      order.user_name,
      order.items.map((item) => `${item.name} ($${item.price})`).join("\n"),
      `$${order.total_price}`,
      order.special_note || "-",
      new Date(order.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Order ID", "Customer", "Items", "Total", "Note", "Date"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [14, 165, 233] },
    });

    doc.save(`orders-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Table</h1>
          <div className="flex gap-4">
            <Button
              onClick={downloadCSV}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <FileDown className="w-4 h-4" />
              CSV
            </Button>
            <Button
              onClick={downloadPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <DownloadIcon className="w-4 h-4" /> {/* Used `DownloadIcon` here */}
              PDF
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Order ID
                </TableHead>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Customer
                </TableHead>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Items
                </TableHead>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Total Price
                </TableHead>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Special Note
                </TableHead>
                <TableHead className="bg-blue-100 text-blue-600 font-semibold">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user_name}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>${order.total_price}</TableCell>
                  <TableCell>{order.special_note || "-"}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
