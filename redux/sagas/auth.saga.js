import { takeLatest, put, call } from "redux-saga/effects";
import {
  handleSettingAuthDataSuccess,
  handleSettingAuthDataFailure,
} from "../actions/auth.actions";
import { SET_AUTH_DATA_REQUEST } from "../actions/types/auth.types";

import { makeApiCall } from "./_commonFunctions.saga";
import axios from "axios";
import {
  // apiBaseURL,
  apiStagePaymentBeUrl,
  exportCostingServiceId,
} from "@/utils/helper";

// const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;
// const SERVICE_ID = Number(exportCostingServiceId); // should be Number

// function generateRandomId(prefixText) {
//   const prefix = prefixText;
//   const randomPart = Math.random().toString(36).substring(2, 15);
//   const randomId = `${prefix}${randomPart}`;
//   return randomId;
// }

const startFreeTrialForUser = async (authToken) => {
  try {
    const response = await axios.post(
      apiStagePaymentBeUrl +
        "api" +
        "/start-free-trial?serviceId=" +
        Number(exportCostingServiceId),
      null,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

// const createSubscription = async (body, authToken) => {
//   try {
//     const response = await axios.post(
//       apiBaseURL + "api" + "/subscription",
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );

//     return response?.data;
//   } catch (err) {
//     return err;
//   }
// };

// const createOrder = async (planid, userDetails, authToken) => {
//   try {
//     const planId = planid;

//     const subsPayload = {
//       user_id: userDetails?._id,
//       plan_id: planId,
//       order_id: generateRandomId("free_order_"),
//       payment_id: generateRandomId("free_pay_"),
//       amount_paid: 0,
//       amount_paid_date: new Date().toISOString(),
//       payment_platform: "",
//       payment_status: "success",
//     };

//     await createSubscription(subsPayload, authToken);
//   } catch (err) {
//     return err;
//   }
// };

function* handleAuthSuccessAndFailure(action) {
  const { user, token } = action.payload;

  try {
    if (user && token) {
      const body = {
        ...user,
        auth_id: user.sub,
      };

      const response = yield call(
        makeApiCall,
        "/login",
        "post",
        body,
        null,
        token
      );

      if (response?.data) {
        yield put(
          handleSettingAuthDataSuccess(
            { ...user, ...response.data.data },
            token
          )
        );

        if (response?.data?.newUser) {
          startFreeTrialForUser(token);
        }
      }
    }
  } catch (error) {
    yield put(handleSettingAuthDataFailure(error));
  }
}

function* authSaga() {
  yield takeLatest(SET_AUTH_DATA_REQUEST, handleAuthSuccessAndFailure);
}

export default authSaga;
