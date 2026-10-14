import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Search,
  ScanLine,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Info,
  RotateCcw,
} from "lucide-react";
import {
  getMobileJobById,
  updateJobPartsList,
  AVAILABLE_PARTS_CATALOG,
  type MobileJob,
  type PartItem,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/parts")({
  head: ({ params }) => ({
    meta: [
      { title: `Parts Used & Returned (O1-SCR-MOB-06) — Job ${params.jobId}` },
      { name: "description", content: "Record materials, spare parts used, stock returns and serial barcodes." },
    ],
  }),
  component: MobilePartsScreen,
});

function MobilePartsScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  const [parts, setParts] = useState<PartItem[]>(job?.parts || []);
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setJob(getMobileJobById(jobId));
    if (job?.parts) {
      setParts(job.parts);
    }
  }, [jobId]);

  if (!job) {
    return (
      <div className="p-4 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-destructive" />
        <p className="text-sm font-bold">Job {jobId} Not Found</p>
        <Link to="/mobile/jobs" className="text-xs text-primary underline">Return to Job List</Link>
      </div>
    );
  }

  const filteredCatalog = AVAILABLE_PARTS_CATALOG.filter((p) => {
    if (!searchCatalogQuery.trim()) return true;
    const q = searchCatalogQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.partCode.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const handleAddFromCatalog = (catPart: (typeof AVAILABLE_PARTS_CATALOG)[0]) => {
    const existingIndex = parts.findIndex((p) => p.partCode === catPart.partCode);
    if (existingIndex >= 0) {
      const updated = [...parts];
      updated[existingIndex].qtyUsed += 1;
      setParts(updated);
    } else {
      const newPart: PartItem = {
        ...catPart,
        qtyUsed: 1,
        qtyReturned: 0,
      };
      setParts([...parts, newPart]);
    }
    setFeedback(`Added ${catPart.name} to job parts list.`);
    setIsCatalogOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateQty = (index: number, field: "qtyUsed" | "qtyReturned", delta: number) => {
    const updated = [...parts];
    const currentVal = updated[index][field];
    const newVal = Math.max(0, currentVal + delta);
    updated[index][field] = newVal;
    setParts(updated);
  };

  const handleUpdateReturnReason = (index: number, reason: PartItem["returnReason"]) => {
    const updated = [...parts];
    updated[index].returnReason = reason;
    setParts(updated);
  };

  const handleRemovePart = (index: number) => {
    const updated = parts.filter((_, i) => i !== index);
    setParts(updated);
  };

  const handleSaveParts = () => {
    updateJobPartsList(job.id, parts);
    setFeedback("Parts list saved to work order.");
    setTimeout(() => {
      navigate({ to: "/mobile/jobs/$jobId", params: { jobId: job.id } });
    }, 800);
  };

  const totalCost = parts.reduce((sum, p) => sum + p.unitPrice * (p.qtyUsed - p.qtyReturned), 0);

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <Link
          to="/mobile/jobs/$jobId"
          params={{ jobId: job.id }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border px-2.5 py-1.5 rounded-lg shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Job</span>
        </Link>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-primary">{job.id}</span>
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-06</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Package size={18} />
            </span>
            <div>
              <h1 className="text-sm font-bold">Parts Used & Returned</h1>
              <p className="text-[11px] text-muted-foreground">Mobile Spare Parts Management</p>
            </div>
          </div>

          <Button
            size="sm"
            className="text-xs bg-primary h-8 font-semibold"
            onClick={() => setIsCatalogOpen(true)}
          >
            <Plus size={14} className="mr-1" />
            Add Part
          </Button>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Selected Parts List */}
        {parts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-2">
            <Package size={24} className="mx-auto text-muted-foreground/50" />
            <p className="font-semibold text-foreground">No parts logged for this job</p>
            <p className="text-[11px]">Click 'Add Part' to select items from van stock catalog.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {parts.map((part, index) => (
              <div key={part.id || index} className="p-3 rounded-lg border bg-card space-y-2.5 shadow-2xs">
                <div className="flex items-start justify-between gap-2 border-b pb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {part.partCode}
                    </span>
                    <h3 className="text-xs font-bold text-foreground mt-1">{part.name}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Unit Price: LKR {part.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemovePart(index)}
                    className="p-1 hover:bg-destructive-soft hover:text-destructive rounded text-muted-foreground"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Quantities Controls */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-muted/50 border">
                    <span className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      Qty Used / Installed
                    </span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleUpdateQty(index, "qtyUsed", -1)}
                        className="h-6 w-6 rounded bg-card border text-xs font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-foreground">{part.qtyUsed}</span>
                      <button
                        onClick={() => handleUpdateQty(index, "qtyUsed", 1)}
                        className="h-6 w-6 rounded bg-card border text-xs font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-muted/50 border">
                    <span className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      Qty Returned to Stock
                    </span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleUpdateQty(index, "qtyReturned", -1)}
                        className="h-6 w-6 rounded bg-card border text-xs font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-foreground">{part.qtyReturned}</span>
                      <button
                        onClick={() => handleUpdateQty(index, "qtyReturned", 1)}
                        className="h-6 w-6 rounded bg-card border text-xs font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Return Reason if return > 0 */}
                {part.qtyReturned > 0 && (
                  <div className="text-xs space-y-1">
                    <label className="block text-[10px] font-semibold text-warning flex items-center gap-1">
                      <RotateCcw size={11} />
                      <span>Reason for Stock Return:</span>
                    </label>
                    <select
                      value={part.returnReason || "Unused"}
                      onChange={(e) => handleUpdateReturnReason(index, e.target.value as any)}
                      className="input-field text-xs py-1"
                    >
                      <option value="Unused">Unused / Surplus</option>
                      <option value="Faulty/Damaged">Faulty / Damaged</option>
                      <option value="Wrong Specification">Wrong Specification</option>
                      <option value="Customer Cancelled">Customer Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cost Summary Banner */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted border text-xs">
          <span className="font-semibold text-muted-foreground">Estimated Line Material Value:</span>
          <span className="font-mono font-extrabold text-foreground text-sm">
            LKR {totalCost.toLocaleString()}
          </span>
        </div>

        <Button className="w-full text-xs font-bold h-10 bg-primary" onClick={handleSaveParts}>
          Save Parts List
        </Button>
      </div>

      {/* Catalog Search Selection Modal */}
      {isCatalogOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-xs"
          onClick={() => setIsCatalogOpen(false)}
        >
          <div
            className="card-surface rise w-full max-w-sm p-4 space-y-3 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Package size={15} className="text-primary" />
                <span>Select Spare Part from Van Catalog</span>
              </h3>
              <button onClick={() => setIsCatalogOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                ✕
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchCatalogQuery}
                onChange={(e) => setSearchCatalogQuery(e.target.value)}
                placeholder="Search code, name, category..."
                className="input-field pl-8 text-xs py-1.5"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredCatalog.map((catItem) => (
                <div
                  key={catItem.id}
                  onClick={() => handleAddFromCatalog(catItem)}
                  className="p-2.5 rounded-lg border bg-card hover:border-primary/50 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-primary">{catItem.partCode}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Avail: {catItem.availableStock}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground">{catItem.name}</p>
                  <p className="text-[10px] text-muted-foreground">LKR {catItem.unitPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setIsCatalogOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
