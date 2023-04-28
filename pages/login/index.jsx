import React, {useState, useEffect} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { googleIcon,facebookIcon} from "theme/icon";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(emailRegex.test(e.target.value));
  };

  //use the previous state to update the current state
  useEffect(() => {
    console.log(email)
  }, [email]) 

  const handleLogin = () => {
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

        <title>Login | Export Costing</title>

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
          <div className="pt-20 pl-7 m-0 font-sans text-4xl font-bold">Sign in to your Account </div>
          </div>
        </div>
        <div className="h-4/6 bg-[#ffffff] w-full inline-flex flex-col space-y-8 relative mt-10 px-8">
          <div className="w-full inline-flex flex-col space-y-8 relative ">
           <div className="w=full inline-flex flex-col space-y-3 relative">
             <div className="mt-2">
             <input 
             id="email" 
             name="email" 
             type="email" 
             value={email}
             autoComplete="off"
             required 
             onChange={handleEmailChange}
             className="block w-full rounded border border-gray-400 px-4 py-3 text-gray-900 focus:outline-1 focus:outline-gray-500 sm:text-sm sm:leading-6"/>
             <label htmlFor="floating_outlined" className="absolute text-s text-[#4F5655] text-900 -translate-y-2 scale-75 top-1  z-10 origin-[0] bg-white px-1 left-3">Email</label>
            </div>
          </div>
        </div>
        <button
              onClick={handleLogin}
              className="w-full rounded py-3 px-4 bg-[#003559] text-white hover:bg-[#175077] text-center text-md font-semibold"
              disabled={!isValid}
            >
              Log in
            </button>

            <div class="relative flex items-center">
             <div class="flex-grow border-t border-gray-400"></div>
             <span class="flex-shrink mx-4 text-gray-400">or login with</span>
             <div class="flex-grow border-t border-gray-400"></div>
           </div>

           <div className="flex flex-row items-center pt-7 justify-center">
            <span className="pr-6  ">{googleIcon}</span>
            <span className="pl-6  ">{facebookIcon}</span>
           </div>
         
        
          <div className="pt-34 bottom-0 left-0 right-0 flex justify-center ">
           <span className="line-clamp-1 font-regular text-[#77787b] text-md" >
             Don't have an account? {" "}
             <span onClick={() => router.push("signup")} className="text-[#0B7764] cursor-pointer">Register now</span>
           </span>
          </div>
        

      </div>
</div>

    </React.Fragment>
  );
}
