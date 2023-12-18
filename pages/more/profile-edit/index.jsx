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
                onClick={() => handleProfessionSelect(item.value)}>
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
      <div className="w-full h-auto bg-white p-2">
        <div className="w-full bg-yellow-200 flex flex-col">
          <div className="w-full h-[92px] p-2 mt-80 mb-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold">Anurag Mishra</div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              Bengaluru, Karnataka, India
            </div>
            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
              Managing Director, Mishra Exports
            </div>
          </div>
          <div className="w-full h-[92px] p-2 mb-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold">
              Contact Details
            </div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              mishra.anurag110@gmail.com
            </div>
            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
              6371569477
            </div>
          </div>
          <div className="bg-red-200 py-4 px-5">
            <div className="w-[69px]  text-gray-800 text-base font-bold">
              About
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
          <div className="w-full h-[92px] p-2 mb-5 bg-slate-100">
            <div className=" text-sky-950 text-lg font-bold">Company</div>
            
            <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
            Mishra Mills & Exports
            </div>
            <div className=" text-neutral-700 text-xs font-normal leading-tight">
              Bangalore, Karnataka
            </div>
          </div>

          {/* <div className="w-[378px] h-[92px] left-[8px] top-[440px] absolute bg-red-400">
          <div className="w-[378px] h-[92px] left-0 top-0 absolute bg-sky-50" />
          <div className="w-[353px] h-[73px] left-[13px] top-[9px] absolute">
            <div className="w-[194px] left-0 top-[33px] absolute text-neutral-700 text-xs font-normal font-['Inter'] leading-tight">
              mishra.anurag110@gmail.com
            </div>
            <div className="w-[73px] left-0 top-[53px] absolute text-neutral-700 text-xs font-normal font-['Inter'] leading-tight">
              6371569477
            </div>
            <div className="w-[122px] left-0 top-[5px] absolute text-gray-800 text-base font-bold font-['Inter']">
              Contact Details
            </div>
            <div className="w-4 h-4 left-[337px] top-0 absolute" />
          </div>
        </div>
        <div className="w-[390px] h-[197px] left-0 top-[555px] absolute">
          <div className="w-[390px] h-[197px] left-0 top-0 absolute bg-white" />
          <div className="w-[69px] left-[23px] top-[17px] absolute text-gray-800 text-base font-bold font-['Inter']">
            About
          </div>
          <div className="w-[344px] left-[23px] top-[44px] absolute text-sky-950 text-sm font-medium font-['Inter'] leading-snug">
            Amar Singh is a second-generation rice miller. He inherited his
            family's rice milling business, which has been operating for over 30
            years. Amar Singh has been managing the rice mill for the past 20
            years and has seen significant changes in the industry during this
            time.
          </div>
          <div className="w-4 h-4 left-[358px] top-[16px] absolute" />
        </div>
        <div className="w-[376px] h-[171px] left-[23px] top-[776px] absolute">
          <div className="w-[133px] left-[2px] top-0 absolute text-gray-800 text-base font-bold font-['Inter']">
            I am a/an
          </div>
          <img
            className="w-[116px] h-[116px] left-0 top-[33px] absolute rounded-lg"
            src="https://via.placeholder.com/116x116"
          />
          <div className="w-[71px] left-[23px] top-[156px] absolute text-center text-black text-xs font-semibold font-['Inter']">
            Exporter
          </div>
          <div className="w-[71px] left-[167px] top-[156px] absolute opacity-50 text-center text-black text-xs font-semibold font-['Inter']">
            Importer
          </div>
          <div className="w-[71px] left-[305px] top-[156px] absolute opacity-50 text-center text-black text-xs font-semibold font-['Inter']">
            Miller
          </div>
        </div>
        <div className="w-[116px] h-[116px] left-[161px] top-[808px] absolute bg-sky-50 rounded-lg" />
        <img
          className="w-[116px] h-[116px] left-[161px] top-[808px] absolute opacity-20 rounded-lg"
          src="https://via.placeholder.com/116x116"
        />
        <div className="w-[116px] h-[116px] left-[300px] top-[808px] absolute bg-sky-50 rounded-lg" />
        <img
          className="w-[116px] h-[116px] left-[300px] top-[808px] absolute opacity-20 rounded-lg"
          src="https://via.placeholder.com/116x116"
        />
        <div className="w-[390.44px] h-[226.62px] left-[-0.44px] top-[1101.19px] absolute">
          <div className="w-[195.65px] h-[226.62px] left-0 top-0 absolute" />
          <div className="w-[195.65px] h-[226.62px] left-[194.79px] top-0 absolute" />
        </div>
        <div className="w-[390.44px] h-[226.62px] left-[-0.44px] top-[66.19px] absolute">
          <div className="w-[195.65px] h-[226.62px] left-0 top-0 absolute" />
          <div className="w-[195.65px] h-[226.62px] left-[194.79px] top-0 absolute" />
        </div>
        <div className="w-[142px] h-[156px] left-[21px] top-[121px] absolute">
          <img
            className="w-[142px] h-[142px] left-0 top-[4px] absolute rounded-full border-blue-950"
            src="https://via.placeholder.com/142x142"
          />
          <div className="w-[142px] h-[142px] left-0 top-[4px] absolute rounded-full border-4 border-black border-opacity-30" />
          <div className="w-[31px] h-[31px] left-[55px] top-[125px] absolute bg-amber-500 rounded-full" />
          <div className="w-4 h-[17px] left-[63px] top-[134px] absolute text-white text-xs font-bold font-['Inter']">
            50
          </div>
          <div className="w-[13px] h-[13px] left-[59px] top-0 absolute bg-teal-400 rounded-full" />
        </div>
        <div className="w-[60px] h-[17px] left-[11px] top-[17px] absolute">
          <div className="w-[33px] left-[27px] top-0 absolute text-black text-sm font-normal font-['Inter']">
            Back
          </div>
          <div className="w-[17px] h-[17px] left-[17px] top-0 absolute origin-top-left rotate-180" />
        </div>
        <div className="w-[353px] h-[113px] left-[21px] top-[971px] absolute">
          <div className="w-[133px] left-0 top-0 absolute text-gray-800 text-base font-bold font-['Inter']">
            Company
          </div>
          <div className="w-8 h-8 left-0 top-[47px] absolute">
            <div className="w-8 h-8 left-0 top-0 absolute bg-gray-200 rounded border border-zinc-100" />
            <img
              className="w-8 h-8 left-0 top-0 absolute rounded border border-zinc-100"
              src="https://via.placeholder.com/32x32"
            />
          </div>
          <div className="w-[156px] left-[44px] top-[47px] absolute text-neutral-700 text-sm font-semibold font-['Inter'] leading-tight">
            Mishra Mills & Exports
          </div>
          <div className="w-[194px] left-[44px] top-[72px] absolute text-neutral-700 text-xs font-normal font-['Inter'] leading-tight">
            Raichur, Karnataka, India
          </div>
          <div className="w-[194px] left-[44px] top-[93px] absolute text-neutral-700 text-xs font-normal font-['Inter'] leading-tight">
            GST: 10AABCU9603R1Z2
          </div>
          <div className="w-4 h-4 left-[337px] top-[3px] absolute" />
        </div>
        <div className="w-[346px] h-[94px] left-[23px] top-[1108px] absolute">*/}
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit);
