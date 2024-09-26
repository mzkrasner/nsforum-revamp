import axios, { AxiosError } from "axios";

const main = async () => {
  try {
    const { data } = await axios.post(
      `${process.env.BASE_URL}/api/dev/app-user`,
      {
        seedString: process.env.ORBIS_SEED,
      },
    );
    console.log("user: ", data);
  } catch (error) {
    console.error(
      "Error occured while fetching orbisdb settings: ",
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

main();
