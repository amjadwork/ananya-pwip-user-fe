import React, {useState, useEffect} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { googleIcon,facebookIcon} from "theme/icon";

export default function Login() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [nameError, setNameError] = useState(false);
  // const [emailError, setEmailError]= useState(false);
  const [isValid, setIsValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(emailRegex.test(e.target.value));
    // setEmailError(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // setNameError(false);
  };
  

  //use the previous state to update the current state
  useEffect(() => {
    console.log(email)
  }, [email]) 

  useEffect(() => {
    console.log(name)
  }, [name]) 


  const handleLogin = () => {

    // if (name === "") {
    //   setNameError(true);
    //   return;
    // }

    // if (email === "") {
    //   setEmailError(true);
    //   return;
    // }

    router.push({
      pathname: "/otp", //directing to otp verification page
      query: {email}, //sending stored email state
    });
    
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>SignUp| Export Costing</title>

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
          <div className="text-white">
            <div className="pt-20 pl-7 m-0">
          <div className="font-sans text-4xl font-bold">Let's Get Started </div>
          <div className="font-serif">Create your Account</div>
          </div>
          </div>
        </div>
        <div className="h-4/6 bg-[#ffffff] w-full inline-flex flex-col space-y-8 relative mt-10 px-8">
          <div className="w-full inline-flex flex-col space-y-6 mt relative ">
           <input 
           id="name" 
           name="name" 
           type="text" 
           autoComplete="off"
           value={name}
           required 
           onChange={handleNameChange}
           className="block w-full rounded border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
           />
           <label htmlFor="name" className="absolute text-base text-[#4F5655] text-900 -translate-y-10 scale-75 top-1 origin-[0] bg-white px-1 left-3">Name</label>
         
           <input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="off"
            value={email}
            required 
            onChange={handleEmailChange}
            className="block w-full rounded border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus-ring-1 focus:ring-[#003559] sm:text-sm sm:leading-6"/>
            <label htmlFor="email" className="absolute text-base text-[#4F5655] text-900 translate-y-6 scale-75 top-3 z-10 origin-[0] bg-white px-1 left-3">Email</label>
          </div>

          <div class="flex items-center mt-0">
           <input 
           id="checkbox" 
           type="checkbox" 
           checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)}
           value="" 
           className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-[#0B7764] focus:ring-2 "/>
           <label htmlFor="checkbox" className="ml-2 text-sm font-medium text-gray-400">I agree with the <a href="#" className="text-[#005F81] hover:underline">Terms and Conditions</a> of PWIP </label>
         </div>
    
        
        <button
              onClick={handleLogin}
              className="w-full rounded py-3 px-4 bg-[#003559] hover:bg-[#175077] text-white text-center text-md font-semibold"
              disabled={!isValid || !agreedToTerms}
            >
              Sign up
            </button>

            <div class="relative flex items-center">
             <div class="flex-grow border-t border-gray-400"></div>
             <span class="flex-shrink mx-4 text-gray-400">or login with</span>
             <div class="flex-grow border-t border-gray-400"></div>
           </div>

           <div className="flex flex-row items-center pt-0 justify-center">
            <span className="pr-6  ">{googleIcon}</span>
            <span className="pl-6  ">{facebookIcon}</span>
           </div>
         
        
          <div className="pt-34 bottom-0 left-0 right-0 flex justify-center ">
           <span className="line-clamp-1 font-regular text-[#77787b] text-md" >
             Already have an account? {" "}
             <span onClick={() => router.push("login")} className="text-[#0B7764] cursor-pointer">Login</span>
           </span>
          </div>
        

      </div>
</div>

    </React.Fragment>
  );
}