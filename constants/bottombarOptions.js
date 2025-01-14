import {
  homeBottomBarIcon,
  exportCostingBottomBarIcon,
  learnBottomBarIcon,
  dashboardBottomBarIcon,
  myCostingBottomBarIcon,
  moreBottomBarIcon,
  watchlistBottomBarIcon,
} from "../theme/icon";

export const options = [
  {
    icon: homeBottomBarIcon,
    label: "Home",
    path: "home",
  },
  // {
  //   icon: exportCostingBottomBarIcon,
  //   label: "Costing",
  //   path: "export-costing",
  // },
  {
    icon: learnBottomBarIcon,
    label: "Learn",
    path: "learn",
  },
  // {
  //   icon: dashboardBottomBarIcon,
  //   label: "Dashboard",
  //   path: "dashboard",
  // },
  {
    icon: myCostingBottomBarIcon,
    label: "Costings",
    path: "my-costing",
  },
  {
    icon: watchlistBottomBarIcon,
    label: "Watchlist",
    path: "watchlist",
  },
  {
    icon: moreBottomBarIcon,
    label: "More",
    path: "more",
    type: "server-side-nav",
  },
];
