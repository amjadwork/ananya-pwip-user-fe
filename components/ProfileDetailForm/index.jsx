import React from "react";
import { Formik } from "formik";
import { Button} from "@/components/Button";

const ProfileDetailForm = ({
  initialValues,
  profileValidationSchema,
  fields,
  fieldHeading,
  userObject,
  profileObject,
  handleFormSubmit,
  openBottomSheet,
}) => {
  const formik = React.useRef(null);
 console.log(fieldHeading, "hello")
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
                  <div className="relative">
                    {field.type === "textarea" ? (
                      <div className="mb-2 mt-2">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-gray-900">
                          {field.label}
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={600}
                          style={{
                            textAlign: "left",
                          }}
                          className={`block w-full h-24 p-1 text-sm text-gray-900 rounded-md border ${
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
                    ) : (
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
