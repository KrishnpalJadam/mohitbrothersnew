// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = pkg;

const siteSettingsType = new GraphQLObjectType({
  name: "siteSettingsType",
  fields: () => ({
    _id: { type: GraphQLString },
    logo: { type: GraphQLString },
    topbar: { type: GraphQLBoolean },
    topbarContent: { type: GraphQLString },
    topbarStyle: { type: GraphQLString },
    headerLayout: { type: GraphQLString },
    footerLayout: { type: GraphQLString },
    socials: { type: new GraphQLList(GraphQLString) },
    paymentMethods: { type: new GraphQLList(GraphQLString) },
    customerViews: { type: GraphQLBoolean },
    customerViewsNos: { type: new GraphQLList(GraphQLString) },
    customerViewsTimer: { type: GraphQLString },
    soldInLast: { type: GraphQLBoolean },
    soldInLastProducts: { type: new GraphQLList(GraphQLString) },
    soldInLastHours: { type: new GraphQLList(GraphQLString) },
    countdown: { type: GraphQLBoolean },
    countdownText: { type: GraphQLString },
    countdownTimer: { type: GraphQLFloat },
    hotStock: { type: GraphQLBoolean },
    hotStockInventoryLevel: { type: GraphQLFloat },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default siteSettingsType;
