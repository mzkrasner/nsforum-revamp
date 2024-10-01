import { env } from "@/env";
import axios, { AxiosError } from "axios";

const main = async () => {
  try {
    const { data } = await axios.get(`${env.BASE_URL}/api/dev/orbis/auth`);
    console.log("Auth info: ", data);
  } catch (error) {
    console.error(
      "Error occured while fetching orbisdb settings: ",
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

main();
