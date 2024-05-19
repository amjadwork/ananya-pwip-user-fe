import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import { Country, State, City } from "country-state-city";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Button } from "@/components/Button";
import { useOverlayContext } from "@/context/OverlayContext";
import { useRouter } from "next/router";

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
  address: "",
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
  address: "",
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
  // full_name: Yup.string().required("Please enter your full name"),
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
  isStandalone,
  overwriteHandleFormSubmit,
  phoneForOTP,
}) => {
  const formik = useRef();
  const dispatch = useDispatch();
  const router = useRouter();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
      dispatch(fetchUserRequest());
    }
  }, [token]);

  useEffect(() => {
    if (phoneForOTP && formik?.current) {
      formik.current.setFieldValue("phone", phoneForOTP);
    }
  }, [phoneForOTP, formik?.current]);

  const { closeBottomSheet, openToastMessage } = useOverlayContext();

  // Get countries list from 'country-state-city' library
  const countries = Country.getAllCountries();

  // const handleCountryChange = (value) => {
  //   formik.current.setValues({
  //     ...formik.current.values,
  //     country: value,
  //     state: "",
  //     city: "",
  //   });
  // };

  // const handleStateChange = (value) => {
  //   formik.current.setValues({
  //     ...formik.current.values,
  //     state: value,
  //     city: "",
  //   });
  // };

  useEffect(() => {
    if (
      profileObject &&
      userObject &&
      formik &&
      formik.current &&
      !states.length
    ) {
      const formikRef = formik.current;

      let updatedFormValues = {
        ...userObject.userData,
        phone: userObject.userData.phone || "",
        ...profileObject.profileData,
      };

      const statesList = State.getStatesOfCountry("IN");
      setStates([...statesList]);

      if (updatedFormValues?.state) {
        const stateISOCode = statesList.find(
          (s) =>
            s.name.toLowerCase() === updatedFormValues?.state?.toLowerCase()
        )?.isoCode;

        const citiesList = City.getCitiesOfState("IN", stateISOCode);

        setCities(citiesList);
      }

      formikRef.setValues(updatedFormValues);
    }
  }, [profileObject, userObject, formik]);

  const handleProfessionSelect = (value) => {
    formik.current.setValues({
      ...formik.current.values,
      profession: value,
    });
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
      const userPayload = getChangedPropertiesFromObject(
        userObject.userData,
        userFormValues
      );

      if (overwriteHandleFormSubmit) {
        let otpPayload = { ...userPayload };

        if (!Object?.keys(userPayload)?.length) {
          otpPayload = {
            phone: userObject?.userData?.phone,
          };
        }

        overwriteHandleFormSubmit(otpPayload);
        return;
      }

      const profileFormValues = intersectObjects(
        requiredProfilePayload,
        formValues.data
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
        if (isStandalone) {
          router.push("/export-costing");
        }
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
        }}
      >
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
            }}
          >
            <div className="w-full h-full p-7 text-[#003559]font-sans font-bold text-xl text-left text-[#003559] bg-[url('/assets/images/bg-profile.png')]  bg-cover">
              {fieldHeading.heading}
            </div>
            <div className="mx-7 py-4 h-full">
              <div className="pb-7 h-full">
                {fields.map((field, index) => (
                  <div className="relative mb-2 mt-2">
                    <label
                      htmlFor={field.name}
                      className="w-full text-sm font-medium text-gray-900"
                    >
                      {field.label}
                    </label>
                    <div className="mt-1">
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
                            className={`block w-full h-60 p-1 px-3 mt-4 text-sm text-gray-900 rounded-md border ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-300"
                                : "border-[#006EB4]"
                            } appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                            placeholder={field.placeholder}
                          />
                          {errors[field.name] ? (
                            <span
                              className="absolute text-red-400 text-xs"
                              style={{ top: "100%" }}
                            >
                              {errors[field.name]}
                            </span>
                          ) : null}
                        </div>
                      ) : field.type === "grid" ? (
                        <div>
                          <div className="grid grid-cols-2 gap-1 mt-4">
                            {professionOptions.map((item, index) => (
                              <div
                                key={item.value + index}
                                className={`w-[110px] h-[110px] mb-8 ml-6 bg-[#C9EEFF] rounded-md text-center  opacity-100 transition-all ${
                                  formik?.current?.values[field.name] ===
                                  item.value
                                    ? "opacity-100 border border-[#006EB4]"
                                    : "opacity-[0.45] grayscale-[50%]"
                                }`}
                                onClick={() =>
                                  handleProfessionSelect(item.value)
                                }
                              >
                                <img
                                  className="h-full w-full object-contain"
                                  src={item.image}
                                />
                                <h4>{item.label}</h4>
                              </div>
                            ))}
                          </div>

                          {errors[field.name] ? (
                            <span
                              className="absolute text-red-400 text-xs"
                              style={{ top: "100%" }}
                            >
                              {errors[field.name]}
                            </span>
                          ) : null}
                        </div>
                      ) : field.type === "select" ? (
                        <div>
                          <select
                            id={field.name}
                            name={field.name}
                            onChange={(e) => {
                              handleChange(e);

                              if (field.name === "state") {
                                const stateISOCode = states.find(
                                  (s) => s.name === e.target.value
                                )?.isoCode;

                                const citiesList = City.getCitiesOfState(
                                  "IN",
                                  stateISOCode
                                );

                                setCities(citiesList);
                              }
                            }}
                            onBlur={handleBlur}
                            disabled={field.name === "country" ? true : false}
                            value={formik?.current?.values[field.name]}
                            className={`block w-full h-10 p-1 px-3 text-sm text-gray-900 rounded-md border ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-300"
                                : "border-[#006EB4]"
                            } appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                          >
                            <option value="" label={`Select ${field.label}`} />

                            {field.name === "country" &&
                              countries.map((country) => (
                                <option
                                  key={country.isoCode}
                                  value={country.name}
                                >
                                  {country.name}
                                </option>
                              ))}
                            {field.name === "state" &&
                              states.map((state) => (
                                <option key={state.isoCode} value={state.name}>
                                  {state.name}
                                </option>
                              ))}
                            {field.name === "city" &&
                              cities.map((city) => (
                                <option key={city.isoCode} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                          </select>
                          {errors[field.name] ? (
                            <span
                              className="absolute text-red-400 text-xs"
                              style={{ top: "100%" }}
                            >
                              {errors[field.name]}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <div className="inline-flex items-center w-full">
                            {field?.name === "phone" ? (
                              <div
                                className={`inline-flex items-center justify-center text-center h-[40px] min-w-[40px] text-sm rounded-l-md border border-r-[#e3ebf0] ${
                                  errors[field.name] && touched[field.name]
                                    ? "border-red-300"
                                    : "border-[#006EB4]"
                                }`}
                              >
                                +91
                              </div>
                            ) : null}
                            <input
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={values[field.name]}
                              disabled={field.name === "email" || field.disable}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{
                                textAlign: "left",
                              }}
                              className={`block w-full h-10 p-1 px-3 text-sm text-gray-900 border ${
                                field?.name === "phone"
                                  ? "rounded-r-md border-l-[#e3ebf0]"
                                  : "rounded-md"
                              }  ${
                                errors[field.name] && touched[field.name]
                                  ? "border-red-300"
                                  : "border-[#006EB4]"
                              } appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                              placeholder={field.placeholder}
                            />
                          </div>
                          {errors[field.name] ? (
                            <div className="w-full text-left">
                              <span
                                className="absolute text-red-400 text-xs mt-1"
                                style={{ top: "100%" }}
                              >
                                {errors[field.name]}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative w-full bg-white mt-8">
                <div className="w-full mb-4">
                  <p className="text-left text-xs text-gray-500">
                    Verify your phone using OTP recieved on your{" "}
                    <span className="text-[#25D366]">WhatsApp</span>.
                    {/* {" "}
                    <span className="font-medium text-pwip-v2-primary-700">
                      {values?.phone?.toString()?.length === 10
                        ? `+91 ${values?.phone}`
                        : ``}
                    </span> */}
                  </p>
                </div>
                <Button
                  type="primary"
                  buttonType="submit"
                  label={isStandalone ? "Continue" : "Update changes"}
                  // disabled={
                  //   Object.keys(errors).length || isSubmitting ? false : true
                  // }
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
                      Object.keys(changes).length &&
                      !overwriteHandleFormSubmit
                    ) {
                      handleFormSubmit();
                      return;
                    }

                    // for otp screen
                    if (
                      !Object.keys(errors).length &&
                      overwriteHandleFormSubmit
                    ) {
                      handleFormSubmit();
                      return;
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
