export type MobileJobPriority = "Critical" | "High" | "Normal" | "Low";
export type MobileJobStatus =
  "Assigned" | "Accepted" | "In Progress" | "On Hold" | "Completed" | "Declined";

export interface ServiceHistoryItem {
  date: string;
  type: string;
  technician: string;
  notes: string;
}

export interface RelatedComponent {
  name: string;
  modelOrSerial: string;
  status: string;
}

export interface TravelDetails {
  status: "Not Started" | "Traveling" | "Arrived";
  startOdometer?: number;
  endOdometer?: number;
  travelStartTime?: string;
  arrivalTime?: string;
  gpsCoordinates?: string;
  gpsAccuracy?: string;
  customerNotified?: boolean;
  customerNotifiedAt?: string;
  trafficCondition?: string;
  idempotencyKey?: string;
  travelNotes?: string;
}

export interface PartItem {
  id: string;
  partCode: string;
  name: string;
  category: string;
  unitPrice: number;
  availableStock: number;
  qtyUsed: number;
  qtyReturned: number;
  returnReason?: "Unused" | "Faulty/Damaged" | "Wrong Specification" | "Customer Cancelled";
  serialNo?: string;
  partSource?: "telesonic" | "external";
  supplierName?: string;
  remarks?: string;
}

export interface LabourLog {
  id: string;
  technicianName: string;
  date: string;
  hours: number;
  rateType: "Regular" | "Overtime" | "Weekend/Holiday";
  activityDescription: string;
}

export interface JobPhoto {
  id: string;
  category: "Before Work" | "Fault / Damage" | "Parts Replaced" | "After Work / Clean Site";
  dataUrl: string;
  caption: string;
  capturedAt: string;
}

export interface JobCompletion {
  signerName: string;
  signerRole: string;
  signatureDataUrl?: string;
  ratingStars: number;
  feedbackComments?: string;
  completedAt: string;
  workSlipNumber: string;
}

export interface SiteInspectionPoint {
  id: string;
  label: string;
  category: "Safety" | "Electrical" | "Environmental" | "Mechanical";
  status: "Pass" | "Fail" | "Attention Required" | "N/A";
  measuredValue?: string;
  notes?: string;
}

export interface SiteInspectionReport {
  id: string;
  inspectedAt: string;
  technicianName: string;
  overallStatus: "Pass" | "Fail" | "Conditional Pass";
  points: SiteInspectionPoint[];
  generalNotes?: string;
}

export interface HoldRequestRecord {
  id: string;
  reason:
    | "Awaiting Spare Parts"
    | "Customer Site Access Unavailable"
    | "Technical Escalation Required"
    | "Safety Hazard On Site";
  notes: string;
  estimatedDelayHours: number;
  requestedAt: string;
  status: "Submitted" | "Approved" | "Pending Review";
}

export interface MobileNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "assignment" | "alert" | "system";
  jobId?: string;
}

export interface StockCountItem {
  sku: string;
  name: string;
  category: string;
  binLocation: string;
  systemQty: number;
  countedQty: number;
  varianceReason?: string;
  unitPrice: number;
}

export interface MobileJob {
  id: string; // e.g. SC-2026-20511
  customerName: string; // e.g. Kandy Lake Hotel
  customerContact?: string;
  town: string;
  window: string;
  priority: MobileJobPriority;
  role: string;
  status: MobileJobStatus;
  category: string;
  siteName?: string;
  siteAddress: string;
  technicianName: string;
  scheduledDate: string; // YYYY-MM-DD
  specialConditions?: string;
  declineReason?: string;
  instructions?: string;
  components?: RelatedComponent[];
  serviceHistory?: ServiceHistoryItem[];
  lastServiceDate?: string;

  // Extended Technician Workflow Data
  travel?: TravelDetails;
  parts?: PartItem[];
  labourLogs?: LabourLog[];
  photos?: JobPhoto[];
  completion?: JobCompletion;
  inspection?: SiteInspectionReport;
  holdRequests?: HoldRequestRecord[];
}

export const MOCK_TECHNICIAN_NAME = "Nimal Perera (Mock Field Lead)";

// Local Device Date Helpers without UTC shift
export function getLocalTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const todayStr = getLocalTodayDateString();
const tomorrowStr = getLocalTomorrowDateString();
const yesterdayStr = getLocalYesterdayDateString();

