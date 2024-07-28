const keyRestrictions = {
  keyName: 'Signed Upload JWT',
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: false,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false
      }
    }
  }
}

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkODU3YzNlNy04ZTkxLTRmZDUtYWQwMi1iM2U0MWVkMTQ1MjUiLCJlbWFpbCI6Im1pa2Vqb2xhbW9zZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImE5ODg0ZmVkMmIwZGUwNTFmNGE3Iiwic2NvcGVkS2V5U2VjcmV0IjoiOWMyOWQ5MDczY2NkNDU5YmUwNWU4ZmZjNTg5ZTZhNGViOWVmMjc0MGFhNmJmZWE0OWFhNjYzYzQ0MDk3NjFiYSIsImV4cCI6MTc1MzYwOTM3N30.5LnQYzXJs77_yLo-O1esrJj0wZlpvfTqzEdPqEiuk04'}`
        },
        body: JSON.stringify(keyRestrictions)
      };

      const jwtRepsonse = await fetch('https://api.pinata.cloud/users/generateApiKey', options);
      const json = await jwtRepsonse.json();
      const { JWT } = json;
      res.send(JWT);
    } catch (e) {
      res.status(500).send("Server Error");
    }
  }
}

export default handler;