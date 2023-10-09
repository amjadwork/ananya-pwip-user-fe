import {
  instagram,
  linkedin,
  facebook,
  whatsapp,
  youtube,
} from "../theme/icon";

export const personalFields = [
  {
    heading: "Personal details",
  },
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
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "phone",
    label: "Mobile",
    type: "number",
  },

  {
    name: "bio",
    label: "Bio",
    type: "text",
    placeholder: "Tell us a bit about yourself",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "eg. Bengaluru",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "eg. Karnataka",
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    placeholder: "eg. India",
  },
  {
    name: "zip_code",
    label: "Zip Code",
    type: "number",
  },
];
export const companyFields = [
  {
    heading: "Company details",
  },
  {
    name: "profession",
    label: "Profession",
    type: "button",
    placeholder: "Select your profession",
  },
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "Add your company name",
  },

  {
    name: "gstin",
    label: "GST Number",
    type: "text",
    placeholder: "",
  },
];

export const socialFields = [
  {
    heading: "Social details",
  },
  {
    name: "whatsapp_link",
    icon: whatsapp,
    type: "numeric",
    placeholder: "Type WhatsApp number",
  },
  {
    name: "linkedin_url",
    icon: linkedin,
    type: "text",
    placeholder: "Type Linkedin Id",
  },
  {
    name: "facebook_url",
    icon: facebook,
    type: "text",
    placeholder: "Type Facebook Id",
  },
  {
    name: "website",
    image: "/assets/images/profession/website.png",
    type: "text",
    placeholder: "Type Website Link",
  },
  {
    name: "youtube_url",
    icon: youtube,
    type: "text",
    placeholder: "Type Youtube Id",
  },
  {
    name: "instagram_url",
    icon: instagram,
    type: "text",
    placeholder: "Type Instagram Id",
  },
];