// MOCK SPARE PARTS CATALOG FOR MOBILE CATALOG SEARCH
export const AVAILABLE_PARTS_CATALOG: Omit<PartItem, "qtyUsed" | "qtyReturned">[] = [
  {
    id: "P-101",
    partCode: "CAP-45UF-450V",
    name: "AC Compressor Capacitor 45uF 450V",
    category: "Electrical",
    unitPrice: 3500,
    availableStock: 12,
  },
  {
    id: "P-102",
    partCode: "RLY-DTC-24V",
    name: "Thermostat Relay Switch 24V DC",
    category: "Control Relays",
    unitPrice: 4200,
    availableStock: 8,
  },
  {
    id: "P-103",
    partCode: "FLT-VRF-CAS60",
    name: "VRF Cassette Dust Filter 600x600",
    category: "Filters",
    unitPrice: 2800,
    availableStock: 25,
  },
  {
    id: "P-104",
    partCode: "R410A-CAN-1KG",
    name: "Refrigerant R410a Canister 1kg",
    category: "Refrigerant",
    unitPrice: 8500,
    availableStock: 6,
  },
  {
    id: "P-105",
    partCode: "BLT-PNEU-A48",
    name: "V-Belt Drive A48 Heavy Duty",
    category: "Mechanical",
    unitPrice: 1950,
    availableStock: 15,
  },
  {
    id: "P-106",
    partCode: "BRG-6204-2RS",
    name: "Deep Groove Ball Bearing 6204-2RS",
    category: "Bearings",
    unitPrice: 1200,
    availableStock: 30,
  },
  {
    id: "P-107",
    partCode: "SEN-TEMP-NTC10",
    name: "NTC 10K Temperature Probe Sensor",
    category: "Sensors",
    unitPrice: 2100,
    availableStock: 18,
  },
];

