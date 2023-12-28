export const personalFields = [
  {
    name: "full_name",
    label: "Name",
    type: "text",
  },
  {
    name: "headline",
    label: "Headline",
    type: "text",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    placeholder: "eg. India",
    defaultValue: "IN",
  },
  {
    name: "state",
    label: "State",
    type: "select",
    placeholder: "eg. Karnataka",
  },
  {
    name: "city",
    label: "City",
    type: "select",
    placeholder: "eg. Bengaluru",
  },
  {
    name: "zip_code",
    label: "Zip Code",
    type: "number",
  },
];
export const personalFieldsHeading = {
  heading: "Personal Details",
};
export const contactFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "phone",
    label: "Mobile",
    type: "number",
  },
];
export const contactFieldsHeading = {
  heading: "Contact Details",
};
export const companyFields = [
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "Add your company name",
  },
  {
    name: "address",
    label: "Company Address",
    type: "text",
    placeholder: "Add your company address",
  },
  {
    name: "gstin",
    label: "GST Number",
    type: "text",
    placeholder: "Add your GST Number",
  },
];
export const companyFieldsHeading = {
  heading: "Company Details",
};

export const aboutFields = [
  {
    name: "bio",
    label:
      "You can write about your years of experience, skills and industry here",
    type: "textarea",
    placeholder: "",
  },
];

export const aboutFieldsHeading = {
  heading: "About",
};

export const socialFields = [
  {
    name: "whatsapp_link",
    label: "Whatsapp",
    type: "text",
    placeholder: "Add your Whatsapp Number",
  },
  {
    name: "website",
    label: "Website",
    type: "text",
    placeholder: "Add your website URL with https",
  },
  {
    name: "facebook_url",
    label: "Facebook",
    type: "text",
    placeholder: "Add your Facebook profile URL with https",
  },
  {
    name: "instagram_url",
    label: "Instagram",
    type: "text",
    placeholder: "Add your Instagram profile URL with https",
  },
  {
    name: "linkedin_url",
    label: "LinkedIn",
    type: "text",
    placeholder: "Add your LinkedIn profile URL with https",
  },
  {
    name: "youtube_url",
    label: "Youtube",
    type: "text",
    placeholder: "Add your Youtube channel URL with https",
  },
];

export const socialFieldsHeading = {
  heading: "Social Details",
};

export const professionFieldHeading = {
  heading: "Select your Profession",
};
export const professionField = [
  {
    name: "profession",
    label: "",
    type: "grid",
    placeholder: "",
  },
];
