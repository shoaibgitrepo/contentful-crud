import * as contentful from "contentful";
import * as contentfulManagement from "contentful-management";

export const spaceId = "tk24qya26znw";
export const environmentId = "master";

export const deliveryClient = contentful.createClient({
  space: spaceId,
  accessToken: "AoGTiDm4a3r-OsWsZ05ne6eEPL6PhdLB_gWYFk58Neo",
});

export const apiClient = contentfulManagement.createClient({
  accessToken: "CFPAT-z0dP31VNniXLm-B9eRK76kv9cR7f-_r6fdYz_n9U_X0",
});

