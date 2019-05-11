import axios from "axios";
import { queryStringify } from "./utils";
import { APIError, AxiosError, GlobalError } from "./errors";

class VKAPI {
    constructor(config = {}) {
        this.config = config;

        if (!this.hasBaseProperty()) throw new GlobalError("Invalid params!");

        this.baseUrl = "https://api.vk.com/method/";
        this.defaultParams = { access_token: config.accessToken, v: config.versionAPI || "5.92" };
    }

    hasBaseProperty() {
        return ("accessToken" in this.config);
    }

    async callMethod(method, params = {}) {
        try {
            const paramsForRequest = { ...this.defaultParams, ...params };
            const stringifyParams = queryStringify(paramsForRequest);
            const { data: responseRequest } = await axios.post(this.baseUrl + method, stringifyParams);

            if (responseRequest.response === undefined) throw responseRequest;

            return responseRequest.response;
        } catch (error) {
            if (error.request || error.response) {
                // axios error
                throw new AxiosError(error.request ? "request error" : "response error");
            }

            else if (error.error || error.execute_error) {
                // api error
                throw new APIError({
                    code: error.error.error_code,
                    message: error.error.error_msg
                });
            }

            else {
                // other errors
                throw error;
            }
        }
    }
}

export default VKAPI;