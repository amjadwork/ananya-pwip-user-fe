import React, { useState, useEffect, useRef } from "react";

import withAuth from "@/hoc/withAuth";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import ProfileDetailForm from "@/components/ProfileDetailForm";
import {
  cameraIcon,
  building,
  pencilIcon,
  instagram,
  linkedin,
  whatsapp,
  youtube,
  facebookIcon,
  websiteIcon,
} from "../../../theme/icon";
import { professionOptions } from "@/constants/professionOptions";
import {
  // fetchProfileFailure,
  fetchProfileRequest,
  // updateProfileFailure,
} from "@/redux/actions/profileEdit.actions";
import {
  // fetchUserFailure,
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
  socialFields,
  socialFieldsHeading,
  aboutFieldsHeading,
  contactFieldsHeading,
  companyFieldsHeading,
  personalFieldsHeading,
} from "constants/profileFormFields";

function ProfileEdit() {
  const profileObject = useSelector((state) => state.profile);
  const userObject = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [mainContainerHeight, setMainContainerHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isProfessionSelected, setIsProfessionSelected] = useState(false);
  const [profession, setProfession] = useState("");

  const professionList = [...professionOptions];
  const socialMediaIcons = [
    { key: "website", icon: websiteIcon },
    { key: "facebook_url", icon: facebookIcon },
    { key: "whatsapp_link", icon: whatsapp },
    { key: "instagram_url", icon: instagram },
    { key: "linkedin_url", icon: linkedin },
    { key: "youtube_url", icon: youtube },
  ];

  const { openBottomSheet, openToastMessage } = useOverlayContext();

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
      dispatch(fetchUserRequest());
    }
  }, [token]);

  useEffect(() => {
    if (profileObject?.profileData?.profession) {
      setProfession(profileObject?.profileData?.profession);
      setIsProfessionSelected(true);
    }
  }, [profileObject]);

  const handlePictureChange = () => {
    // console.log("clicked");
  };

  const handleFormFieldBottomSheet = (fields, fieldHeading) => {
    setIsBottomSheetOpen(true);
    const content = (
      <React.Fragment>
        <ProfileDetailForm
          token={token}
          fields={fields}
          fieldHeading={fieldHeading}
          professionOptions={professionOptions}
          userObject={userObject}
          profileObject={profileObject}
        />
      </React.Fragment>
    );
    openBottomSheet(content);
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
          <div className="mt-12 h-56 pt-14 pl-4 bg-[url('/assets/images/bg-profile.png')] bg-cover">
            {/* The hidden file input */}
            <input
              type="file"
              onChange={() => {
                handlePictureChange();
              }}
              id="fileInput"
              className="hidden"
            />
            <div
              className="absolute flex justify-center hover:cursor-pointer"
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            >
              {cameraIcon}
            </div>
            <img
              className="w-[142px] h-[142px] rounded-full object-cover border-blue-800"
              src={
                profileObject?.profileData?.profile_pic ||
                "/assets/images/no-profile.png"
              }
            />
          </div>

          <div className="mx-2 mt-6">
            {/* Personal Details Section*/}
            <div className="w-full h-[92px] p-3 mb-6 bg-[#F4FCFF]">
              <div className="text-[#003559] text-lg font-bold flex justify-between mb-2">
                {userObject?.userData?.full_name}
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(
                      personalFields,
                      personalFieldsHeading
                    );
                  }}
                >
                  {pencilIcon}
                </button>
              </div>
              <div className="text-[#263238] text-sm font-normal leading-tight">
                {profileObject?.profileData?.headline ? (
                  profileObject.profileData.headline
                ) : (
                  <div>Add Headline</div>
                )}
              </div>
              <div className=" text-[#3B4241] text-xs font-normal leading-tight">
                {profileObject?.profileData?.city},{""}
                {profileObject?.profileData?.state},{""}
                {profileObject?.profileData?.country}
              </div>
            </div>
            {/* Contact Details Section*/}
            <div className="w-full h-[92px] p-3 mb-6 bg-[#F4FCFF]">
              <div className=" text-[#263238] text-base font-bold flex justify-between mb-2">
                Contact Details{" "}
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(
                      contactFields,
                      contactFieldsHeading
                    );
                  }}
                >
                  {pencilIcon}
                </button>
              </div>
              <div className=" text-[#3B4241] text-xs font-normal leading-tight">
                {userObject?.userData?.email}
              </div>
              <div className="text-[#3B4241] text-xs font-normal leading-tight">
                {userObject?.userData?.phone ? (
                  userObject.userData.phone
                ) : (
                  <div>Add Phone Number</div>
                )}
              </div>
            </div>
            {/* About Section*/}
            <div className="bg-white p-3 mb-6">
              <div
                className="w-full  text-[#263238]
              text-base font-bold flex justify-between mb-2"
              >
                <span>About</span>
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(aboutFields, aboutFieldsHeading);
                  }}
                >
                  {pencilIcon}
                </button>
              </div>
              <div
                className="w-full text-[#003559]
              text-sm font-medium leading-snug"
              >
                {profileObject?.profileData?.bio ? (
                  profileObject.profileData.bio
                ) : (
                  <span>Tell us more about yourself.</span>
                )}
              </div>
            </div>

            {/* Profession Details Section*/}
            <div className="px-3 mb-6">
              <div className="mb-3.5 text-[#263238] font-sans text-base font-bold">
                I am a/an
              </div>
              <div className="flex overflow-x-scroll hide-scroll-bar">
                <div className="flex flex-between">
                  {professionOptions
                    .sort((a, b) => {
                      const profession = profileObject?.profileData?.profession;
                      if (profession === a.value) return -1;
                      if (profession === b.value) return 1;
                      return 0;
                    })
                    .map((items, index) => (
                      <div key={items.label + (index + 1 * 2)}>
                        <div
                          className={`w-[116px] h-[116px] inline-block bg-[#C9EEFF] rounded-lg mr-5 ${
                            isProfessionSelected && profession === items.value
                              ? "opacity-100"
                              : "opacity-25"
                          }`}
                          style={{
                            boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <img
                            className="h-full w-full object-contain"
                            src={items.image}
                          />
                          <div className="overflow-hidden h-auto flex-col">
                            <div
                              className={`mt-2 text-center text-black text-xs font-semibold ${
                                isProfessionSelected &&
                                profession === items.value
                                  ? "text-pwip-v2-primary"
                                  : "text-gray-400"
                              }`}
                            >
                              {items?.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Company Details Section*/}
            <div className="w-full h-[100px] p-3 mb-6 bg-white">
              <div className=" text-[#263238] text-base font-bold flex justify-between mb-2">
                Company Details
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(
                      companyFields,
                      companyFieldsHeading
                    );
                  }}
                >
                  {pencilIcon}
                </button>
              </div>
              <div className="flex">
                <div className="text-gray-800 text-sm font-normal leading-tight mb-2">
                  {building}
                </div>

                <div className="ml-3">
                  <div className="text-gray-800 text-sm font-normal leading-tight mb-1.5">
                    {profileObject?.profileData?.companyName ? (
                      profileObject.profileData.companyName
                    ) : (
                      <div>Add Company Name</div>
                    )}
                  </div>
                  <div className="text-neutral-700 text-xs font-normal leading-tight mb-px">
                    {profileObject?.profileData?.companyAddress ? (
                      profileObject.profileData.companyAddress
                    ) : (
                      <div>Add Company Address</div>
                    )}
                  </div>
                  <div className="text-neutral-700 text-xs font-normal leading-tight">
                    {profileObject?.profileData?.gstin ? (
                      profileObject.profileData.gstin
                    ) : (
                      <div>Add GST Number</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[150px] p-2 bg-[url('/assets/images/bg-profile.png')] bg-cover bg-opacity-40">
              <div className=" text-sky-950 text-lg font-bold mb-7 flex justify-between">
                Find me on
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(
                      socialFields,
                      socialFieldsHeading
                    );
                  }}
                >
                  {pencilIcon}
                </button>
              </div>

              <div className="w-full flex flex-row justify-between">
                {socialMediaIcons.map((iconItem, index) => {
                  return (
                    <div
                      key={iconItem.key + "_" + index}
                      className="w-[46px] h-[46px] bg-orange-50 rounded-lg p-3"
                      style={{
                        opacity:
                          profileObject?.profileData &&
                          profileObject.profileData[iconItem?.key]
                            ? 1
                            : 0.65,
                        filter:
                          profileObject?.profileData &&
                          profileObject.profileData[iconItem?.key]
                            ? "unset"
                            : `grayscale(90%)`,
                      }}
                      onClick={() => {
                        const socialFieldsWithLinks = socialFields.map(
                          (field) => {
                            if (profileObject?.profileData[field?.name]) {
                              return {
                                ...field,
                                uri:
                                  field?.name === "whatsapp_link"
                                    ? "https://api.whatsapp.com/send?phone=" +
                                      profileObject?.profileData[field?.name] //https://api.whatsapp.com/send?phone=91******
                                    : profileObject?.profileData[field?.name],
                              };
                            }

                            return {
                              ...field,
                            };
                          }
                        );

                        if (
                          socialFieldsWithLinks.find(
                            (link) => iconItem.key === link.name
                          )?.uri
                        ) {
                          window.open(
                            socialFieldsWithLinks.find(
                              (link) => iconItem.key === link.name
                            )?.uri,
                            "_blank"
                          );
                        } else {
                          openToastMessage({
                            type: "info",
                            message:
                              "No account has been set for " +
                              socialFieldsWithLinks
                                ?.find((link) => iconItem.key === link.name)
                                ?.label.toLowerCase(),
                          });
                        }
                      }}
                    >
                      {iconItem.icon}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(ProfileEdit);
