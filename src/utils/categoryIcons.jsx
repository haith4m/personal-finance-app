import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MovieIcon from "@mui/icons-material/Movie";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FlightIcon from "@mui/icons-material/Flight";
import SavingsIcon from "@mui/icons-material/Savings";
import CategoryIcon from "@mui/icons-material/Category";

const ICON_MAP = [
  {
    keywords: ["food", "dining", "restaurant", "eat", "lunch", "dinner", "breakfast", "grocery", "groceries", "takeaway", "takeout"],
    icon: RestaurantIcon,
    color: "#f59e0b",
  },
  {
    keywords: ["transport", "travel", "car", "bus", "train", "taxi", "uber", "fuel", "petrol", "gas", "commute", "parking"],
    icon: DirectionsCarIcon,
    color: "#3b82f6",
  },
  {
    keywords: ["shopping", "clothes", "clothing", "fashion", "shop", "retail", "amazon"],
    icon: ShoppingBagIcon,
    color: "#ec4899",
  },
  {
    keywords: ["entertainment", "fun", "movie", "cinema", "game", "games", "leisure", "streaming", "netflix", "spotify"],
    icon: MovieIcon,
    color: "#8b5cf6",
  },
  {
    keywords: ["health", "medical", "doctor", "pharmacy", "hospital", "medicine", "dentist", "optician"],
    icon: LocalHospitalIcon,
    color: "#ef4444",
  },
  {
    keywords: ["home", "rent", "housing", "mortgage", "furniture", "household"],
    icon: HomeIcon,
    color: "#10b981",
  },
  {
    keywords: ["bills", "utilities", "electric", "electricity", "water", "internet", "phone", "broadband", "subscription"],
    icon: ReceiptIcon,
    color: "#f97316",
  },
  {
    keywords: ["coffee", "cafe", "café", "drink", "bar"],
    icon: LocalCafeIcon,
    color: "#92400e",
  },
  {
    keywords: ["education", "school", "course", "book", "books", "tuition", "university", "college"],
    icon: SchoolIcon,
    color: "#0ea5e9",
  },
  {
    keywords: ["gym", "fitness", "sport", "sports", "exercise", "yoga", "running"],
    icon: FitnessCenterIcon,
    color: "#84cc16",
  },
  {
    keywords: ["flight", "holiday", "vacation", "trip", "hotel", "airbnb", "accommodation"],
    icon: FlightIcon,
    color: "#06b6d4",
  },
  {
    keywords: ["savings", "investment", "pension", "saving"],
    icon: SavingsIcon,
    color: "#22c55e",
  },
];

const DEFAULT = { icon: CategoryIcon, color: "#94a3b8" };

export function getCategoryMeta(name = "") {
  const lower = name.toLowerCase();
  return (
    ICON_MAP.find(({ keywords }) => keywords.some((kw) => lower.includes(kw))) ||
    DEFAULT
  );
}
