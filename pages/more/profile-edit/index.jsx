import React, {useState, useEffect, useRef} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Formik } from "formik";
import * as Yup from 'yup';

import withAuth from "@/hoc/withAuth";
import { useOverlayContext } from "@/context/OverlayContext";
import { cameraIcon } from "../../../theme/icon";
import { profileFormFields } from "@/constants/profileFormFields";
import { professionOptions } from "@/constants/professionOptions";
import {
  fetchProfileFailure,
  saveProfileRequest,
  saveProfileFailure,
  updateProfileRequest,
  fetchProfileRequest,
  updateProfileFailure,
} from "../../../redux/actions/profileEdit.actions";

// Import Components
import { Header } from "@/components/Header";

const initialValues = {
  name: "",
  headline: "",
  email: "",
  mobile: "",
  headline:"",
  companyName: "",
  profession: "",
  gstin: "",
  bio:"",
  city:"",
  state:"",
  country:"",
  zip_code:"",
  website:"",
  youtube_url:"",
  facebook_url:"",
  linkedin_url:"",
  instagram_url:"",
  whatsapp_link:"",
}

const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .test('has-extension', 'Invalid email', (value) => {
      if (value) {
        return /\.\w{2,}$/.test(value);
      }
      return true;
    })
    .required('Required'),
  bio: Yup.string()
  .max(100, 'Maximum 100 characters'),
  profession: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  website: Yup.string()
  .matches(
    /^(https?:\/\/)?(www\.)?([A-Za-z0-9.-]+)\.([A-Za-z]{2,})(:[0-9]+)?(\/.*)?$/,
    'Invalid Website URL'
  ).nullable(),
  facebook_url: Yup.string()
  .matches(
    /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9.-]+\/?$/,
    'Invalid Facebook URL'
  ).nullable(),
  youtube_url: Yup.string().url().nullable(),
  linkedin_url: Yup.string()
  .matches(
    /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9.-]+\/?$/,
    'Invalid LinkedIn URL'
  ).nullable(),
  instagram_url: Yup.string()
  .matches(
    /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?$/,
    'Invalid Instagram URL'
  ).nullable(),
});
  

function ProfileEdit() {
  const formik = useRef();
  const { data: session } = useSession();

  const [mainContainerHeight, setMainContainerHeight] = useState(0);
  const [userData, setUserData] = React.useState(null);

  const formFields = [...profileFormFields];
  const professionList = [...professionOptions];

  useEffect(() => {
    if (session) {
      setUserData(session?.user);
      formik.current.setValues({
        ...initialValues,
        name: session.user.name,
        email: session.user.email,
      });
    }  
  }, [session]);

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
  } = useOverlayContext();

  const handleProfessionSelect = (value) => {
    formik.current.setValues({
      ...formik.current.values,
      profession: value,
    });
    closeBottomSheet();
  };

  const handleProfessionBottomSheet = () => {
    const content = (
      <React.Fragment>
        <div className="px-5 mb-6 pt-4">
          <span className="text-base font-sans font-semibold text-pwip-gray-900 text-left">
            Select Profession
          </span>
        </div>

        <div className=" px-5 pb-[4rem] grid grid-cols-2 gap-4">
          {[...professionList].map((item, index) => {
            return (
              <div
                key={item.value + index}
                className="h-40 w-40 rounded-md bg-pwip-white inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
                onClick={() => handleProfessionSelect(item.value)}
              >
                <div className="w-full pt-3 inline-flex items-center justify-center">
                  <img src={item.image} />
                </div>
                <div className=" flex w-fill flex-col space-y-[3px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1 text-center">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
    openBottomSheet(content);
  };


  const handleFormSubmit = async () => {
  try {
    const payload= {
      data:{
      ...formik.current.values,
    }}
    console.log("payload", payload)
    } catch (error) {
      console.error("Update failed:", error);
      openToastMessage("Update failed. Please try again.", "error");
    }
  };

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>Export Costing by pwip</title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Header />
        <div
          id="fixedMenuSection"
          className={`h-[auto] fixed mt-[68px] w-full bg-pwip-primary z-10 px-5`}
        >
          <div className="inline-flex items-center space-x-5">
          <div className="h-[134px] w-[134px] rounded-full ring-1 ring-white ml-[7rem] p-[2px] relative top-2 z-20">
          <div className="absolute inset-0 flex items-center justify-center">
          {cameraIcon}
          </div>
         <img
            src={userData?.picture || "/assets/images/no-profile.png"}
           className="h-full w-full rounded-full object-cover"
          />
        </div>
          </div>
          <div className="absolute bottom-[-16px] left-0 bg-pwip-white-100 h-[5rem] w-full rounded-t-2xl z-10" />
        </div>
        <div
          className={`min-h-screen inline-flex flex-col w-full bg-pwip-white-100 overflow-auto px-5 hide-scroll-bar relative`}
          style={{
            paddingTop: mainContainerHeight * 1.7 + "px",
            paddingBottom: mainContainerHeight - 52 + "px",
          }}
        >
            <span className="text-pwip-gray-100 w-full font-sans font-normal text-lg text-left">
            Personal details
          </span>
          <Formik
            innerRef={formik}
            initialValues={{
              ...initialValues,
            }}
            validationSchema={profileValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              dirty,
              touched,
              isValid,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit();
              }}>
                {formFields.map((field) => (
                <div key={field.name} className="relative mb-4">
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={field.name === "mobile" ? 10 : undefined}
                  value={values[field.name]}
                  style={{ textAlign: 'left' }}
                  className={`block px-2.5 pb-3 pt-3 my-6 w-full text-sm text-gray-900 bg-transparent rounded-sm border ${
                    errors[field.name]  && touched[field.name]
                      ? 'border-red-300'
                      : 'border-pwip-gray-300'
                  } appearance-none focus:outline-none focus:ring-0 focus:border-pwip-primary peer`}
                  placeholder={field.placeholder}
                  setFieldValue={setFieldValue}
                  onClick={() => {
                    if (field.name === "profession") {
                      handleProfessionBottomSheet();
                    }
                  }}
                />
                {errors[field.name] && touched[field.name] ? (
                  <p 
                  className="absolute text-red-400 text-xs"
                  style={{ top: '100%'}} 
                  >{errors[field.name]}</p>
                ) : null}
                <label
                  htmlFor={field.name}
                  className="absolute text-sm text-pwip-gray-600 -top-2 left-3 bg-pwip-white-100 focus:text-pwip-primary px-2 font font-thin"
                >
                  {field.label}
                </label>
              </div>
                ))}
                <div className="fixed bottom-0 left-0 w-full p-3 bg-pwip-white-100">
                  <button
                    type="submit"
                    className={`w-full text-white font-semibold py-4 px-4 rounded-md hover:bg-primary transition duration-300 ease-in-out shadow-md ${
                      (!dirty || !isValid || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-pwip-primary'
                    }`}
                    disabled={!dirty || !isValid || isSubmitting}
                    onClick={handleFormSubmit}
                  >
                    Update Changes
                  </button>
                </div>
              </form>
                )}
        </Formik>
         </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit)
