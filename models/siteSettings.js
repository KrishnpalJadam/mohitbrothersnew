// ** Essential imports
import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    logo: { type: String },
    topbar: { type: Boolean },
    topbarContent: { type: String },
    topbarStyle: { type: String },
    headerLayout: { type: String },
    footerLayout: { type: String },
    socials: { type: Array },
    paymentMethods: { type: Array },
    customerViews: { type: Boolean },
    customerViewsNos: { type: Array },
    customerViewsTimer: { type: String },
    soldInLast: { type: Boolean },
    soldInLastProducts: { type: Array },
    soldInLastHours: { type: Array },
    countdown: { type: Boolean },
    countdownText: { type: String },
    countdownTimer: { type: Number },
    hotStock: { type: Boolean },
    hotStockInventoryLevel: { type: Number },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
