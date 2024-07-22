/** @format */

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Formik } from "formik";
import { Country, State, City } from "country-state-city";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Button } from "@/components/Button";
import { useOverlayContext } from "@/context/OverlayContext";
import { useRouter } from "next/router";
// import { contactPhoneCode } from "@/constants/countryPhoneCode";

import {
  updateProfileRequest,
  fetchProfileRequest,
} from "@/redux/actions/profileEdit.actions";
import {
  updateUserRequest,
  fetchUserRequest,
} from "@/redux/actions/userEdit.actions";
import {
  intersectObjects,
  getChangedPropertiesFromObject,
  processCountryData,
} from "@/utils/helper";

import PhoneVerificationWithOTP from "@/containers/PhoneVerificationWithOTP";

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
  country_code: 91,
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
  phone: Yup.string()
    .matches(/^[0-9]{5,20}$/, "Invalid mobile number")
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
  const selectPhoneCodeRef = React.useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] =
    useState("91");

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

  const { openBottomSheet, closeBottomSheet, openToastMessage } =
    useOverlayContext();

  const countries = Country.getAllCountries();

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

      setSelectedCountryPhoneCode(userObject?.userData?.country_code || "91");

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

  const handleVerifyOtpBottomSheet = (fields, fieldHeading, token) => {
    const content = (
      <PhoneVerificationWithOTP
        token={token}
        fields={fields}
        fieldHeading={fieldHeading}
      />
    );
    openBottomSheet(content, () => null, true, true);
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
        let otpPayload = {
          ...userPayload,
          country_code: selectedCountryPhoneCode,
        };

        if (!Object?.keys(userPayload)?.length) {
          otpPayload = {
            phone: userObject?.userData?.phone,
            country_code: selectedCountryPhoneCode,
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

      let requestAction = null;

      if (Object.keys(userPayload)?.length) {
        const payload = {
          ...userPayload,
          country_code: selectedCountryPhoneCode,
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

  const countryList = useMemo(
    () => processCountryData(Country.getAllCountries()),
    []
  );

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
                  <div className="relative mb-2 mt-2" key={index}>
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
                                    : ""
                                }`}
                                onClick={() =>
                                  handleProfessionSelect(item.value)
                                }
                              >
                                <img
                                  className="h-full w-full object-contain"
                                  src={item.image}
                                  alt={item.label}
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
                          <div className="inline-flex items-center w-full country-phone-picker">
                            {field?.name === "phone" ? (
                              <React.Fragment>
                                {/* <div
                                  className={`inline-flex items-center justify-center text-center h-[40px] min-w-[40px] max-w-[80px] text-sm rounded-l-md rounded-r-none border border-r-[#e3ebf0] ${
                                    errors[field.name] && touched[field.name]
                                      ? "border-red-300"
                                      : "border-[#006EB4]"
                                  }`}
                                  onClick={() => {
                                    const showDropdown = function (element) {
                                      var event;
                                      event =
                                        document.createEvent("MouseEvents");
                                      event.initMouseEvent(
                                        "mousedown",
                                        true,
                                        true,
                                        window
                                      );
                                      element.dispatchEvent(event);
                                    };

                                    var dropdown =
                                      document.getElementById("dropdown");
                                    showDropdown(dropdown);
                                  }}
                                >
                                  +{selectedCountryPhoneCode}
                                </div> */}
                                <select
                                  id="dropdown"
                                  value={selectedCountryPhoneCode}
                                  ref={selectPhoneCodeRef}
                                  className={`inline-flex items-center justify-center text-center h-[40px] min-w-[80px] max-w-[100px] w-auto text-sm rounded-l-md rounded-r-none border border-r-[#e3ebf0] ${
                                    errors[field.name] && touched[field.name]
                                      ? "border-red-300"
                                      : "border-[#006EB4]"
                                  }`}
                                  onChange={(e) => {
                                    setSelectedCountryPhoneCode(e.target.value);
                                    formik.current.setFieldValue(
                                      "country_code",
                                      e.target.value
                                    );
                                  }}
                                >
                                  {countryList?.map((country, index) => (
                                    <option
                                      key={country?.name + "_" + index}
                                      value={country?.phonecode}
                                      className="text-sm text-gray-500"
                                    >
                                      {country?.flag} {country?.name} (
                                      {country?.phonecode})
                                    </option>
                                  ))}
                                </select>
                              </React.Fragment>
                            ) : null}
                            <input
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={values[field.name]}
                              disabled={field.name === "email" || field.disable}
                              inputMode={
                                field?.name === "phone"
                                  ? "numeric"
                                  : field?.name === "email"
                                  ? "email"
                                  : "text"
                              }
                              onChange={(e) => {
                                handleChange(e);
                                if (field.name === "phone") {
                                  setPhoneTouched(true);
                                }
                              }}
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
                          {field.name === "phone" &&
                          phoneTouched &&
                          values[field.name] === userObject.userData.phone ? (
                            <div className="w-full text-left">
                              <span
                                className="absolute text-red-400 text-xs mt-1"
                                style={{ top: "100%" }}
                              >
                                Already verified! Add a different phone number.
                              </span>
                            </div>
                          ) : null}
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

              <div className="relative w-full bg-white mt-6">
                {values.phone !== userObject.userData.phone ? (
                  <div className="w-full text-left pb-1">
                    <span
                      className="text-gray-500 text-xs mt-1"
                      style={{ display: "block" }}
                    >
                      Verify your phone using OTP received on your{" "}
                      <span className="text-[#25D366]">WhatsApp</span>.
                    </span>
                  </div>
                ) : null}
                <Button
                  type="primary"
                  buttonType="submit"
                  label={isStandalone ? "Continue" : "Update changes"}
                  disabled={
                    values.phone === userObject.userData.phone ||
                    Object.keys(errors).length
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
                      Object.keys(changes).length &&
                      !overwriteHandleFormSubmit
                    ) {
                      handleVerifyOtpBottomSheet(
                        fields,
                        `Track rice market on the go! Enter phone for alerts.`,
                        token
                      );
                      // handleFormSubmit();
                      return;
                    }

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
