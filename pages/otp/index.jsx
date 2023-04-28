import React, {useState,useRef} from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { verifyIcon, backIcon} from "theme/icon";

export default function OTP() {
  const router = useRouter();

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);


  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const otpValues = [...otp];
    otpValues[index] = value;
    setOtp(otpValues);

    // Move focus to the next input field
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Move focus back to the previous input field if current input value is empty
    if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>One Time Password</title>
        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen ">
        <div className={`w-full h-2/6 loginbg bg-cover`}>
         <div className="pt-10 pl-7" onClick={() => router.push("login")}>{backIcon}</div>
          <div className="text-white pt-20 pl-7 font-sans font-bold text-4xl">Hey, you're almost there!</div>
        </div>
        <div className="h-4/6 bg-[#ffffff] w-full  inline-flex flex-col space-y-8 relative mt-10 px-8">

        <div className="pt-2 flex justify-center">
            <div className="">{verifyIcon}</div>
           </div>

           <div className=" mt-0 flex-col  text-slate-500">
            <div className="flex justify-center">Just enter the OTP sent to</div>
            <div className="flex justify-center">johndoe@gmail.com</div>
           </div>

        <div id="otp" class="flex flex-row justify-center text-center px-2 mt-5">
           {otp.map((value, index) => (
            <input class="m-1 border border-gray-400  h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="number" id="first" maxlength="1" required  key={index}
            onChange={(event) => handleInputChange(event, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}/> 

            // <input class="m-1 border border-gray-400 h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="text" inputmode="numeric" id="second" maxlength="1"  required/> 
            // <input class="m-1 border border-gray-400 h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="text" inputmode="numeric" id="third" maxlength="1" required/> 
            // <input class="m-1 border border-gray-400 h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="text" inputmode="numeric" id="fourth" maxlength="1" required/>
            // <input class="m-1 border border-gray-400 h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="text" inputmode="numeric" id="fifth" maxlength="1" required/> 
            // <input class="m-1 border border-gray-400 h-12 w-10 text-center form-control rounded focus:outline-1 focus:outline-blue-500" type="text" inputmode="numeric" id="sixth" maxlength="1" required/>
            ))}
            </div>
            <button
              onClick={() => router.push("export-costing")}
              className="w-full rounded py-3 px-4 bg-[#003559] text-white text-center text-md font-semibold"
            >
              Verify OTP
            </button>

           

          <div className="flex flex-col pt-25">
           <div className="line-clamp-1 font-regular text-[#77787b] text-md flex justify-center">
             Didn't receive the OTP yet? {" "} </div>
            <div className="text-[#0B7764] cursor-pointer flex justify-center gap-4">
           <div onClick={() => router.push("login")} >Change email </div>
           or
           <div onClick={() => router.push("#")} >Resend OTP</div>
          </div>
          </div>
      </div>
</div>

    </React.Fragment>
  );
}
