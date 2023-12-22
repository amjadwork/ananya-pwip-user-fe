import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Button } from "@/components/Button";
import { useOverlayContext } from "@/context/OverlayContext";

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

const ProfileDetailForm = ({
  token,
  fields,
  fieldHeading,
  professionOptions,
  userObject,
  profileObject,
}) => {
  const formik = useRef();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (profileObject && userObject && formik && formik.current) {
      const formikRef = formik.current;

      const updatedFormValues = {
        ...userObject.userData,
        ...profileObject.profileData,
      };
      formikRef.setValues(updatedFormValues);
      console.log(updatedFormValues, "Up");
    }
  }, [profileObject, userObject, formik]);

  console.log(formik, "formik");

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
    closeBottomSheet(true);
  };

  return (
    <React.Fragment>
      <Formik
        innerRef={formik}
        initialValues={{ ...initialValues }}
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
            <div className="w-full h-24 p-7 text-[#003559]font-sans font-bold text-xl text-left text-[#003559] bg-[url('/assets/images/bg-profile.png')]  bg-cover">
              {fieldHeading.heading}
            </div>
            <div className="mx-7">
              <div className="pb-7">
                {fields.map((field, index) => (
                  <div className="relative mb-2 mt-2">
                    <label
                      htmlFor={field.name}
                      className="w-full text-sm font-medium text-gray-900 mb-1">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <div>
                        <textarea
                          id={field.name}
                          name={field.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={600}
                          style={{
                            textAlign: "left",
                          }}
                          value={formik?.current?.values[field.name]}
                          className={`block w-full h-60 p-1 mt-4 text-sm text-gray-900 rounded-md border ${
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
                    ) : field.type === "select" ? (
                      <div>
                        <select
                          id={field.name}
                          name={field.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={formik?.current?.values[field.name]}
                          className={`block w-full h-9 p-1 text-sm text-gray-900 rounded-md border ${
                            errors[field.name] && touched[field.name]
                              ? "border-red-300"
                              : "border-[#006EB4]"
                          } appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}>
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {professionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors[field.name] ? (
                          <span
                            className="absolute text-red-400 text-xs"
                            style={{ top: "100%" }}>
                            {errors[field.name]}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formik?.current?.values[field.name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            textAlign: "left",
                          }}
                          className={`block w-full h-9 p-1 text-sm text-gray-900 rounded-md border ${
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
                    )}
                  </div>
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
};

export default ProfileDetailForm;
