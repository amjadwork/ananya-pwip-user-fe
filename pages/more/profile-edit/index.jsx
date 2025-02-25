/** @format */

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";

import withAuth from "@/hoc/withAuth";
import { useRouter } from "next/router";
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
  updateProfileRequest,
} from "@/redux/actions/profileEdit.actions";
import {
  // fetchUserFailure,
  fetchUserRequest,
  // updateUserFailure,
} from "@/redux/actions/userEdit.actions";
import { handleSettingAuthDataSuccess } from "@/redux/actions/auth.actions";

// Import Components
import { Header } from "@/components/Header";
import {
  contactFields,
  personalFields,
  companyFields,
  aboutFields,
  socialFields,
  professionField,
  socialFieldsHeading,
  aboutFieldsHeading,
  contactFieldsHeading,
  companyFieldsHeading,
  personalFieldsHeading,
  professionFieldHeading,
} from "constants/profileFormFields";
import axios from "axios";
import { apiBaseURL } from "@/utils/helper";
import PhoneVerificationWithOTP from "containers/PhoneVerificationWithOTP";

function ProfileEdit() {
  const profileObject = useSelector((state) => state.profile);
  const userObject = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (profileObject?.profileData && userObject?.userData) {
      const userPayload = {
        ...authUser,
        ...profileObject?.profileData,
        ...userObject?.userData,
      };
      dispatch(handleSettingAuthDataSuccess(userPayload, token));
    }
  }, [profileObject?.profileData, userObject?.userData]);

  const dispatch = useDispatch();
  const router = useRouter();

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

  const { openBottomSheet, closeBottomSheet, openToastMessage } =
    useOverlayContext();

  const handleBottomSheetForOTPVerification = (fields, fieldHeading, token) => {
    setIsBottomSheetOpen(true);
    const content = (
      <PhoneVerificationWithOTP
        token={token}
        fields={fields}
        fieldHeading={fieldHeading}
      />
    );
    if (router.route === "/more/profile-edit") {
      openBottomSheet(content, () => null, true);
    } else {
      openBottomSheet(content, () => null, true, true);
    }
  };

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

  const handleImagePickerChange = (e, fileName, ext) => {
    const file = e.target.files;

    axios
      .get(
        apiBaseURL +
          `api/generate-signed-url?fileName=${fileName}&extension=${ext}&mediaType=image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const uri = res.data.url;
          const publicURI = res.data.publicUrl;

          axios.put(`${uri}`, file[0]).then(() => {
            const payload = {
              profile_pic: publicURI,
            };
            dispatch(updateProfileRequest(payload));
          });
        }
      });
  };

  const handlePictureChange = (e) => {
    const extString = e.target.files[0].type;
    const extStringArr = extString.split("/");
    const ext = extStringArr[1];
    const name = `${Math.floor(Date.now() / 1000)}.${ext}`;

    handleImagePickerChange(e, name, ext);
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
    openBottomSheet(content, () => null, true);
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

        <title>Profile | PWIP</title>

        <meta name="PWIP Exports" content="PWIP Exports" />
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

      <div className="w-full h-auto bg-white">
        <Header />
        <div className="w-full bg-white flex flex-col">
          <div className="mt-12 h-56 pt-14 pl-4 bg-[url('/assets/images/bg-profile.png')] bg-cover">
            {/* The hidden file input */}
            <input
              type="file"
              onChange={(e) => {
                handlePictureChange(e);
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
            <div className="w-full h-[92px] p-3 mb-6 bg-[#F4FCFF] space-y-1">
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

              <div className="flex  text-[#003559] text-xs font-normal">
                <div className="font-medium leading-snug">
                  {profileObject?.profileData?.city ? (
                    profileObject.profileData.city
                  ) : (
                    <span>Add city</span>
                  )}
                </div>
                <div className="font-medium leading-snug">
                  {profileObject?.profileData?.state ? (
                    <span>, {profileObject.profileData.state}</span>
                  ) : (
                    <span>, Add state</span>
                  )}
                </div>
                <div className=" font-medium leading-snug">
                  {profileObject?.profileData?.country ? (
                    <span>, {profileObject.profileData.country}</span>
                  ) : (
                    <span>, India</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Section*/}
            <div className="w-full h-[92px] p-3 mb-6 bg-[#F4FCFF] space-y-1">
              <div className=" text-[#263238] text-base font-bold flex justify-between mb-2">
                Contact Details{" "}
                <button
                  onClick={() => {
                    handleBottomSheetForOTPVerification(
                      contactFields,
                      contactFieldsHeading.heading,
                      token
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
              <div className="mb-3.5 text-[#263238] font-sans text-base font-bold flex justify-between">
                I am a/an
                <button
                  onClick={() => {
                    handleFormFieldBottomSheet(
                      professionField,
                      professionFieldHeading
                    );
                  }}
                >
                  {pencilIcon}
                </button>
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
                              : "opacity-50"
                          }`}
                          style={{
                            boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                            backdropFilter: "blur(8px)",
                            filter:
                              isProfessionSelected && profession === items.value
                                ? "unset"
                                : "grayscale(100%)",
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

                <div className="ml-3 space-y-2">
                  <div className="text-gray-800 text-sm font-normal leading-tight mb-1.5">
                    {profileObject?.profileData?.companyName ? (
                      profileObject.profileData.companyName
                    ) : (
                      <div>Add Company Name</div>
                    )}
                  </div>
                  <div className="text-neutral-700 text-xs font-normal leading-tight mb-px">
                    {profileObject?.profileData?.address ? (
                      profileObject.profileData.address
                    ) : (
                      <div>Add Company Address</div>
                    )}
                  </div>
                  <div className="text-neutral-700 text-xs font-normal leading-tight">
                    {profileObject?.profileData?.gstin ? (
                      `GST: ${profileObject.profileData.gstin}`
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
