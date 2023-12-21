import React, { useState, useEffect, useRef } from "react";

import withAuth from "@/hoc/withAuth";
import { useSelector} from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import ProfileDetailForm from "@/components/ProfileDetailForm";
import {
  cameraIcon,
  pencilIcon,
  instagram,
  linkedin,
  whatsapp,
  youtube,
  facebookIcon,
  profileBg,
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
  contactFields,
  personalFields,
  companyFields,
  aboutFields,
  aboutFieldsHeading,
  contactFieldsHeading,
  companyFieldsHeading,
  personalFieldsHeading,
} from "constants/profileFormFields";

function ProfileEdit() {
  const profileObject = useSelector((state) => state.profile);
  const userObject = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);

  const [mainContainerHeight, setMainContainerHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isProfessionSelected, setIsProfessionSelected] = useState(false);
  const [profession, setProfession] = useState("");
  console.log(userObject, "user");
  console.log(profileObject, "profile");
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
    if (profileObject?.profileData?.profession) {
      setProfession(profileObject?.profileData?.profession);
      setIsProfessionSelected(true);
    }
  }, [profileObject]);

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
        <ProfileDetailForm
          token={token}
          fields={fields}
          fieldHeading={fieldHeading}
          userObject={userObject}
          profileObject={profileObject}
          openBottomSheet={openBottomSheet}
        />
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

  useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);
  console.log("profession", profession);
  return (
    <React.Fragment>
      <div className="w-full h-auto bg-white">
        <Header />
        <div className="w-full bg-white flex flex-col">
          <div className="mt-12 h-56 pt-14 pl-4 bg-[url('/assets/images/bg-profile.png')] bg-cover">
            <img
              className="w-[142px] h-[142px] rounded-full border-blue-950"
              src={
                userObject?.userData?.picture || "/assets/images/no-profile.png"
              }
            />
          </div>
          <div className="mx-2 mt-6">
            <div className="w-full h-[92px] p-2 mb-5 bg-[#F4FCFF]">
              <div className=" text-sky-950 text-lg font-bold flex justify-between">
                {userObject?.userData?.full_name}
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
                {profileObject?.profileData?.city},{" "}
                {profileObject?.profileData?.state},{" "}
                {profileObject?.profileData?.country}
              </div>
              <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
                {profileObject?.profileData?.headline}
              </div>
            </div>
            <div className="w-full h-[92px] p-2 mb-5 bg-[#F4FCFF]">
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
                {userObject?.userData?.email}
              </div>
              <div className="w-[231px] text-gray-800 text-sm font-normal leading-tight">
                {userObject?.userData?.phone}
              </div>
            </div>
            <div className="bg-white py-4 px-2">
              <div className="w-full  text-gray-800 text-base font-bold flex justify-between">
                <span>About</span>
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(aboutFields, aboutFieldsHeading);
                  }}>
                  {pencilIcon}
                </button>
              </div>
              <div className="w-full mt-2 text-sky-950 text-sm font-medium leading-snug">
                {profileObject?.profileData?.about}
                Amar Singh is a second-generation rice miller. He inherited his
                family's rice milling business, which has been operating for
                over 30 years. Amar Singh has been managing the rice mill for
                the past 20 years and has seen significant changes in the
                industry during this time.
              </div>
            </div>
            <h2 className="mt-4 mb-5 px-2 text-pwip-v2-primary font-sans text-base font-bold">
              I am a/an
            </h2>
            <div className="flex overflow-x-scroll hide-scroll-bar px-2">
              <div className="flex flex-between">
                {professionOptions.map((items, index) => {
                  const profession = profileObject?.profileData?.profession;
                  return (
                    <div>
                      <div
                        key={items.label + (index + 1 * 2)}
                        className={`w-[116px] h-[116px] inline-block bg-[#C9EEFF] rounded-lg mr-4 ${
                          isProfessionSelected && profession === items.value
                            ? "opacity-100"
                            : "opacity-25"
                        }`}
                        style={{
                          boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                          backdropFilter: "blur(8px)",
                        }}>
                        <img
                          className="h-full w-full object-contain"
                          src={items.image}
                        />
                        <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                          <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]"></div>
                        </div>
                      </div>
                      <div
                        className={`mt-1 text-center text-sm font-semibold ${
                          isProfessionSelected && profession === items.value
                            ? "text-pwip-v2-primary"
                            : "text-gray-400"
                        }`}>
                        {items?.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full h-[92px] p-2 my-5 bg-white">
              <div className=" text-sky-950 text-lg font-bold flex justify-between">
                Company Details
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
                {profileObject?.profileData?.companyName}
              </div>
              <div className=" text-neutral-700 text-xs font-normal leading-tight">
                {profileObject?.profileData?.companyAddress}
              </div>
              <div className=" text-neutral-700 text-xs font-normal leading-tight">
                GST: {profileObject?.profileData?.gstin}
              </div>
            </div>
            <div className="w-full h-[150px] p-2 bg-[url('/assets/images/bg-profile.png')] bg-cover bg-opacity-40">
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
      </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit);
