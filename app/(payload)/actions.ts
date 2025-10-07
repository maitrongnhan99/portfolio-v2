"use server";

import config from "@payload-config";
import { getPayload } from "payload";

/**
 * Server function for PayloadCMS 3.x ServerFunctionsProvider
 * Returns the complete server function interface expected by PayloadCMS
 */
export const serverFunction = async () => {
  try {
    const payload = await getPayload({ config });
    
    return {
      payload,
      config,
    };
  } catch (error) {
    console.error("Error in PayloadCMS server function:", error);
    throw error;
  }
};
