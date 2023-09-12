import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Formik } from "formik";

import { cameraIcon } from "../../../theme/icon";
import { useOverlayContext } from "@/context/OverlayContext";
import withAuth from "@/hoc/withAuth";
import { profileFormFields } from "@/constants/profileFormFields";
import { professionOptions } from "@/constants/professionOptions";

// Import Components
import { Header } from "@/components/Header";

const initialValues = {
  fullName: "",
  email: "",
  number: "",
  companyName: "",
  profession: "",
  gstNumber: "",
};

function Profile() {
  const router = useRouter();

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
  } = useOverlayContext();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  const formFields = [...profileFormFields];

  const professionList = [...professionOptions];

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
                // onClick={() => handleProfessionSelect(item.value)}
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

  const handleFormUpdate = async (values, { resetForm }) => {
    try {
      //update logic here
      resetForm();
      openToastMessage("Update successful!", "success");
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
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

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
      <div className="fixed top-0 left-0 h-screen w-screen bg-pwip-primary z-0"></div>
      <div
        id="fixedMenuSection"
        className="fixed w-full z-10  flex flex-col top-[4rem]  items-center justify-center"
      >
        <div className="h-[134px] w-[134px]  rounded-full ring-1 ring-white p-[2px]">
          <img
            src={"/assets/images/no-profile.png"}
            className="h-full w-full rounded-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center font-size">
            {cameraIcon}
          </div>
        </div>
      </div>
      <div
        className="fixed w-full min-h-[calc(100vh-300px)] rounded-t-2xl bg-pwip-white-100 px-5"
        style={{
          top: mainContainerHeight + 4 + "px",
        }}
      >
        <div
          className="mt-24 pb-[14rem] pt-[1rem] overflow-y-scroll hide-scroll-bar"
          style={{
            height: `calc(100vh - ${mainContainerHeight + 32 + "px"})`,
          }}
        >
          <span className="text-pwip-gray-100 mt-24 w-full font-sans font-normal text-lg text-left">
            Personal details
          </span>
          <Formik initialValues={initialValues} onSubmit={handleFormUpdate}>
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                {formFields.map((field) => (
                  <div key={field.name} className="relative mb-4">
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[field.name]}
                      className="block px-2.5 pb-3 pt-3 my-6 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-pwip-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pwip-primary peer"
                      placeholder=" "
                      onClick={() => {
                        if (field.name === "profession") {
                          handleProfessionBottomSheet();
                        }
                      }}
                    />
                    <label
                      htmlFor={field.name}
                      className="absolute text-sm text-pwip-gray-600 -top-2 left-3 bg-pwip-white-100 focus:text-pwip-primary px-2 font font-thin"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
                <div className="fixed bottom-0 left-0 w-full p-5 bg-pwip-white-100">
                  <button
                    type="submit"
                    className="w-full text-white bg-pwip-primary py-4 px-4 rounded-md hover:bg-primary transition duration-300 ease-in-out shadow-md"
                  >
                    Update Changes
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(Profile);