// DEMONSTRATION INITIAL JOBS
export const initialMobileJobs: MobileJob[] = [
  {
    id: "SC-2026-20511",
    customerName: "Kandy Lake Hotel",
    customerContact: "+94 81 223 4567 (Mr. Silva - Chief Engineer)",
    town: "Kandy",
    window: "Today, 09:00 - 11:00",
    priority: "High",
    role: "Lead Technician",
    status: "Assigned",
    category: "VRF System (Outdoor + 6 Indoor)",
    siteName: "Lake Wing Executive Lounge",
    siteAddress: "No. 12, Sangamitta Mawatha, Kandy",
    technicianName: "Nimal Perera",
    scheduledDate: todayStr,
    specialConditions: "Customer requested morning visit before 11:00 AM",
    instructions:
      "Inspect VRF outdoor unit on roof deck. Check suction pressure and indoor cassette sensor error codes E4 & E9. Wear safety harness on roof deck.",
    components: [
      {
        name: "Outdoor Condenser Unit",
        modelOrSerial: "VRF-ODU-120A / SN: 8839201",
        status: "Inspection Required",
      },
      {
        name: "Indoor Cassette Units 01-04",
        modelOrSerial: "VRF-IDU-036B / SN: 8839202..205",
        status: "Operational",
      },
      {
        name: "Indoor Cassette Units 05-06",
        modelOrSerial: "VRF-IDU-036B / SN: 8839206..207",
        status: "Fault Code E4",
      },
    ],
    lastServiceDate: "2026-07-15",
    serviceHistory: [
      {
        date: "2026-07-15",
        type: "Quarterly PM",
        technician: "Nimal Perera",
        notes: "Cleaned coils, washed air filters, checked refrigerant levels.",
      },
      {
        date: "2026-04-10",
        type: "Filter Replacement",
        technician: "K. Jayasinghe",
        notes: "Replaced 6 indoor unit air filters.",
      },
    ],
    travel: {
      status: "Not Started",
      startOdometer: 142300,
    },
    parts: [
      {
        id: "P-103",
        partCode: "FLT-VRF-CAS60",
        name: "VRF Cassette Dust Filter 600x600",
        category: "Filters",
        unitPrice: 2800,
        availableStock: 25,
        qtyUsed: 2,
        qtyReturned: 0,
      },
    ],
    labourLogs: [
      {
        id: "L-1",
        technicianName: "Nimal Perera",
        date: todayStr,
        hours: 1.5,
        rateType: "Regular",
        activityDescription: "Initial system diagnostic and electrical wiring check.",
      },
    ],
    photos: [],
  },
  {
    id: "SC-2026-20512",
    customerName: "Perera Holdings (Pvt) Ltd",
    customerContact: "+94 11 257 8900 (Ms. Fernando - IT Manager)",
    town: "Colombo 03",
    window: "Today, 14:00 - 16:00",
    priority: "Critical",
    role: "Lead Technician",
    status: "Assigned",
    category: "Refrigerator 400L (Cabinet + Compressor)",
    siteName: "Main Server Room - B1 Level",
    siteAddress: "45 Galle Road, Colombo 03",
    technicianName: "Nimal Perera",
    scheduledDate: todayStr,
    specialConditions: "Server room backup cooling unit failure",
    instructions:
      "CRITICAL: Server room ambient temperature exceeding 28°C. Inspect primary 400L refrigeration compressor unit and emergency thermostat relay circuit.",
    components: [
      {
        name: "Hermetic Compressor 2.5HP",
        modelOrSerial: "CMP-400L-X / SN: 9912034",
        status: "Overheating",
      },
      {
        name: "Digital Temperature Controller",
        modelOrSerial: "DTC-500 / SN: 9912035",
        status: "Alarm Active",
      },
    ],
    lastServiceDate: "2026-08-01",
    serviceHistory: [
      {
        date: "2026-08-01",
        type: "Corrective Repair",
        technician: "Nimal Perera",
        notes: "Replaced thermostat relay switch and calibrated digital probe.",
      },
    ],
    travel: { status: "Not Started", startOdometer: 142310 },
    parts: [],
    labourLogs: [],
    photos: [],
  },
  {
    id: "SC-2026-20513",
    customerName: "Jayasuriya Textiles",
    customerContact: "+94 31 228 1122 (Mr. Jayasuriya)",
    town: "Negombo",
    window: "Tomorrow, 10:00 - 12:00",
    priority: "Normal",
    role: "Assistant Technician",
    status: "Accepted",
    category: "Packing Machine (Main Unit + Controller)",
    siteName: "Factory Floor - Bay 3",
    siteAddress: "88 Main Street, Negombo",
    technicianName: "Nimal Perera",
    scheduledDate: tomorrowStr,
    instructions:
      "Routine preventive maintenance and sensor calibration on automated textile packing machine main unit.",
    components: [
      { name: "Servo Drive Controller", modelOrSerial: "SDC-2200 / SN: 7712390", status: "Normal" },
      {
        name: "Pneumatic Cylinder Assembly",
        modelOrSerial: "PCA-80 / SN: 7712391",
        status: "Operational",
      },
    ],
    lastServiceDate: "2026-09-05",
    serviceHistory: [
      {
        date: "2026-09-05",
        type: "Routine Service",
        technician: "Nimal Perera",
        notes: "Lubricated pneumatic actuators and tensioned drive belts.",
      },
    ],
    travel: { status: "Not Started" },
    parts: [],
    labourLogs: [],
    photos: [],
  },
  {
    id: "SC-2026-20514",
    customerName: "Wijesinghe Motors",
    customerContact: "+94 91 223 9988 (Mr. Wijesinghe)",
    town: "Galle",
    window: "Tomorrow, 13:30 - 15:30",
    priority: "High",
    role: "Lead Technician",
    status: "On Hold",
    category: "Crew Cab Vehicle (Chassis + Engine)",
    siteName: "Service Bay 02",
    siteAddress: "22 Matara Road, Galle",
    technicianName: "Nimal Perera",
    scheduledDate: tomorrowStr,
    specialConditions: "Parts awaited (compressor capacitor)",
    instructions:
      "Crew cab vehicle AC breakdown service. Compressor capacitor replacement on hold pending parts arrival from Colombo central inventory.",
    components: [
      {
        name: "AC Compressor Assembly",
        modelOrSerial: "ACC-300 / SN: 5543112",
        status: "Awaiting Capacitor",
      },
    ],
    lastServiceDate: "2026-06-20",
    serviceHistory: [
      {
        date: "2026-06-20",
        type: "AC Gas Top-up",
        technician: "Nimal Perera",
        notes: "Recharged R134a refrigerant and leak tested manifold valves.",
      },
    ],
    holdRequests: [
      {
        id: "HR-101",
        reason: "Awaiting Spare Parts",
        notes:
          "Compressor capacitor 45uF not available in van stock. Ordered from Colombo central store.",
        estimatedDelayHours: 24,
        requestedAt: "2026-10-12 14:30",
        status: "Approved",
      },
    ],
  },
  {
    id: "SC-2026-20510",
    customerName: "Galle Fort Residences",
    customerContact: "+94 91 224 5511 (Villa Manager)",
    town: "Galle",
    window: "Yesterday, 11:00 - 13:00",
    priority: "Normal",
    role: "Lead Technician",
    status: "Completed",
    category: "Washing Machine 8kg (Main Unit)",
    siteName: "Villa 04 Utility Room",
    siteAddress: "14 Rampart Street, Galle Fort",
    technicianName: "Nimal Perera",
    scheduledDate: yesterdayStr,
    instructions:
      "Completed drum bearing replacement and drain pump clearing on 8kg washing machine.",
    components: [
      { name: "Drum Bearing Kit", modelOrSerial: "DBK-8KG / SN: 3310022", status: "Replaced" },
      {
        name: "Drain Pump Motor",
        modelOrSerial: "DPM-100 / SN: 3310023",
        status: "Cleaned & Tested",
      },
    ],
    lastServiceDate: yesterdayStr,
    serviceHistory: [
      {
        date: yesterdayStr,
        type: "Bearing & Pump Overhaul",
        technician: "Nimal Perera",
        notes: "Job completed successfully. Customer signed work completion slip.",
      },
    ],
    completion: {
      signerName: "Dharmadasa Perera",
      signerRole: "Villa Operations Supervisor",
      ratingStars: 5,
      feedbackComments: "Excellent work, fast response and clean service site.",
      completedAt: `${yesterdayStr} 12:45`,
      workSlipNumber: "WS-2026-99182",
    },
  },
];

