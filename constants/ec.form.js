export const ecForm = [
  {
    title: "Booking",
    type: "details",
    form: [
      {
        label: "Type of Booking",
        type: "radio",
        options: ["FCL"],
      },
      {
        label: "Terms of Shipment",
        type: "select",
        placeholder: "eg. Free on Road (FOR)",
        options: [
          { id: 0, value: "fof", label: "Free on Road (FOR)" },
          { id: 1, value: "fob", label: "Free on Board (FOB)" },
          { id: 2, value: "cif", label: "Cost Insurance and Freight (CIF)" },
        ],
      },
      {
        label: "Type of Product",
        type: "imageRadio",
        options: ["Rice", "Others"],
      },
    ],
  },
  {
    title: "Product",
    type: "details",
    form: [
      {
        label: "Rice Category",
        type: "select",
        placeholder: "eg. Basmati",
        options: [
          { id: 0, value: "basmati", label: "Basmati" },
          { id: 1, value: "non-basmati", label: "Non-Basmati" },
        ],
      },
      {
        label: "Rice Variety",
        type: "select",
        placeholder: "eg. Kolam",
        options: [
          { id: 0, value: "sonamasuri steam", label: "Sonamasuri Steam" },
          { id: 1, value: "kolam", label: "Kolam" },
        ],
      },
      {
        label: "Broken Percentage (%)",
        type: "counter",
      },
    ],
  },
  {
    title: "Location",
    type: "details",
    form: [
      {
        label: "Sourcing Location",
        type: "select",
        placeholder: "eg. Karnataka",
        options: [{ id: 0, value: "Karnataka", label: "Karnataka" }],
      },
      {
        label: "Enter your ex-mill price",
        type: "input",
        placeholder: "eg. 54.20",
      },
      {
        label: "Orign Port/City",
        type: "select",
        placeholder: "eg. Bengaluru",
        isSearchable: true,
        options: [{ id: 0, value: "Bengaluru", label: "Bengaluru" }],
      },
      {
        label: "Destination Port/City",
        type: "select",
        placeholder: "eg. Bengaluru",
        isSearchable: true,
        options: [{ id: 0, value: "Bengaluru", label: "Bengaluru" }],
      },
    ],
  },
  {
    title: "Bag",
    type: "details",
    form: [
      {
        label: "Type of Bag",
        type: "select",
        placeholder: "eg. BOPP",
        options: [],
      },
      {
        label: "Bag Weight",
        type: "counter",
      },
    ],
  },
  {
    title: "Container",
    type: "details",
    form: [
      {
        label: "Type of Container",
        type: "select",
        placeholder: "eg. Container",
        options: [
          {
            value: "General Container (20 ft)",
            label: "General Container (20 ft)",
          },
        ],
      },
      {
        label: "Container Weight",
        type: "inputRadio",
        placeholder: "eg. 2 kg",
        options: ["Metric Tons", "Kg", "Quintal"],
      },
      {
        label: "Container Count",
        type: "counter",
      },
    ],
  },

  {
    title: "Other Costs",
    type: "details",
    form: [
      {
        label: "Finance cost (if any)",
        type: "input",
        placeholder: "eg. Rs 200",
        options: [],
      },
      {
        label: "Transport cost (if any)",
        placeholder: "eg. Rs 200",
        type: "input",
      },
      {
        label: "Overheads (if any)",
        placeholder: "eg. Rs 200",
        type: "input",
      },
    ],
  },
];
