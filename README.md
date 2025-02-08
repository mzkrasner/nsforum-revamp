# PoSciDonDAO Forum

A decentralized forum built on OrbisDB, designed for the PoSciDonDAO community.

## Getting Started

1. Clone the main branch of this repo.

2. Setup OrbisDB.
   You can either [install locally](https://www.youtube.com/watch?v=8embizFvI-U) or sign up for a shared node [here](https://studio.useorbis.com/).

3. On the OrbisDB dashboard, create a default context and add it's id to the [contexts.ts](shared/orbis/contexts.ts) file.

```ts
const contexts = {
  root: "<CONTEXT ID HERE>",
} as const;
```

4. Add an env.local file, following the description [.env.example](.env.example).

5. Install dependencies.

```bash
npm install
```

6. If you are using the default hosted endpoints for `NEXT_PUBLIC_CERAMIC_NODE_URL` and `NEXT_PUBLIC_ORBIS_NODE_URL`, you can leave these as-is in your `.env.local` file

7. Run the following to generate credential values:

```bash
npm run generateCreds
```

Save the corresponding values to your `.env.local` file

8. Back in your Orbis Studio UI, select the value under "Environment ID" on the main page and assign it to `NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID`

9. This application uses Pinata to host rich media assets. Set up an account on the [Pinata Cloud](https://app.pinata.cloud/auth/signin) site and assign your unique gateway to `NEXT_PUBLIC_GATEWAY_URL`

10. Assign the value of `BASE_URL` to the root URL of your website. If you are running locally, this can simply be "http://localhost:3000" (or your desired local endpoint)

11. This application uses Base to check locked sci tokens - obtain a valid RPC URL and assign to `NEXT_PUBLIC_RPC_URL`

12. Go to your Orbis Studio UI ([studio.useorbis.com](https://studio.useorbis.com/) if using the hosted instance) and open up the developer tools. Go to the "Application" tab and click into "Local storage". Find a key-value pair for `orbisdb_admin_session` and assign the value to `ORBIS_DB_AUTH_TOKEN` in your `.env.local` file

13. This application uses [Silk Wallet](https://www.silk.sc/) for sign-in and allows WalletConnect as an option. Set up a project under [WalletConnect Cloud](https://cloud.reown.com/). Once you have your project ID, assign it to the `projectId` variable in the [Silk Provider](app/_providers/silk/provider.tsx).

14. Obtain an OpenAI API key to assign to `OPENAI_API_KEY` in your `.env.local` file - this will be used for content moderation

15. Start up the application - we will need the server running in order to perform a database migration:

```bash
npm run dev
```

16. Once running, open up a new terminal and run the following to perform the database migration:

```bash
npm run db:sync
```

17. Ensure that your value for `NEXT_PUBLIC_MANAGER_ADDRESS` is the up-to-date contract address to retrieve data from the sci manager contract

You should now be ready to use the application

## Credit

This forum design is based off the [Network Society Forum](https://github.com/JM-M/nsforum-revamp). 

## Additional Information

[OrbisDB Documentation](https://orbisclub.notion.site/OrbisDB-Docs-e77a592361b74e66a45404ca1cbc517b)
[OrbisDB Main Site](https://useorbis.com/)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.