// INITIAL NOTIFICATIONS
export const initialNotifications: MobileNotification[] = [
  {
    id: "N-101",
    title: "New Service Job Assigned",
    message: "Critical job SC-2026-20512 at Perera Holdings (Pvt) Ltd has been assigned to you.",
    time: "10 mins ago",
    read: false,
    type: "assignment",
    jobId: "SC-2026-20512",
  },
  {
    id: "N-102",
    title: "Hold Request Approved",
    message: "Spare parts hold request for SC-2026-20514 was approved by Service Supervisor.",
    time: "1 hour ago",
    read: false,
    type: "alert",
    jobId: "SC-2026-20514",
  },
  {
    id: "N-103",
    title: "Upcoming Scheduled Visit",
    message:
      "High priority job SC-2026-20511 scheduled for Today 09:00 - 11:00 at Kandy Lake Hotel.",
    time: "2 hours ago",
    read: true,
    type: "assignment",
    jobId: "SC-2026-20511",
  },
  {
    id: "N-104",
    title: "Stock Audit Schedule",
    message: "Monthly Van Stock Count Scan is due today before 18:00 PM.",
    time: "Yesterday",
    read: true,
    type: "system",
  },
];

// INITIAL VAN STOCK COUNT ITEMS
export const initialStockCountItems: StockCountItem[] = [
  {
    sku: "SKU-VAN-001",
    name: "Capacitor 45uF 450V",
    category: "Electrical",
    binLocation: "Bin A-01",
    systemQty: 5,
    countedQty: 5,
    unitPrice: 3500,
  },
  {
    sku: "SKU-VAN-002",
    name: "Thermostat Relay 24V",
    category: "Control",
    binLocation: "Bin A-02",
    systemQty: 3,
    countedQty: 2,
    varianceReason: "Used on unlogged emergency call",
    unitPrice: 4200,
  },
  {
    sku: "SKU-VAN-003",
    name: "VRF Air Filter 600x600",
    category: "Filters",
    binLocation: "Bin B-05",
    systemQty: 10,
    countedQty: 10,
    unitPrice: 2800,
  },
  {
    sku: "SKU-VAN-004",
    name: "R410A Gas Canister 1kg",
    category: "Refrigerant",
    binLocation: "Bin C-01",
    systemQty: 2,
    countedQty: 2,
    unitPrice: 8500,
  },
  {
    sku: "SKU-VAN-005",
    name: "V-Belt Drive A48",
    category: "Belts",
    binLocation: "Bin D-02",
    systemQty: 4,
    countedQty: 3,
    varianceReason: "Damaged packaging",
    unitPrice: 1950,
  },
];

