import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/Button";

import withAuth from "@/hoc/withAuth";
import { useOverlayContext } from "@/context/OverlayContext";
import { cameraIcon } from "../../../theme/icon";
import {
  personalFields,
  socialFields,
  companyFields,
} from "@/constants/profileFormFields";
import { professionOptions } from "@/constants/professionOptions";
import {
  // fetchProfileFailure,
  updateProfileRequest,
  fetchProfileRequest,
  // updateProfileFailure,
} from "@/redux/actions/profileEdit.actions";
import {
  // fetchUserFailure,
  updateUserRequest,
  fetchUserRequest,
  // updateUserFailure,
} from "@/redux/actions/userEdit.actions";
// Import Components
import { Header } from "@/components/Header";

import {
  intersectObjects,
  getChangedPropertiesFromObject,
} from "@/utils/helper";

const requiredProfilePayload = {
  profile_pic: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  gstin: "",
  headline: "",
  bio: "",
  companyName: "",
  profession: "",
  website: "",
  youtube_url: "",
  facebook_url: "",
  instagram_url: "",
  whatsapp_link: "",
  linkedin_url: "",
};

const requiredUserPayload = {
  first_name: "",
  last_name: "",
  middle_name: "",
  full_name: "",
  email: "",
  phone: "",
};

const initialValues = {
  full_name: "",
  headline: "",
  email: "",
  phone: "",
  companyName: "",
  profession: "",
  gstin: "",
  bio: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  website: "",
  youtube_url: "",
  linkedin_url: "",
  facebook_url: "",
  whatsapp_link: "",
  instagram_url: "",
};

const profileValidationSchema = Yup.object().shape({
  full_name: Yup.string().required("Please enter your full name"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid mobile number")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .test("has-extension", "Invalid email", (value) => {
      if (value) {
        return /\.\w{2,}$/.test(value);
      }
      return true;
    })
    .required("Required"),
  bio: Yup.string().max(255, "Maximum 255 characters").nullable(),
  profession: Yup.string().nullable(),
  website: Yup.string().url().nullable(),
  facebook_url: Yup.string().nullable(),
  youtube_url: Yup.string().nullable(),
  linkedin_url: Yup.string().nullable(),
  instagram_url: Yup.string().nullable(),
});

function ProfileEdit() {
  const formik = useRef();
  const dispatch = useDispatch();
  const profileObject = useSelector((state) => state.profile);
  const userObject = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);

  const [mainContainerHeight, setMainContainerHeight] = useState(0);

  const professionList = [...professionOptions];

  useEffect(() => {
    if (profileObject && userObject && formik && formik.current) {
      const formikRef = formik.current;

      const updatedFormValues = {
        ...userObject.userData,
        ...profileObject.profileData,
      };
      formikRef.setValues(updatedFormValues);
    }
  }, [profileObject, userObject, formik]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
      dispatch(fetchUserRequest());
    }
  }, [token]);

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    // closeToastMessage,
  } = useOverlayContext();

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

  const handleProfessionSelect = (value) => {
    formik.current.setValues({
      ...formik.current.values,
      profession: value,
    });
    closeBottomSheet();
  };

  const handleFormSubmit = async () => {
    try {
      const formValues = {
        data: {
          ...formik.current.values,
        },
      };

      const userFormValues = intersectObjects(
        requiredUserPayload,
        formValues.data
      );
      const profileFormValues = intersectObjects(
        requiredProfilePayload,
        formValues.data
      );

      const userPayload = getChangedPropertiesFromObject(
        userObject.userData,
        userFormValues
      );
      const profilePayload = getChangedPropertiesFromObject(
        profileObject.profileData,
        profileFormValues
      );

      const requestAction = null;

      if (Object.keys(userPayload)?.length) {
        const payload = {
          ...userPayload,
        };
        requestAction = await dispatch(updateUserRequest(payload));
      }

      if (Object.keys(profilePayload)?.length) {
        const payload = {
          ...profilePayload,
        };
        requestAction = await dispatch(updateProfileRequest(payload));
      }

      if (Object.keys(requestAction?.payload)?.length) {
        openToastMessage({
          type: "success",
          message: "Profile has been updated successfully.",
        });
        requestAction = null;
      }
    } catch (error) {
      openToastMessage({
        type: "error",
        message: error?.message || "Update failed. Please try again.",
      });
    }
  };

  useEffect(() => {
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
        {/*<meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
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
              src={
                profileObject?.profileData?.profile_pic ||
                "/assets/images/no-profile.png"
              }
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
            // isValid,
            // setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* <span className="text-pwip-gray-100 w-full font-sans font-normal text-lg text-left">
                Personal details
              </span> */}
              {[...personalFields, ...companyFields, ...socialFields].map(
                (field) => (
                  <div key={field.name} className="relative mb-4">
                    {field.heading && (
                      <span className="text-pwip-gray-100 w-full font-sans font-normal text-lg text-left pb-10">
                        {field.heading}
                      </span>
                    )}
                    {!field.heading && (
                      <>
                        <div className="absolute top-3 left-2">
                          <img src={field.image} />
                          {field.icon}
                        </div>
                        <input
                          type={field.type}
                          pattern={
                            field.type === "number" ? "[0-9]*" : undefined
                          }
                          inputMode={
                            field.type === "numeric" ? "numeric" : undefined
                          }
                          id={field.name}
                          name={field.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={
                            field.name === "phone" ||
                            field.name === "whatsapp_link"
                              ? 10
                              : undefined
                          }
                          disabled={field.name === "email" ? true : false}
                          defaultValue={values[field.name] || ""}
                          style={{
                            textAlign: "left",
                            paddingLeft: `calc(${
                              field.icon || field.image ? "36px" : "0"
                            })`,
                          }}
                          className={`block px-2.5 pb-3 pt-3 my-6 w-full text-sm text-gray-900 rounded-sm border ${
                            errors[field.name] && touched[field.name]
                              ? "border-red-300"
                              : "border-pwip-gray-300"
                          } appearance-none focus:outline-none focus:ring-0 focus:border-pwip-primary peer`}
                          placeholder={field.placeholder}
                          onClick={() => {
                            if (field.name === "profession") {
                              handleProfessionBottomSheet();
                            }
                          }}
                        />
                        {errors[field.name] ? (
                          <span
                            className="absolute text-red-400 text-xs"
                            style={{ top: "100%" }}
                          >
                            {errors[field.name]}
                          </span>
                        ) : null}
                        <label
                          htmlFor={field.name}
                          className="absolute text-sm text-pwip-gray-600 -top-2 left-3 bg-pwip-white-100 focus:text-pwip-primary px-2 font font-thin"
                        >
                          {field.label}
                        </label>
                      </>
                    )}
                  </div>
                )
              )}
              <div className="fixed bottom-0 left-0 w-full p-3 bg-pwip-white-100">
                <Button
                  type="primary"
                  buttonType="submit"
                  label="Update changes"
                  disabled={
                    Object.keys(errors).length || isSubmitting ? true : false
                  }
                  onClick={() => {
                    const changes = getChangedPropertiesFromObject(
                      {
                        ...userObject.userData,
                        ...profileObject.profileData,
                      },
                      values
                    );
                    if (
                      !Object.keys(errors).length &&
                      Object.keys(changes).length
                    ) {
                      handleFormSubmit();
                    }
                  }}
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit);
