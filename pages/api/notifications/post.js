import { Orbis } from "@orbisclub/orbis-sdk";
import sendEmailNotification from '../../../controllers/sendEmailNotification';

const handler = async (req, res) => {
  if (req.method === "POST") {
    const orbis = new Orbis({
      useLit: true,
      node: "https://node2.orbis.club",
      PINATA_GATEWAY: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
    });
    try {
      const { body } = req;
      const { data = [], error } = await orbis.getProfileFollowers(body.userId);
      if (error) throw new Error(error);
      // console.log(JSON.stringify(data, null, 2));
      // console.log(error);
      const users = data.map(orbisUser => {
        const { details = {}, profile = {} } = orbisUser
      })
      res.end('')
    } catch (e) {
      res.status(500).send("Server Error");
    }
  }
}

export default handler;