// REACTIVE STORE STATE
let jobsStore: MobileJob[] = [...initialMobileJobs];
let notificationsStore: MobileNotification[] = [...initialNotifications];
let stockCountStore: StockCountItem[] = [...initialStockCountItems];

const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach((cb) => cb());
}

export function subscribeMobileJobs(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// JOB READ / UPDATE API
export function getMobileJobs(): MobileJob[] {
  return jobsStore;
}

export function getMobileJobById(id: string): MobileJob | undefined {
  if (!id) return jobsStore[0];
  const normalized = id.trim().toLowerCase();
  const exact = jobsStore.find((j) => j.id.toLowerCase() === normalized);
  if (exact) return exact;

  const partial = jobsStore.find(
    (j) =>
      normalized.includes(j.id.toLowerCase()) ||
      j.id.toLowerCase().includes(normalized) ||
      (normalized.length >= 3 && j.id.toLowerCase().endsWith(normalized.slice(-3))),
  );
  if (partial) return partial;

  return jobsStore[0];
}

export function updateMobileJobStatus(
  id: string,
  status: MobileJobStatus,
  declineReason?: string,
): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      return {
        ...j,
        status,
        ...(declineReason ? { declineReason } : {}),
      };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-04: TRAVEL / CHECK-IN
export function updateMobileJobTravel(
  id: string,
  travelData: Partial<TravelDetails>,
): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      const mergedTravel: TravelDetails = {
        status: "Not Started",
        ...j.travel,
        ...travelData,
      };
      const isArrived = mergedTravel.status === "Arrived";
      const isTraveling = mergedTravel.status === "Traveling";
      return {
        ...j,
        status: isArrived
          ? "In Progress"
          : isTraveling && j.status === "Assigned"
            ? "Accepted"
            : j.status,
        travel: mergedTravel,
      };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-06: PARTS USED & RETURNED
export function updateJobPartsList(id: string, parts: PartItem[]): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      return { ...j, parts };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-07: LABOUR LOGS
export function addJobLabourLog(id: string, log: LabourLog): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      const existingLogs = j.labourLogs || [];
      return { ...j, labourLogs: [log, ...existingLogs] };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-08: PHOTOS
export function addJobPhoto(id: string, photo: JobPhoto): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      const existingPhotos = j.photos || [];
      return { ...j, photos: [photo, ...existingPhotos] };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

export function deleteJobPhoto(id: string, photoId: string): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      const existingPhotos = j.photos || [];
      return { ...j, photos: existingPhotos.filter((p) => p.id !== photoId) };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-09: COMPLETION & SIGNATURE
export function completeMobileJob(id: string, completion: JobCompletion): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      return {
        ...j,
        status: "Completed",
        completion,
      };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-11: SITE INSPECTION
export function saveJobInspection(
  id: string,
  inspection: SiteInspectionReport,
): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      return { ...j, inspection };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-13: HOLD REQUEST
export function submitJobHoldRequest(
  id: string,
  holdReq: HoldRequestRecord,
): MobileJob | undefined {
  jobsStore = jobsStore.map((j) => {
    if (j.id === id) {
      const existingHolds = j.holdRequests || [];
      return {
        ...j,
        status: "On Hold",
        holdRequests: [holdReq, ...existingHolds],
      };
    }
    return j;
  });
  notifyAll();
  return getMobileJobById(id);
}

// O1-SCR-MOB-14: NOTIFICATIONS
export function getMobileNotifications(): MobileNotification[] {
  return notificationsStore;
}

export function markNotificationRead(id: string) {
  notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
  notifyAll();
}

export function markMobileNotificationAsRead(id: string): MobileNotification[] {
  markNotificationRead(id);
  return getMobileNotifications();
}

export function markAllNotificationsRead() {
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  notifyAll();
}

export function markAllMobileNotificationsAsRead(): MobileNotification[] {
  markAllNotificationsRead();
  return getMobileNotifications();
}

export function deleteMobileNotification(id: string): MobileNotification[] {
  notificationsStore = notificationsStore.filter((n) => n.id !== id);
  notifyAll();
  return getMobileNotifications();
}

// O1-SCR-MOB-12: STOCK COUNT
export function getStockCountItems(): StockCountItem[] {
  return stockCountStore;
}

export function updateStockCountItem(sku: string, countedQty: number, varianceReason?: string) {
  stockCountStore = stockCountStore.map((item) =>
    item.sku === sku ? { ...item, countedQty, varianceReason } : item,
  );
  notifyAll();
}
