import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Store,
  Building2,
  FileText,
  Tag,
  Info,
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
      {
        name: "description",
        content: "Record materials, spare parts used from Telesonic stock or outside suppliers.",
      },
    ],
  }),
  component: MobilePartsScreen,
});

function MobilePartsScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  const [parts, setParts] = useState<PartItem[]>(job?.parts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partSource, setPartSource] = useState<"telesonic" | "external">("telesonic");

  // Catalog search state
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");

  // External part form state
  const [extName, setExtName] = useState("");
  const [extQty, setExtQty] = useState<number>(1);
  const [extPrice, setExtPrice] = useState<string>("");
  const [extSupplier, setExtSupplier] = useState("");
  const [extSerial, setExtSerial] = useState("");
  const [extRemarks, setExtRemarks] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getMobileJobById(jobId);
    setJob(loaded);
    if (loaded?.parts) {
      setParts(loaded.parts);
    }
  }, [jobId]);

  if (!job) {
    return (
      <div className="p-4 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-destructive" />
        <p className="text-sm font-bold">Job {jobId} Not Found</p>
        <Link to="/mobile/jobs" className="text-xs text-primary underline">
          Return to Job List
        </Link>
      </div>
    );
  }

  const filteredCatalog = AVAILABLE_PARTS_CATALOG.filter((p) => {
    if (!searchCatalogQuery.trim()) return true;
    const q = searchCatalogQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.partCode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleAddFromCatalog = (catPart: (typeof AVAILABLE_PARTS_CATALOG)[0]) => {
    const existingIndex = parts.findIndex(
      (p) => p.partCode === catPart.partCode && (p.partSource || "telesonic") === "telesonic",
    );
    if (existingIndex >= 0) {
      const updated = [...parts];
      updated[existingIndex].qtyUsed += 1;
      setParts(updated);
    } else {
      const newPart: PartItem = {
        ...catPart,
        qtyUsed: 1,
        qtyReturned: 0,
        partSource: "telesonic",
      };
      setParts([...parts, newPart]);
    }
    setFeedback(`Added ${catPart.name} from Telesonic Stock.`);
    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddExternalPart = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = extName.trim();
    if (!trimmedName) {
      setFormError("Part Name is required for outside/external parts.");
      return;
    }

    const qty = Number(extQty);
    if (isNaN(qty) || qty <= 0) {
      setFormError("Quantity used must be a positive number (minimum 1).");
      return;
    }

    const priceVal = extPrice ? Number(extPrice) : 0;
    if (extPrice && (isNaN(priceVal) || priceVal < 0)) {
      setFormError("Unit price must be a valid non-negative number.");
      return;
    }

    const externalPart: PartItem = {
      id: `EXT-${Date.now()}`,
      partCode: "EXT-SUPPLIER",
      name: trimmedName,
      category: "Outside Supplier Part",
      unitPrice: priceVal,
      availableStock: 0,
      qtyUsed: qty,
      qtyReturned: 0,
      partSource: "external",
      supplierName: extSupplier.trim() || undefined,
      serialNo: extSerial.trim() || undefined,
      remarks: extRemarks.trim() || undefined,
    };

    setParts([...parts, externalPart]);
    setFeedback(`Added external part: ${trimmedName}`);

    // Reset external form
    setExtName("");
    setExtQty(1);
    setExtPrice("");
    setExtSupplier("");
    setExtSerial("");
    setExtRemarks("");
    setFormError(null);
    setIsModalOpen(false);

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
  const telesonicPartsCount = parts.filter(
    (p) => (p.partSource || "telesonic") === "telesonic",
  ).length;
  const externalPartsCount = parts.filter((p) => p.partSource === "external").length;

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
              <p className="text-[11px] text-muted-foreground">
                Telesonic Stock & Outside Suppliers
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="text-xs bg-primary h-8 font-semibold shadow-2xs"
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} className="mr-1" />
            Add Parts
          </Button>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Source Summary Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/60 border flex items-center gap-2">
            <Store size={16} className="text-primary shrink-0" />
            <div>
              <span className="block text-[10px] font-semibold text-muted-foreground">
                Telesonic Stock
              </span>
              <span className="font-bold text-foreground">{telesonicPartsCount} item(s)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <Building2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                Outside / External
              </span>
              <span className="font-bold text-amber-900 dark:text-amber-100">
                {externalPartsCount} item(s)
              </span>
            </div>
          </div>
        </div>

        {/* Selected Parts List */}
        {parts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-2">
            <Package size={24} className="mx-auto text-muted-foreground/50" />
            <p className="font-semibold text-foreground">No parts logged for this job</p>
            <p className="text-[11px]">
              Click 'Add Parts' to select from Telesonic Stock or record Outside Supplier parts.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {parts.map((part, index) => {
              const isExternal = part.partSource === "external";
              return (
                <div
                  key={part.id || index}
                  className={`p-3 rounded-lg border space-y-2.5 shadow-2xs transition-all ${
                    isExternal ? "bg-amber-500/5 border-amber-500/30" : "bg-card border-border/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isExternal ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            <Building2 size={11} />
                            <span>External / Outside Part</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                            <Store size={11} />
                            <span>{part.partCode}</span>
                          </span>
                        )}

                        {part.supplierName && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/40">
                            Shop: {part.supplierName}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-foreground mt-1">{part.name}</h3>

                      <div className="text-[11px] text-muted-foreground space-y-0.5 mt-0.5">
                        {part.unitPrice > 0 ? (
                          <p>Unit Cost: LKR {part.unitPrice.toLocaleString()}</p>
                        ) : (
                          <p className="text-muted-foreground/70 italic">
                            Unit Cost: Pending / Not specified
                          </p>
                        )}

                        {part.serialNo && (
                          <p className="font-mono text-[10px] text-foreground">
                            S/N: {part.serialNo}
                          </p>
                        )}

                        {part.remarks && (
                          <p className="text-[11px] text-foreground/80 italic bg-muted/50 p-1 rounded border border-border/30 mt-1">
                            Note: {part.remarks}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemovePart(index)}
                      className="p-1 hover:bg-destructive-soft hover:text-destructive rounded text-muted-foreground shrink-0"
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
                        Qty Returned
                      </span>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleUpdateQty(index, "qtyReturned", -1)}
                          className="h-6 w-6 rounded bg-card border text-xs font-bold hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-foreground">
                          {part.qtyReturned}
                        </span>
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
                        <span>Reason for Return:</span>
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

                  {isExternal && (
                    <div className="text-[10px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-medium bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                      <Info size={12} className="shrink-0" />
                      <span>
                        Recorded as Outside Supplier Part — No central SAP stock deduction until
                        supervisor approval.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cost Summary Banner */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted border text-xs">
          <span className="font-semibold text-muted-foreground">
            Estimated Line Material Value:
          </span>
          <span className="font-mono font-extrabold text-foreground text-sm">
            LKR {totalCost.toLocaleString()}
          </span>
        </div>

        <Button className="w-full text-xs font-bold h-10 bg-primary" onClick={handleSaveParts}>
          Save Parts List
        </Button>
      </div>

      {/* Add Part Modal with Part Source Selection */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="card-surface rise w-full max-w-sm p-4 space-y-3 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Package size={15} className="text-primary" />
                <span>Add Spare Part</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-muted rounded text-muted-foreground"
              >
                ✕
              </button>
            </div>

            {/* PART SOURCE SELECTION SWITCHER */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Select Part Source:
              </label>
              <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg border">
                <button
                  type="button"
                  onClick={() => {
                    setPartSource("telesonic");
                    setFormError(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    partSource === "telesonic"
                      ? "bg-card text-foreground shadow-2xs border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Store size={13} className={partSource === "telesonic" ? "text-primary" : ""} />
                  <span>1. Telesonic Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPartSource("external");
                    setFormError(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    partSource === "external"
                      ? "bg-card text-amber-700 dark:text-amber-300 shadow-2xs border border-amber-500/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2
                    size={13}
                    className={partSource === "external" ? "text-amber-600" : ""}
                  />
                  <span>2. Outside / External</span>
                </button>
              </div>
            </div>

            {formError && (
              <div className="p-2 rounded-lg bg-destructive-soft text-destructive text-xs border border-destructive/30 flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* TAB 1: TELESONIC STOCK CATALOG */}
            {partSource === "telesonic" ? (
              <div className="flex-1 overflow-hidden flex flex-col space-y-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={searchCatalogQuery}
                    onChange={(e) => setSearchCatalogQuery(e.target.value)}
                    placeholder="Search stock code, name, category..."
                    className="input-field pl-8 text-xs py-1.5"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
                  {filteredCatalog.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No matching items found in Telesonic inventory.
                    </p>
                  ) : (
                    filteredCatalog.map((catItem) => (
                      <div
                        key={catItem.id}
                        onClick={() => handleAddFromCatalog(catItem)}
                        className="p-2.5 rounded-lg border bg-card hover:border-primary/50 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {catItem.partCode}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            Stock: {catItem.availableStock}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-foreground">{catItem.name}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Cat: {catItem.category}</span>
                          <span className="font-mono font-bold text-foreground">
                            LKR {catItem.unitPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: EXTERNAL / OUTSIDE PART FORM */
              <form
                onSubmit={handleAddExternalPart}
                className="flex-1 overflow-y-auto space-y-2.5 pr-1"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Building2 size={13} />
                    <span>Outside / External Purchase Record</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Record parts purchased from local shops or third-party suppliers. Does not
                    require item master stock lookup.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-foreground">
                    Part Name / Description <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={extName}
                    onChange={(e) => setExtName(e.target.value)}
                    placeholder="e.g. Copper Pipe 1/2 inch 3m, 24V Relay"
                    className="input-field text-xs py-1.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Quantity Used <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={extQty}
                      onChange={(e) => setExtQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field text-xs py-1.5 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-foreground">
                      Unit Cost (LKR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={extPrice}
                      onChange={(e) => setExtPrice(e.target.value)}
                      placeholder="e.g. 1500"
                      className="input-field text-xs py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-foreground">
                    Supplier / Shop Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={extSupplier}
                    onChange={(e) => setExtSupplier(e.target.value)}
                    placeholder="e.g. Lanka Hardware Kandy, City Auto Electric"
                    className="input-field text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-foreground">
                    Serial / Lot Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={extSerial}
                    onChange={(e) => setExtSerial(e.target.value)}
                    placeholder="e.g. SN-9948201"
                    className="input-field text-xs py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-foreground">
                    Remarks / Purpose (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={extRemarks}
                    onChange={(e) => setExtRemarks(e.target.value)}
                    placeholder="e.g. Emergency local purchase due to van stock shortage"
                    className="input-field text-xs py-1.5 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-xs font-bold h-9 bg-amber-600 hover:bg-amber-700 text-white mt-1"
                >
                  <Plus size={14} className="mr-1" />
                  Add External Part
                </Button>
              </form>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs shrink-0"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
