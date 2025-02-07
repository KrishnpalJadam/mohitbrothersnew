// ** Essential imports
import mongoose from "mongoose";

const HomepageSchema = new mongoose.Schema(
  {
    heroType: { type: String },
    heroImagesLarge: { type: Array },
    heroImagesSmall: { type: Array },
    heroHeading: { type: String },
    heroSubHeading: { type: String },
    heroBtnText: { type: String },
    heroLink: { type: String },
    heroCountdown: { type: Number },
    heroCountdownText: { type: String },
    marquee: { type: Boolean },
    marqueeText: { type: String },
    subHeroTitle: { type: String },
    subHeroImages: { type: Array },
    subHeroHeading: { type: Array },
    subHeroBtnText: { type: Array },
    subHeroLink: { type: Array },
    riskReducersImages: { type: Array },
    riskReducersHeading: { type: Array },
    riskReducersText: { type: Array },
    spotlight1: { type: Boolean },
    spotlight1Image: { type: String },
    spotlight1Link: { type: String },
    spotlight2: { type: Boolean },
    spotlight2Image: { type: String },
    spotlight2Link: { type: String },
    categoryTitle: { type: String },
    categoryImages: { type: Array },
    categoryHeading: { type: Array },
    categoryText: { type: Array },
    categoryLink: { type: Array },
    newsletter: { type: Boolean },
    newsletterHeading: { type: String },
    newsletterText: { type: String },
    newsletterBtnText: { type: String },
    newsletterSuccessHeading: { type: String },
    newsletterSuccessText: { type: String },
    trending: { type: Boolean },
    trendingLimit: { type: Number },
  },
  { timestamps: true }
);

const Homepage = mongoose.model("Homepage", HomepageSchema);

export default Homepage;
