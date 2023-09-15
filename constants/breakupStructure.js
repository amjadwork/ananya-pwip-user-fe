import {
  riceAndBagsIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  // eyePreviewIcon,
} from "../theme/icon";

export const breakupArr = [
  {
    title: "Rice and bags",
    icon: riceAndBagsIcon,
    afterIcon: "/assets/images/costing/road.png",
    rowItems: [
      {
        label: "Cost of rice",
        name: "costOfRice",
        inr: 0,
        usd: 0,
      },
      {
        label: "PPWoven-50 Kg",
        name: "bagPrice",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Handling and Inspection",
    icon: handlingAndInspectionIcon,
    afterIcon: "/assets/images/costing/container.png",
    rowItems: [
      {
        label: "Transportation",
        name: "transportation",
        inr: 0,
        usd: 0,
      },
      {
        label: "CFS Handling",
        name: "cfsHandling",
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "Craft paper",
            inr: 0,
            usd: 0,
          },
          {
            label: "Silica gel",
            inr: 0,
            usd: 0,
          },
          {
            label: "Loading chargers",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "Shipping line locals",
        name: "shl",
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "THC",
            inr: 0,
            usd: 0,
          },
          {
            label: "BL",
            inr: 0,
            usd: 0,
          },
          {
            label: "Surrender",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "OFC",
        name: "ofc",
        inr: 0,
        usd: 0,
      },
      {
        label: "Inspection cost",
        name: "inspectionCost",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Other chargers",
    icon: otherChargesIcon,
    // afterIcon: "/assets/images/costing/ocean.png",
    rowItems: [
      {
        label: "Finance cost",
        name: "financeCost",
        inr: 0,
        usd: 0,
      },
      {
        label: "Overheads",
        name: "overheads",
        inr: 0,
        usd: 0,
      },
      {
        label: "Margin",
        name: "margin",
        inr: 0,
        usd: 0,
      },
      {
        label: "20% Export duty",
        name: "exportDuty",
        inr: 0,
        usd: 0,
      },
      // {
      //   label: "PWIP Fulfilment ",
      //   name: "pwipFullfillment",
      //   inr: 0,
      //   usd: 0,
      // },
    ],
  },
];
