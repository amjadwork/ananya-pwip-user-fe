import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
// import { useSelector } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";

// Import Containers
// import { UserTypeContainer } from "@/containers/ec/UserType";
// Import Layouts

function SelectionOverview() {
  const router = useRouter();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  // const user = useSelector((state) => state.auth.user);
  // const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
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
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Export Costing by pwip</title>

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

      <AppLayout>
        <Header />

        <div
          id="fixedMenuSection"
          className="rounded-t-3xl fixed top-[72px] h-[auto] w-full bg-white z-10 py-6 px-5"
        >
          <div
            onClick={() => {
              router.replace("/export-costing");
            }}
            className="inline-flex items-center w-full p-[8px] space-x-[10px] bg-pwip-primary-40 rounded-[5px] border-[1px] border-pwip-primary-400 mb-[28px]"
          >
            <img
              src="https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
              className="bg-cover h-[62px] w-[62px] rounded-md"
            />
            <div className="w-full inline-flex flex-col space-y-1">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                  Sona masuri Parboiled
                </span>
                <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                  ₹32/Kg
                </span>
              </div>

              <span className="text-pwip-gray-700 font-sans text-xs font-bold">
                5% Broken
              </span>

              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                  Tamil nadu
                </span>

                <div className="inline-flex items-center justify-end text-pwip-primary-400 space-x-1">
                  <span className="text-xs font-medium font-sans line-clamp-1">
                    Edit
                  </span>
                  {pencilIcon}
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              router.replace("/export-costing/select-pod");
            }}
            className="inline-flex items-center w-full p-[8px] space-x-[10px] bg-pwip-primary-40 rounded-[5px] border-[1px] border-pwip-primary-400"
          >
            <div className="h-[62px] w-[62px] overflow-hidden bg-cover rounded-md">
              {dummyRemoveMeCityIcon}
            </div>
            <div className="w-full inline-flex flex-col space-y-1">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                  Singapore port
                </span>
                <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                  SING
                </span>
              </div>

              <span className="text-pwip-gray-700 font-sans text-xs font-bold">
                5% Broken
              </span>

              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                  Singapore
                </span>

                <div className="inline-flex items-center justify-end text-pwip-primary-400 space-x-1">
                  <span className="text-xs font-medium font-sans line-clamp-1">
                    Edit
                  </span>
                  {pencilIcon}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`min-h-screen h-full w-full space-y-8 bg-white pb-[98px] overflow-hidden px-5 hide-scroll-bar`}
          style={{
            paddingTop: mainContainerHeight + 42 + "px",
          }}
        >
          <svg
            width="350"
            height="344"
            viewBox="0 0 350 344"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2718_16947)">
              <rect width="350" height="344" rx="10" fill="#F3FAFF" />
              <path
                d="M386.007 -72.7889V417.054C386.007 428.797 379.478 438.952 369.997 443.871C366.058 445.948 361.62 447.084 356.909 447.084H217.949C217.894 447.172 217.839 447.197 217.785 447.226L216.987 447.084H-7.891C-23.9558 447.084 -36.9927 433.661 -36.9927 417.054V-72.7889C-36.9927 -74.352 -36.8834 -75.9187 -36.6356 -77.4235C-36.2239 -80.2692 -35.4223 -82.9983 -34.3219 -85.527V-85.5561C-33.4693 -87.4618 -32.4491 -89.2544 -31.2904 -90.9305C-30.9042 -91.4989 -30.4924 -92.0381 -30.0516 -92.5811C-29.4722 -93.379 -28.8127 -94.1187 -28.0949 -94.8C-27.7634 -95.1425 -27.4063 -95.5105 -27.0492 -95.853C-25.9743 -96.8477 -24.8157 -97.7878 -23.606 -98.6404C-22.808 -99.2088 -21.9809 -99.7226 -21.0992 -100.204C-19.8312 -100.943 -18.483 -101.57 -17.0766 -102.08C-13.8155 -103.304 -10.2885 -103.989 -6.62666 -103.989H355.638C359.992 -103.989 364.124 -103.049 367.873 -101.344C368.398 -101.089 368.919 -100.834 369.443 -100.546C371.812 -99.3218 374.016 -97.7586 375.973 -95.9405C376.359 -95.5688 376.745 -95.2008 377.102 -94.8292C377.875 -94.0895 378.563 -93.2916 379.197 -92.4389C379.609 -91.8997 380.024 -91.3568 380.382 -90.8175C381.125 -89.7354 381.814 -88.5986 382.448 -87.4035C383.052 -86.2083 383.606 -84.9586 384.073 -83.7052C384.79 -81.7995 385.286 -79.8101 385.614 -77.7333C385.698 -77.194 385.778 -76.6256 385.836 -76.0572C385.945 -74.975 386 -73.8965 386 -72.7852L386.007 -72.7889Z"
                fill="#EAEFF7"
              />
              <path
                d="M301.526 187.931L256.162 207.807C254.658 208.467 252.923 207.742 252.286 206.19L250.056 200.772C249.418 199.219 250.118 197.427 251.622 196.771L296.986 176.895C298.49 176.235 300.225 176.96 300.862 178.513L303.092 183.931C303.73 185.483 303.03 187.276 301.526 187.931Z"
                fill="#EAEFF7"
              />
              <path
                d="M323.797 197.973L278.433 217.849C276.929 218.509 275.194 217.784 274.557 216.232L272.327 210.814C271.689 209.261 272.389 207.469 273.893 206.813L319.257 186.937C320.761 186.277 322.496 187.002 323.133 188.555L325.363 193.973C326.001 195.525 325.301 197.318 323.797 197.973Z"
                fill="#EAEFF7"
              />
              <path
                d="M345.899 208.715L300.535 228.591C299.031 229.25 297.296 228.525 296.659 226.973L294.429 221.555C293.791 220.003 294.491 218.21 295.995 217.554L341.359 197.678C342.863 197.019 344.598 197.744 345.235 199.296L347.465 204.714C348.103 206.266 347.403 208.059 345.899 208.715Z"
                fill="#EAEFF7"
              />
              <path
                d="M199.013 344.352L164.967 341.088C163.575 340.953 162.551 339.681 162.679 338.242L163.284 331.509C163.411 330.073 164.646 329.016 166.038 329.147L200.084 332.412C201.476 332.547 202.5 333.819 202.372 335.258L201.768 341.991C201.64 343.427 200.405 344.484 199.013 344.352Z"
                fill="#EAEFF7"
              />
              <path
                d="M64.9888 336.832L32.8556 324.768C31.5403 324.276 30.8625 322.775 31.3399 321.419L33.5807 315.061C34.058 313.706 35.5118 313.006 36.8272 313.498L68.9604 325.562C70.2757 326.054 70.9534 327.555 70.4761 328.911L68.2353 335.269C67.7579 336.624 66.3041 337.324 64.9888 336.832Z"
                fill="#EAEFF7"
              />
              <path
                d="M215.266 184.146L191.641 194.497C190.511 194.993 189.211 194.45 188.733 193.284L185.928 186.463C185.45 185.301 185.975 183.956 187.105 183.461L210.73 173.109C211.86 172.614 213.16 173.157 213.638 174.323L216.443 181.143C216.921 182.309 216.396 183.65 215.266 184.146Z"
                fill="#EAEFF7"
              />
              <path
                d="M158.43 209.691L148.402 185.308C147.925 184.142 148.45 182.801 149.579 182.306L156.189 179.409C157.318 178.914 158.619 179.457 159.096 180.623L169.124 205.006C169.601 206.168 169.076 207.513 167.947 208.008L161.337 210.905C160.208 211.4 158.907 210.857 158.43 209.691Z"
                fill="#EAEFF7"
              />
              <path
                d="M-0.69475 231.225L-15.5134 209.597C-16.2203 208.566 -15.9834 207.134 -14.9814 206.405L-9.11882 202.127C-8.11683 201.399 -6.73225 201.643 -6.02538 202.674L8.79327 224.302C9.50013 225.334 9.26329 226.765 8.26129 227.494L2.39869 231.772C1.39669 232.501 0.0121145 232.256 -0.69475 231.225Z"
                fill="#EAEFF7"
              />
              <path
                d="M173.07 6.30367L150.844 -6.94093C149.784 -7.57493 149.419 -8.97408 150.031 -10.0708L153.62 -16.4873C154.233 -17.584 155.592 -17.9593 156.652 -17.3253L178.882 -4.08068C179.942 -3.44669 180.306 -2.04754 179.694 -0.950804L176.105 5.46563C175.493 6.56236 174.134 6.93766 173.074 6.30367H173.07Z"
                fill="#EAEFF7"
              />
              <path
                d="M18.3218 202.05L8.65157 178.534C8.07223 177.132 8.70987 175.51 10.0689 174.913L20.2274 170.46C21.5865 169.862 23.1605 170.518 23.7362 171.925L33.4064 195.441C33.9857 196.844 33.3481 198.465 31.989 199.063L21.8306 203.515C20.4715 204.113 18.8975 203.457 18.3218 202.05Z"
                fill="#EAEFF7"
              />
              <path
                d="M8.83641 351.811L-0.833786 328.295C-1.41312 326.892 -0.775488 325.271 0.583586 324.673L10.742 320.221C12.1011 319.623 13.6752 320.279 14.2508 321.686L23.921 345.202C24.5004 346.604 23.8627 348.226 22.5037 348.823L12.3452 353.276C10.9862 353.873 9.4121 353.217 8.83641 351.811Z"
                fill="#EAEFF7"
              />
              <path
                d="M237.281 150.548L200.703 166.572C199.289 167.192 197.657 166.51 197.055 165.053L194.691 159.3C194.089 157.839 194.749 156.155 196.163 155.536L232.741 139.511C234.155 138.892 235.787 139.573 236.388 141.031L238.753 146.784C239.354 148.245 238.695 149.928 237.281 150.548Z"
                fill="#EAEFF7"
              />
              <path
                d="M113.395 9.16037L80.9482 32.8403C79.6948 33.7549 77.9567 33.4488 77.0713 32.1553L73.5771 27.0542C72.6917 25.7607 72.9868 23.9681 74.2439 23.0535L106.69 -0.626428C107.944 -1.54098 109.682 -1.23491 110.567 0.0585768L114.061 5.15966C114.947 6.45315 114.652 8.24582 113.395 9.16037Z"
                fill="#EAEFF7"
              />
              <path
                d="M47.9875 2.14981C47.9875 2.14981 61.8369 6.36185 64.7956 17.2927C67.7542 28.2236 55.497 36.6987 52.7315 40.2986C49.966 43.8985 18.9259 40.663 18.9259 40.663C18.9259 40.663 -11.7025 25.8662 -12.2417 17.2964C-12.781 8.72656 -37.3026 7.37114 -8.45234 -3.00228C20.3979 -13.3757 6.69423 -18.7865 20.3979 -13.3757C34.1016 -7.9649 47.9948 2.15346 47.9948 2.15346L47.9875 2.14981Z"
                fill="#D5E2F0"
              />
              <path
                d="M329.928 -30.2311C329.928 -30.2311 343.777 -26.019 346.736 -15.0881C349.695 -4.15722 337.437 4.31786 334.672 7.91777C331.906 11.5177 300.866 8.28213 300.866 8.28213C300.866 8.28213 270.238 -6.51466 269.699 -15.0845C269.159 -23.6579 244.638 -25.0097 273.488 -35.3831C302.338 -45.7566 288.635 -51.1673 302.338 -45.7566C316.042 -40.3458 329.935 -30.2274 329.935 -30.2274L329.928 -30.2311Z"
                fill="#D5E2F0"
              />
              <path
                d="M79.2752 159.489C79.2752 159.489 76.8631 166.609 69.3135 168.722C61.7602 170.836 55.3329 165.257 52.6985 164.099C50.0642 162.94 51.1136 147.352 51.1136 147.352C51.1136 147.352 60.2882 131.28 66.282 130.508C72.2758 129.732 72.2612 117.489 80.6707 131.186C89.0802 144.882 92.3412 137.762 89.0802 144.882C85.8228 152.002 79.2715 159.489 79.2715 159.489H79.2752Z"
                fill="#D5E2F0"
              />
              <path
                d="M-36.9927 75.627C-13.75 66.9843 40.398 55.168 52.8665 63.7597C65.335 72.3513 113.161 71.8339 113.161 71.8339L156.947 44.514C156.947 44.514 222.652 61.3366 222.044 26.5691C221.435 -8.20205 241.41 -62.9768 266.806 -75.8643C292.198 -88.7554 294.191 -103.982 294.191 -103.982H272.089C272.089 -103.982 260.211 -79.8067 249.149 -77.6569C238.087 -75.5072 205.771 -45.1485 208.748 -28.8214C211.725 -12.4979 208.748 16.1046 208.748 16.1046L181.06 25.3959L145.12 19.5005C145.12 19.5005 129.27 40.6627 127.135 44.514C124.999 48.3653 106.053 55.8311 94.7683 51.9434C83.484 48.0556 50.0719 48.3617 50.0719 48.3617C50.0719 48.3617 13.0161 63.7669 6.43575 54.6797C-0.144642 45.5925 -18.494 49.7936 -18.494 49.7936L-36.9927 54.687V75.6306V75.627Z"
                fill="#D5E2F0"
              />
              <path
                d="M386.007 178.418V209.331C383.555 211.662 379.918 214.705 375.867 216.498C372.78 217.919 369.447 218.545 366.277 217.58C364.925 217.183 363.413 217.379 361.784 218.09C356.796 220.221 350.846 226.907 345.774 233.561C342.99 237.23 340.483 240.928 338.581 243.828C336.348 247.268 334.97 249.6 334.97 249.6C334.97 249.6 308.354 270.474 297.055 274.315C292.923 275.71 288.871 278.979 285.399 282.735C284.601 283.617 283.829 284.499 283.111 285.41C282.313 286.375 281.569 287.373 280.877 288.339C277.35 293.375 275.175 298.206 275.423 300.228C275.947 304.637 275.506 331.399 275.506 331.399L275.342 331.483L270.686 334.016L265.366 336.887L243.268 348.86L226.485 373.374C226.485 373.374 231.171 381.594 237.452 390.692C240.702 395.498 244.452 400.559 248.117 404.797H248.146C249.608 406.476 251.069 408.04 252.501 409.402C259.114 415.658 259.445 432.211 257.102 447.085H237.292C236.574 440.26 235.252 433.148 233.433 426.039C232.413 421.915 231.2 417.819 229.877 413.782C228.802 410.568 227.644 407.384 226.434 404.283C224.587 399.59 222.55 395.039 220.4 390.747C217.121 384.177 213.51 378.206 209.764 373.199C197.944 357.473 213.346 341.889 228.668 331.421C230.183 330.368 231.699 329.403 233.215 328.463C234.676 327.552 236.108 326.67 237.514 325.876C245.341 321.325 251.539 318.65 251.539 318.65L270.799 269.705C270.799 269.705 270.854 269.676 270.937 269.593C270.992 269.563 271.047 269.509 271.13 269.45C271.542 269.108 272.424 268.456 273.637 267.545C274.381 266.947 275.262 266.295 276.283 265.526C279.285 263.307 283.307 260.378 287.8 257.252C299.897 248.948 315.437 239.42 323.814 238.964C331.666 238.538 345.471 226.507 358.807 212.089C362.032 208.62 365.227 204.98 368.313 201.34C375.145 193.262 381.376 185.13 386.003 178.418H386.007Z"
                fill="#D5E2F0"
              />
              <path
                d="M95.8648 418.839C95.6425 421.171 95.26 423.419 94.7608 425.609C94.677 425.893 94.6223 426.177 94.5385 426.461H-5.70139C-5.73054 426.461 -5.73054 426.432 -5.73054 426.432C-7.19164 424.497 -8.53978 422.592 -9.78226 420.686C-13.2255 415.283 -15.5137 410.05 -15.6777 405.558C-16.4501 385.139 -51.8298 381.925 -10.2231 357.211C-9.12276 356.555 -8.07339 355.902 -7.05318 355.276C-4.98724 353.968 -3.08526 352.714 -1.32175 351.494C28.4941 330.59 13.2564 320.636 31.4126 332.496C36.674 335.91 41.9391 340.147 46.8726 344.469C48.5523 345.977 50.2065 347.511 51.806 349.02C62.9665 359.542 71.2339 369.497 71.2339 369.497C71.2339 369.497 91.2119 379.506 95.4822 405.558C96.2547 410.163 96.3093 414.601 95.8684 418.839H95.8648Z"
                fill="#D5E2F0"
              />
              <path
                d="M277.868 47.0503C245.37 71.0691 194.56 71.5172 222.047 106.201C249.535 140.885 284.109 179.42 308.966 156.392C333.827 133.368 328.154 136.29 341.398 103.68C354.639 71.0691 367.592 44.1609 325.188 35.6275C282.783 27.0905 277.868 47.0503 277.868 47.0503Z"
                fill="#D5E2F0"
              />
              <path
                d="M188.591 255.378C167.91 266.375 135.573 266.579 153.066 282.458C170.559 298.337 192.559 315.976 208.38 305.435C224.2 294.894 220.593 296.231 229.017 281.303C237.445 266.375 245.687 254.056 218.702 250.15C191.717 246.244 188.587 255.378 188.587 255.378H188.591Z"
                fill="#D5E2F0"
              />
              <path
                d="M386 236.931V266.776L368.518 231.622L365.483 225.512L327.593 149.363L321.562 137.259L295.441 84.7508L292.424 78.6769L262.011 17.5368L258.976 11.4446L235.369 -36.0246L232.297 -42.1932L203.104 -100.867C202.605 -101.858 202.365 -102.929 202.383 -103.978H216.407L244.824 -46.8498L247.859 -40.7576L285.804 35.5254L288.839 41.6175L333.444 131.284L339.474 143.391L386.004 236.934L386 236.931Z"
                fill="white"
              />
              <path
                d="M386 104.816V119.959L339.471 143.388L327.593 149.363L238.495 194.253L232.538 197.233L166.344 230.573L160.423 233.553L153.336 237.124L102.274 262.844L88.7672 269.643L36.6159 295.918L28.7712 299.871L16.0804 306.247C15.931 306.324 15.7671 306.4 15.5994 306.477L-10.0809 319.423L-16.0382 322.421L-34.1142 331.53C-35.0397 332.008 -36.0381 332.219 -37 332.219V317.823L5.40457 296.475L17.6326 290.328L86.1401 255.823C86.3077 255.728 86.4717 255.652 86.6393 255.575L140.864 228.27L152.779 222.254L182.361 207.363L188.282 204.382L275.474 160.484L281.395 157.485L321.559 137.263L333.437 131.287L385.996 104.824L386 104.816Z"
                fill="white"
              />
              <path
                d="M172.618 447.085H159.421C160.937 408.294 155.398 376.952 146.774 351.982C145.728 348.911 144.624 345.952 143.465 343.11C125.418 297.663 97.5848 275.71 88.7672 269.651C87.0875 268.485 86.0928 267.887 85.9835 267.832C82.8135 266.04 81.6293 261.89 83.3929 258.618C84.1362 257.197 85.3203 256.173 86.643 255.575C88.4065 254.807 90.5016 254.865 92.3453 255.889C92.7315 256.115 96.5354 258.308 102.263 262.855C111.853 270.449 126.898 284.641 140.674 307.308C140.977 307.821 141.279 308.331 141.611 308.845C143.538 312.117 145.495 315.644 147.426 319.397C157.155 338.308 166.162 363.449 170.352 395.56C170.931 399.94 171.427 404.461 171.813 409.125C172.778 420.927 173.135 433.556 172.611 447.092L172.618 447.085Z"
                fill="white"
              />
              <path
                d="M386 -5.50907V1.57414L370.478 7.96871L288.835 41.614L282.379 44.2666C281.989 44.4378 281.566 44.5143 281.158 44.5143C279.846 44.5143 278.604 43.7127 278.105 42.3755C277.42 40.6193 278.254 38.6517 279.937 37.9449L285.804 35.5182L364.634 3.03888L370.795 0.499269L384.783 -5.26859C385.191 -5.43984 385.595 -5.51636 386.004 -5.51636L386 -5.50907Z"
                fill="white"
              />
              <path
                d="M370.869 7.77914C370.737 7.85566 370.61 7.91396 370.479 7.96861C370.089 8.12164 369.703 8.19817 369.295 8.19817C368.129 8.19817 366.999 7.5496 366.391 6.40186L364.634 3.04243L324.376 -73.7362L321.213 -79.77L309.371 -102.361C309.095 -102.874 308.963 -103.428 308.963 -103.982H316.032L327.335 -82.4044L330.497 -76.3705L370.792 0.502815L372.199 3.17724C373.069 4.82052 372.476 6.88281 370.865 7.77914H370.869Z"
                fill="white"
              />
              <path
                d="M153.707 354.748C153.274 354.748 152.837 354.66 152.41 354.475L23.3857 297.47C21.7096 296.73 20.9336 294.73 21.6513 292.999C22.3655 291.272 24.3039 290.471 25.9836 291.21L155.008 348.215C156.684 348.954 157.46 350.955 156.743 352.686C156.207 353.975 154.99 354.751 153.707 354.751V354.748Z"
                fill="white"
              />
              <path
                d="M91.8023 327.468L91.6639 327.639L60.4161 369.643L24.9526 417.363L20.5985 423.222L2.87952 447.055L2.85037 447.084H-5.47168L-1.1722 441.313L15.6359 418.704L20.4564 412.193L55.479 365.099L85.4041 324.884L86.5628 323.347C87.6631 321.838 89.7327 321.554 91.1647 322.691C92.6258 323.857 92.899 325.988 91.7987 327.468H91.8023Z"
                fill="white"
              />
              <path
                d="M211.193 328.808C210.009 328.808 208.865 328.149 208.275 326.994L157.391 227.636C156.539 225.974 157.155 223.916 158.769 223.034C160.379 222.152 162.376 222.79 163.229 224.451L214.112 323.809C214.964 325.471 214.349 327.529 212.735 328.411C212.243 328.681 211.714 328.808 211.197 328.808H211.193Z"
                fill="white"
              />
              <path
                d="M298.578 317.991C297.412 317.991 296.283 317.35 295.681 316.22L229.448 191.4C228.573 189.753 229.16 187.684 230.756 186.78C232.355 185.877 234.359 186.481 235.234 188.132L301.468 312.952C302.342 314.599 301.755 316.668 300.16 317.572C299.657 317.856 299.114 317.991 298.578 317.991Z"
                fill="white"
              />
              <path
                d="M273.263 270.288C271.951 270.288 270.709 269.472 270.195 268.135C269.525 266.386 270.352 264.411 272.046 263.715L371.943 222.874C373.634 222.185 375.554 223.038 376.225 224.787C376.895 226.536 376.068 228.514 374.374 229.206L274.476 270.048C274.079 270.212 273.668 270.288 273.263 270.288Z"
                fill="white"
              />
              <path
                d="M386 347.887V354.74C385.832 354.74 385.705 354.74 385.537 354.7L343.114 348.419V348.401L336.545 347.428L287.057 340.097L280.491 339.124L210.745 328.776L147.437 319.401V319.383L136.688 317.798C135.395 317.608 134.32 316.614 133.97 315.295C133.638 313.957 134.101 312.565 135.154 311.724L140.685 307.311L181.534 274.774L183.735 273.017C185.178 271.873 187.251 272.158 188.358 273.648C188.468 273.801 188.581 273.972 188.654 274.143C189.393 275.575 189.062 277.39 187.765 278.421L184.657 280.902L145.36 312.197L205.228 321.077L213.332 322.279L281.413 332.38L288.001 333.352L337.489 340.683L344.036 341.656L385.996 347.88L386 347.887Z"
                fill="white"
              />
              <path
                d="M188.296 215.353C187.101 215.353 185.946 214.679 185.36 213.506C147.743 138.025 147.2 86.9226 183.709 57.2817C193.128 49.6337 198.182 40.3424 198.735 29.6629C200.145 2.40859 172.476 -25.804 172.199 -26.0846C170.894 -27.3963 170.869 -29.5533 172.14 -30.8978C173.412 -32.2387 175.5 -32.2715 176.804 -30.9598C178.032 -29.7246 206.883 -0.342342 205.327 30.0091C204.674 42.7399 198.775 53.7182 187.79 62.6378C154.163 89.9432 155.285 138.272 191.229 210.394C192.064 212.067 191.426 214.118 189.805 214.978C189.324 215.233 188.806 215.353 188.3 215.353H188.296Z"
                fill="white"
              />
              <path
                d="M162.063 142.889C160.777 142.889 159.56 142.113 159.024 140.815C158.31 139.085 159.093 137.084 160.769 136.348L298.739 75.9005C300.419 75.1645 302.354 75.9734 303.064 77.7041C303.778 79.4348 302.995 81.4352 301.319 82.1712L163.349 142.619C162.926 142.805 162.489 142.889 162.063 142.889Z"
                fill="white"
              />
              <path
                d="M267.877 14.9571L262.011 17.5331L202.328 43.6944L201.071 44.2482C200.645 44.4195 200.219 44.5142 199.778 44.5142C199.187 44.5142 198.593 44.343 198.058 44.0187L195.617 42.492L137.377 5.96461L131.31 2.1643L61.9719 -41.3334L60.9189 -41.9819C60.2521 -42.3827 59.753 -43.0313 59.5125 -43.7965L58.2554 -47.615L39.968 -102.874C39.8369 -103.239 39.7822 -103.618 39.7822 -103.982H46.5521L64.8322 -48.7044L65.3496 -47.1559L71.9919 -42.9949L138.944 -1.00565L197.85 35.9225L200.033 37.2962L204.733 35.2339L258.976 11.441L265.305 8.67183C266.97 7.94675 268.912 8.74834 269.633 10.4864C270.337 12.2061 269.56 14.2101 267.877 14.9534V14.9571Z"
                fill="white"
              />
              <path
                d="M193.012 129.615C192.349 127.425 191.496 125.319 190.422 123.359C185.215 113.605 175.432 106.835 164.078 106.096H164.049C163.389 106.067 162.726 106.037 162.063 106.037C161.539 106.037 161.017 106.037 160.493 106.096C159.418 106.125 158.343 106.238 157.323 106.409H157.294C144.592 108.344 134.313 117.872 130.87 130.384V130.413C130.072 133.284 129.657 136.356 129.657 139.486C129.657 141.759 129.879 144.008 130.291 146.143C133.293 161.388 146.41 172.934 162.063 172.934C163.965 172.934 165.867 172.763 167.685 172.424C168.76 172.224 169.806 171.998 170.826 171.685C171.93 171.371 173.001 171.003 174.051 170.548C185.984 165.629 194.47 153.539 194.47 139.493C194.47 136.054 193.974 132.752 193.009 129.626L193.012 129.615ZM171.905 164.113H171.875C170.83 164.569 169.755 164.937 168.651 165.224C167.631 165.509 166.585 165.735 165.481 165.88C164.351 166.052 163.222 166.135 162.063 166.135C147.817 166.135 136.244 154.192 136.244 139.486C136.244 126.631 145.062 115.937 156.802 113.408H156.831C157.851 113.183 158.871 113.037 159.946 112.953C160.635 112.895 161.353 112.866 162.067 112.866C162.537 112.866 163.003 112.866 163.473 112.895C172.346 113.405 180.063 118.553 184.304 126.034C185.433 127.968 186.315 130.1 186.895 132.319C187.529 134.592 187.86 137.012 187.86 139.486C187.86 150.577 181.247 160.105 171.905 164.113Z"
                fill="white"
              />
              <path
                d="M312.268 307.559C307.943 307.559 303.752 308.47 299.978 310.117H299.948C298.928 310.572 297.937 311.057 297.001 311.596C296.01 312.165 295.073 312.733 294.191 313.389H294.162C287.906 317.911 283.333 324.564 281.406 332.387C281.158 333.411 280.965 334.464 280.827 335.513C280.634 336.708 280.55 337.903 280.495 339.124C280.44 339.55 280.44 339.947 280.44 340.403C280.44 358.49 294.742 373.25 312.268 373.25C327.119 373.25 339.631 362.669 343.129 348.422V348.393C343.654 346.233 343.956 343.984 344.04 341.652C344.069 341.226 344.069 340.829 344.069 340.403C344.069 322.287 329.823 307.555 312.271 307.555L312.268 307.559ZM336.545 347.431C333.568 358.38 323.814 366.429 312.268 366.429C298.353 366.429 287.054 354.74 287.054 340.406V340.093C287.108 337.761 287.411 335.488 287.99 333.352C289.863 326.582 294.301 320.895 300.171 317.568C303.752 315.55 307.888 314.384 312.268 314.384C326.183 314.384 337.481 326.072 337.481 340.406V340.691C337.481 343.023 337.15 345.3 336.545 347.431Z"
                fill="white"
              />
              <path
                d="M281.165 168.587C279.912 168.587 278.713 167.844 278.159 166.591L249.448 101.29C248.693 99.5771 249.429 97.5585 251.087 96.7824C252.745 96.0063 254.702 96.7642 255.452 98.4767L284.164 163.778C284.918 165.49 284.182 167.509 282.524 168.285C282.084 168.493 281.621 168.587 281.162 168.587H281.165Z"
                fill="white"
              />
              <path
                d="M104.475 439.462L131.838 447.085H106.486L103.371 446.232L20.5948 423.222L18.4742 422.625C17.3993 422.312 16.5467 421.488 16.2151 420.435L15.6358 418.701L1.55681 375.899L-16.0492 322.403L-18.3083 315.52C-18.8876 313.728 -17.9767 311.793 -16.2423 311.199C-14.5335 310.572 -12.6606 311.541 -12.0558 313.33L-10.0445 319.415L7.28824 372.113L20.46 412.186L21.8919 416.507L24.9489 417.36L104.471 439.458L104.475 439.462Z"
                fill="white"
              />
              <path
                d="M13.0818 306.99C10.2799 306.99 7.68562 305.136 6.79294 302.232C6.5561 301.459 -16.1073 224.601 54.1783 194.989C124.457 165.388 155.919 227.341 156.229 227.971C157.88 231.323 156.583 235.422 153.332 237.124C150.079 238.825 146.111 237.488 144.464 234.136C143.418 232.048 118.022 182.805 59.1665 207.599C34.3716 218.046 20.1396 236.337 16.8712 261.966C14.379 281.514 19.3234 297.958 19.3744 298.122C20.4748 301.707 18.5509 305.533 15.0749 306.666C14.4118 306.885 13.7413 306.987 13.0818 306.987V306.99Z"
                fill="white"
              />
              <path
                d="M62.6281 202.393C61.6734 202.393 60.7261 201.967 60.0739 201.147C58.9189 199.693 59.1229 197.547 60.533 196.355L128.509 138.841L12.131 -34.986C11.0962 -36.5345 11.4715 -38.6551 12.969 -39.7227C14.4666 -40.7903 16.5252 -40.4041 17.5564 -38.8592L135.665 137.547C136.641 139.005 136.371 140.994 135.042 142.116L64.7159 201.617C64.1038 202.134 63.3641 202.389 62.6281 202.389V202.393Z"
                fill="white"
              />
              <path
                d="M73.9012 54.6872C72.9028 54.6872 71.9154 54.2208 71.2668 53.3354C70.1665 51.8379 70.4543 49.7027 71.9081 48.5659L135.18 -0.856336C136.634 -1.9895 138.703 -1.69437 139.8 -0.196839C140.9 1.30069 140.612 3.43587 139.159 4.57268L75.887 53.9949C75.2931 54.4576 74.5898 54.6835 73.8975 54.6835L73.9012 54.6872Z"
                fill="white"
              />
              <path
                d="M11.9776 7.34604C4.56284 7.34604 -2.07949 5.64082 -7.90566 2.22674C-25.0599 -7.81875 -28.412 -28.8206 -28.5432 -29.7097C-28.8237 -31.5679 -27.5922 -33.3096 -25.7922 -33.5974C-23.9923 -33.8853 -22.3089 -32.6173 -22.0247 -30.7627C-21.9919 -30.5514 -18.9677 -12.0417 -4.60089 -3.66502C5.83083 2.41985 19.8041 1.88788 36.9292 -5.24635C38.6199 -5.95322 40.54 -5.10789 41.2214 -3.36624C41.9028 -1.62094 41.0866 0.364841 39.396 1.06442C29.3541 5.25095 20.1904 7.34604 11.974 7.34604H11.9776Z"
                fill="white"
              />
              <path
                d="M53.3803 22.8242L51.1977 23.3598L19.7642 30.9203L13.3076 32.4871L-3.19436 36.4586L-9.66909 38.0072L-36.253 44.42C-36.5117 44.4965 -36.734 44.5147 -36.9927 44.5147V37.6027L-8.20435 30.6726C-8.13148 30.6543 -8.07318 30.6543 -8.01853 30.6361L47.1679 17.3478L51.8864 16.2037C53.2746 15.8612 54.6628 16.4916 55.4025 17.6757C55.6065 18 55.7523 18.3644 55.847 18.7433C56.2551 20.5761 55.162 22.4088 53.3876 22.8278L53.3803 22.8242Z"
                fill="white"
              />
              <path
                d="M77.7528 116.764C71.1615 116.764 65.8564 108.001 60.7043 99.4822C56.321 92.2423 50.8628 83.2462 46.9058 84.321C32.4224 88.289 17.2649 44.8022 12.9654 31.3791C12.3934 29.5937 13.3334 27.6699 15.0605 27.076C16.7876 26.493 18.6568 27.4549 19.2288 29.2403C27.9553 56.4764 40.1032 79.107 45.2152 77.737C53.8907 75.3686 60.1978 85.7894 66.3009 95.8714C70.2032 102.321 75.5521 111.16 78.5945 109.714C89.6529 104.499 103.681 95.7037 103.823 95.6163C105.379 94.6434 107.408 95.1499 108.356 96.7531C109.303 98.3599 108.811 100.455 107.255 101.432C106.669 101.8 92.7573 110.522 81.3382 115.908C80.103 116.491 78.9115 116.757 77.7601 116.757L77.7528 116.764Z"
                fill="white"
              />
              <path
                d="M13.6429 251.291L5.17142 252.799L-36.4388 260.188C-36.6247 260.225 -36.8105 260.247 -36.9927 260.247V253.393L7.00052 245.563L12.5316 244.572C14.306 244.266 16.0294 245.508 16.3428 247.359C16.6379 249.21 15.4355 250.966 13.6429 251.291Z"
                fill="white"
              />
              <path
                d="M23.8924 231.564C23.3021 231.983 22.6536 232.194 21.9868 232.194C20.952 232.194 19.9318 231.699 19.2868 230.744L15.9384 225.876L-17.7142 176.727C-17.8454 176.574 -17.9547 176.421 -18.0458 176.25L-36.9927 148.598V139.281C-35.9579 139.281 -34.9559 139.795 -34.311 140.732L-16.4207 166.835L-11.6476 173.805L20.0629 220.09L24.6685 226.831C25.7215 228.357 25.3717 230.478 23.8924 231.567V231.564Z"
                fill="white"
              />
              <path
                d="M49.5695 208.051C48.1995 208.051 46.9242 207.166 46.4505 205.76L-10.627 35.1175C-11.2209 33.3394 -10.3063 31.401 -8.58652 30.7889C-6.85944 30.1767 -4.98662 31.1204 -4.39271 32.8949L52.6848 203.537C53.2787 205.315 52.3641 207.254 50.6443 207.866C50.2873 207.993 49.9229 208.051 49.5658 208.051H49.5695Z"
                fill="white"
              />
              <path
                d="M-15.1855 177.93C-15.3604 177.93 -15.5353 177.915 -15.7139 177.886C-17.5102 177.591 -18.7344 175.853 -18.4502 173.998C-18.3482 173.339 -15.8268 157.744 -2.87007 148.985C6.14427 142.889 17.7711 141.686 31.6898 145.421C33.4533 145.891 34.5099 147.753 34.0545 149.571C33.5954 151.389 31.7918 152.482 30.0319 152.009C18.0225 148.795 8.18835 149.677 0.802711 154.643C-9.70552 161.708 -11.9099 174.938 -11.9318 175.069C-12.1978 176.738 -13.5969 177.93 -15.1855 177.93Z"
                fill="white"
              />
              <path
                d="M12.6445 95.0002L9.66765 95.82L-36.1401 108.445C-36.4352 108.522 -36.6939 108.558 -36.9927 108.558V101.646L7.51791 89.3672L10.9393 88.4125C12.5315 87.9935 14.1384 88.8133 14.787 90.2854C14.8598 90.4566 14.9181 90.6497 14.9728 90.8392C15.4537 92.6537 14.4007 94.5229 12.6409 95.0002H12.6445Z"
                fill="white"
              />
              <rect
                x="-32"
                y="-104"
                width="411"
                height="174"
                fill="url(#paint0_linear_2718_16947)"
              />
              <g filter="url(#filter0_d_2718_16947)">
                <path
                  d="M310.528 63.897C309.977 68.8162 299.896 78.329 299.896 78.329C299.896 78.329 292.178 66.8215 292.729 61.9022C293.281 56.983 297.71 53.4464 302.623 53.997C307.537 54.5477 311.078 58.9881 310.528 63.897Z"
                  fill="#FF5D00"
                />
                <path
                  d="M301.078 67.8085C303.953 68.1307 306.545 66.0613 306.867 63.1863C307.189 60.3114 305.12 57.7196 302.245 57.3974C299.37 57.0752 296.778 59.1446 296.456 62.0195C296.133 64.8945 298.203 67.4863 301.078 67.8085Z"
                  fill="white"
                />
              </g>
              <path
                d="M60.5957 263.284C80.6339 196.295 175.732 99.0653 297.411 75.0671"
                stroke="#FF5D00"
                strokeWidth="4"
              />
              <g filter="url(#filter1_d_2718_16947)">
                <path
                  d="M73.4135 248.623C72.7242 254.773 60.1223 266.666 60.1223 266.666C60.1223 266.666 50.4727 252.279 51.1619 246.129C51.8511 239.979 57.3873 235.558 63.5303 236.246C69.6734 236.935 74.1001 242.486 73.4123 248.623L73.4135 248.623Z"
                  fill="#FF5D00"
                />
                <path
                  d="M61.5987 253.513C65.1929 253.916 68.4331 251.329 68.8359 247.735C69.2387 244.14 66.6516 240.9 63.0574 240.497C59.4632 240.095 56.223 242.682 55.8202 246.276C55.4174 249.87 58.0045 253.11 61.5987 253.513Z"
                  fill="white"
                />
              </g>
              <path
                d="M324.167 306.5C324.167 312.943 318.943 318.167 312.5 318.167M324.167 306.5C324.167 300.057 318.943 294.833 312.5 294.833M324.167 306.5H327.083M312.5 318.167C306.057 318.167 300.833 312.943 300.833 306.5M312.5 318.167V321.083M300.833 306.5C300.833 300.057 306.057 294.833 312.5 294.833M300.833 306.5H297.917M312.5 294.833V291.917M316.875 306.5C316.875 308.916 314.916 310.875 312.5 310.875C310.084 310.875 308.125 308.916 308.125 306.5C308.125 304.084 310.084 302.125 312.5 302.125C314.916 302.125 316.875 304.084 316.875 306.5Z"
                stroke="#015F81"
                strokeWidth="2.91667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_2718_16947"
                x="288.701"
                y="53.9406"
                width="25.8833"
                height="32.3884"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2718_16947"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2718_16947"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_2718_16947"
                x="47.1267"
                y="236.176"
                width="30.3561"
                height="38.4902"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2718_16947"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2718_16947"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_2718_16947"
                x1="174"
                y1="-142.425"
                x2="174"
                y2="39.55"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <clipPath id="clip0_2718_16947">
                <rect width="350" height="344" rx="10" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <Button
            type="primary"
            label="Generate consting"
            onClick={() => {
              router.push("/export-costing/costing");
            }}
          />
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(SelectionOverview);
