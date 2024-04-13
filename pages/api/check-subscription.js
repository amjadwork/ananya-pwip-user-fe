import axios from "axios";
import { apiStagePaymentBeUrl } from "@/utils/helper";

const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;

const getUsersSubscriptionDetails = async (response) => {
  if (response?.length) {
    return response[0];
  }

  if (typeof response === "object") {
    return response;
  }
};

export default async function handler(_req, res) {
  const { serviceId, authToken } = _req.query;

  try {
    const response = await axios.get(
      API_STAGE_PAYMENT_BE +
        "api" +
        "/user-subscription?serviceId=" +
        serviceId,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const subsData = await getUsersSubscriptionDetails(response.data);

    return res.status(response.status).json(subsData);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", body: err });
  }
}
