import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ScanLine,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Truck,
  Plus,
  Minus,
  Save,
} from "lucide-react";
import {
  getStockCountItems,
  updateStockCountItem,
  MOCK_TECHNICIAN_NAME,
  type StockCountItem,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/stock-count")({
  head: () => ({
    meta: [
      { title: "Stock Count Scan (O1-SCR-MOB-12) — Telesonic Mobile" },
      { name: "description", content: "Field technician van inventory physical stock count audit and barcode scan." },
    ],
  }),
  component: MobileStockCountScreen,
});

function MobileStockCountScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StockCountItem[]>(() => getStockCountItems());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVan, setSelectedVan] = useState("VAN-04 (Nimal Perera Mobile Store)");
  const [scannedSku, setScannedSku] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.binLocation.toLowerCase().includes(q);
  });

  const handleQtyChange = (sku: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newQty = Math.max(0, item.countedQty + delta);
          return { ...item, countedQty: newQty };
        }
        return item;
      })
    );
  };

  const handleReasonChange = (sku: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) => (item.sku === sku ? { ...item, varianceReason: reason } : item))
    );
  };

  const handleSimulateBarcodeScan = () => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setScannedSku(randomItem.sku);
    setSearchQuery(randomItem.sku);
    setFeedback(`Simulated Barcode Scan: ${randomItem.sku} (${randomItem.name}) detected.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSubmitAudit = () => {
    items.forEach((item) => {
      updateStockCountItem(item.sku, item.countedQty, item.varianceReason);
    });
    setFeedback("Van stock physical count audit submitted successfully!");
    setTimeout(() => setFeedback(null), 4000);
  };

  const totalVariance = items.reduce((sum, item) => sum + (item.countedQty - item.systemQty), 0);

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <Link
          to="/mobile"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border px-2.5 py-1.5 rounded-lg shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Overview</span>
        </Link>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-primary">Van Inventory</span>
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-12</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <ScanLine size={18} />
            </span>
            <div>
              <h1 className="text-sm font-bold">Stock Count Scan</h1>
              <p className="text-[11px] text-muted-foreground">Physical Inventory Verification</p>
            </div>
          </div>

          <Button size="sm" variant="outline" className="text-xs h-8" onClick={handleSimulateBarcodeScan}>
            <ScanLine size={13} className="mr-1 text-primary" />
            Scan Barcode
          </Button>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Location Selection */}
        <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Truck size={12} className="text-primary" />
            <span>Stock Location / Van Store</span>
          </label>
          <select
            value={selectedVan}
            onChange={(e) => setSelectedVan(e.target.value)}
            className="input-field py-1 text-xs font-semibold"
          >
            <option value="VAN-04 (Nimal Perera Mobile Store)">VAN-04 (Nimal Perera Mobile Store)</option>
            <option value="Kandy Regional Field Depot">Kandy Regional Field Depot</option>
            <option value="Central Warehouse - Colombo">Central Warehouse - Colombo</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter SKU, item name, bin..."
            className="input-field pl-9 py-1.5 text-xs"
          />
        </div>

        {/* Stock Items List */}
        <div className="space-y-2.5 pt-1">
          {filteredItems.map((item) => {
            const variance = item.countedQty - item.systemQty;
            return (
              <div key={item.sku} className="p-3 rounded-lg border bg-card text-xs space-y-2 shadow-2xs">
                <div className="flex items-start justify-between gap-2 border-b pb-1.5">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <h3 className="font-bold text-foreground mt-0.5">{item.name}</h3>
                    <p className="text-[10px] text-muted-foreground">Location: {item.binLocation}</p>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      variance === 0
                        ? "bg-success-soft text-success border-success/30"
                        : "bg-destructive-soft text-destructive border-destructive/30"
                    }`}
                  >
                    {variance > 0 ? `+${variance}` : variance}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">System Qty</span>
                    <span className="font-mono font-bold text-foreground">{item.systemQty}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-lg border">
                    <span className="text-muted-foreground text-[10px] font-semibold">Counted:</span>
                    <button
                      onClick={() => handleQtyChange(item.sku, -1)}
                      className="h-6 w-6 rounded bg-card border font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-foreground px-1">{item.countedQty}</span>
                    <button
                      onClick={() => handleQtyChange(item.sku, 1)}
                      className="h-6 w-6 rounded bg-card border font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {variance !== 0 && (
                  <div>
                    <label className="block text-[10px] font-semibold text-warning mb-1">
                      Variance Reason / Notes:
                    </label>
                    <input
                      type="text"
                      value={item.varianceReason || ""}
                      onChange={(e) => handleReasonChange(item.sku, e.target.value)}
                      placeholder="e.g. Unlogged call usage, damaged..."
                      className="input-field py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Audit Summary */}
        <div className="p-3 rounded-lg bg-muted border text-xs flex items-center justify-between">
          <span className="font-semibold text-muted-foreground">Total Physical Variance:</span>
          <span
            className={`font-mono font-extrabold text-sm ${
              totalVariance === 0 ? "text-success" : "text-destructive"
            }`}
          >
            {totalVariance > 0 ? `+${totalVariance}` : totalVariance} Units
          </span>
        </div>

        <Button className="w-full text-xs font-bold h-10 bg-primary" onClick={handleSubmitAudit}>
          <Save size={15} className="mr-1.5" />
          Submit Stock Audit Count
        </Button>
      </div>
    </div>
  );
}
