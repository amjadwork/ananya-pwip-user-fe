import {
  communityIcon,
  myOrderIcon,
  mySubscriptionsIcon,
  notificationsIcon,
  supportIcon,
  requestAPortIcon,
} from "theme/icon";

export const moreSettingOptions = [
  // {
  //   label: "Community",
  //   icon: communityIcon,
  //   backgroundColor: "#CFECFF66",
  //   path: "/community",
  // },

  // {
  //   label: "My orders",
  //   icon: myOrderIcon,
  //   backgroundColor: "#d9e5f166",
  //   path: "!#",
  // },

  {
    label: "My subscriptions",
    icon: mySubscriptionsIcon,
    backgroundColor: "#CFE4C466",
    path: "/subscriptions",
  },

  // {
  //   label: "Notifications",
  //   icon: notificationsIcon,
  //   backgroundColor: "#E7C9E066",
  //   path: "!#",
  // },

  {
    label: "Help and support",
    icon: supportIcon,
    backgroundColor: "#FFEADB66",
    path: "https://api.whatsapp.com/send?phone=918105632544&text=Hi",
  },

  {
    label: "Request a destination port",
    icon: requestAPortIcon,
    backgroundColor: "#d9e5f166",
    type: "in-app",
    component: "PortRequestForm",
  },
];
