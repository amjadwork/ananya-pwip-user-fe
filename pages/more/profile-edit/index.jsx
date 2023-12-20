import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/Button";
import withAuth from "@/hoc/withAuth";
import { useOverlayContext } from "@/context/OverlayContext";
import {
  cameraIcon,
  pencilIcon,
  instagram,
  linkedin,
  facebook,
  whatsapp,
  youtube,
  facebookIcon,
  googleIcon,
} from "../../../theme/icon";
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
import {
  contactFields,
  personalFields,
  companyFields,
  contactFieldsHeading,
  companyFieldsHeading,
  personalFieldsHeading,
} from "constants/profileFormFields";

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const professionList = [...professionOptions];
  const socialMediaIcons = [
    facebookIcon,
    facebookIcon,
    whatsapp,
    instagram,
    linkedin,
    youtube,
  ];
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

  const handleFormFieldBottomSheet = (fields, fieldHeading) => {
    setIsBottomSheetOpen(true);
    const content = (
      <React.Fragment>
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
          }}>
          {({
            values,
            errors,
            dirty,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}>
              <div className="w-full h-24 p-4 text-[#003559]font-sans font-bold text-base text-left bg-[url('/assets/images/bg-profile.png')]  bg-cover">
                {fieldHeading.heading}
              </div>
              <div className="mx-7">
                <div className="pb-7">
                  {fields.map((field, index) => (
                    <div className="relative">
                      {
                        <div className="mb-2 mt-2  overflow-x-auto">
                          <label
                            htmlFor={field.name}
                            className="block mb-2 text-sm font-medium text-gray-900">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{
                              textAlign: "left",
                            }}
                            className={`block w-full h-9 p-1  \text-sm text-gray-900 rounded-md border ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-300"
                                : "border-[#006EB4]"
                            } appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                            placeholder={field.placeholder}
                          />
                          {errors[field.name] ? (
                            <span
                              className="absolute text-red-400 text-xs"
                              style={{ top: "100%" }}>
                              {errors[field.name]}
                            </span>
                          ) : null}
                        </div>
                      }
                    </div>
                    // <div>spectate</div>
                  ))}
                </div>

                <div className=" bottom-0  w-full bg-white">
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
              </div>
            </form>
          )}
        </Formik>
      </React.Fragment>
    );
    openBottomSheet(content);
  };

  // const handleProfessionSelect = (value) => {
  //   formik.current.setValues({
  //     ...formik.current.values,
  //     profession: value,
  //   });
  //   closeBottomSheet();
  // };

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
      <div className="w-full h-auto bg-white">
        <Header />
        <div className="w-full bg-white flex flex-col">
          <div className="mt-12 h-48 pt-6 pl-4 bg-[url('/assets/images/bg-profile.png')] bg-cover">
            <img
              className="w-[142px] h-[142px] rounded-full border-blue-950"
              src="https://via.placeholder.com/142x142"
            />
          </div>
          <div className="w-full h-[92px] p-2 mb-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold flex justify-between">
              Anurag Mishra{" "}
              <button
                onClick={() => {
                  handleFormFieldBottomSheet(
                    personalFields,
                    personalFieldsHeading
                  );
                }}>
                {pencilIcon}
              </button>
            </div>

            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              Bengaluru, Karnataka, India
            </div>
            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
              Managing Director, Mishra Exports
            </div>
          </div>
          <div className="w-full h-[92px] p-2 mb-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold flex justify-between">
              Contact Details{" "}
              <button
                onClick={() => {
                  handleFormFieldBottomSheet(
                    contactFields,
                    contactFieldsHeading
                  );
                }}>
                {pencilIcon}
              </button>
            </div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              mishra.anurag110@gmail.com
            </div>
            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
              6371569477
            </div>
          </div>
          <div className="bg-red-200 py-4 px-5">
            <div className="w-[69px]  text-gray-800 text-base font-bold flex justify-between">
              About
              <button
                onClick={() => {
                  handlePersonalDetail();
                }}>
                {pencilIcon}
              </button>
            </div>
            <div className="w-full mt-2 text-sky-950 text-sm font-medium leading-snug">
              Amar Singh is a second-generation rice miller. He inherited his
              family's rice milling business, which has been operating for over
              30 years. Amar Singh has been managing the rice mill for the past
              20 years and has seen significant changes in the industry during
              this time.
            </div>
          </div>
          <h2 className="mt-4 mb-5 text-pwip-v2-primary font-sans text-base font-bold">
            I am a/an
          </h2>
          <div className="flex overflow-x-scroll hide-scroll-bar">
            <div className="flex flex-nowrap">
              {professionOptions.map((items, index) => {
                return (
                  <div
                    key={items.label + (index + 1 * 2)}
                    className="w-[116px] h-[116px] inline-block px-[15px] py-[18px] bg-blue-100 rounded-lg mr-4"
                    style={{
                      boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}>
                    <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                      <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]">
                        <span className="line-clamp-1">{items?.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full h-[92px] p-2 my-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold flex justify-between">
              Company
              <button
                onClick={() => {
                  handleFormFieldBottomSheet(
                    companyFields,
                    companyFieldsHeading
                  );
                }}>
                {pencilIcon}
              </button>
            </div>

            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
              Mishra Mills & Exports
            </div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              Bangalore, Karnataka
            </div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              GST: 83728934823468934
            </div>
          </div>
          <div className="w-full h-[150px] p-2 mt-5 mb-10 bg-[url('/assets/images/bg-profile.png')] bg-cover">
            <div className=" text-sky-950 text-lg font-bold mb-7">
              Find me on
            </div>

            <div className="w-full flex flex-row justify-between">
              {socialMediaIcons.map((icon, index) => (
                <div
                  key={index}
                  className="w-[46px] h-[46px] bg-orange-50 rounded-lg p-3">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit);
