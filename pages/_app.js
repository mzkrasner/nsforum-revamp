import { useRef, useState } from "react";
import "../styles/globals.css";
import '../styles/tiptap.css';
import "../styles/survey.css";
import { Orbis, OrbisProvider } from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";
import { GlobalContext } from "../contexts/GlobalContext";
import { UsernameVerificationContext } from "../contexts/UsernameVerificationContext";
import {
	QueryClient,
	QueryClientProvider,
	HydrationBoundary,
} from "@tanstack/react-query";

/**
 * Set the global forum context here (you can create categories using the dashboard by clicking on "Create a sub-context"
 * from your main forum context)
 */
global.orbis_context =
	"kjzl6cwe1jw148u8qk0m6b8tukb7rw7as9123dbkeutx3mc3kl96hf0g7e81opi";

/**
 * Set the global chat context here (the chat displayed when users click on the "Community Chat" button).
 * The Community Chat button will be displayed only if this variable is set
 */
global.orbis_chat_context =
	"kjzl6cwe1jw148u8qk0m6b8tukb7rw7as9123dbkeutx3mc3kl96hf0g7e81opi";

let orbis = new Orbis({
	useLit: true,
	node: "https://node2.orbis.club",
	PINATA_GATEWAY: 'violet-deliberate-marten-707.mypinata.cloud',
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 1000 * 60 * 5 },
	},
});

export default function App({ Component, pageProps }) {
	const [_, updateState] = useState(0);
	const usernameVerificationRef = useRef({});

	return (
		<OrbisProvider
			defaultOrbis={orbis}
			authMethods={["metamask", "wallet-connect", "email"]}
		>
			<GlobalContext.Provider value={{ orbis: orbis }}>
				<QueryClientProvider client={queryClient}>
					<HydrationBoundary state={pageProps.dehydratedState}>
						<UsernameVerificationContext.Provider
							value={{ usernameVerificationRef, updateState }}
						>
							<Component {...pageProps} />
						</UsernameVerificationContext.Provider>
					</HydrationBoundary>
				</QueryClientProvider>
			</GlobalContext.Provider>
		</OrbisProvider>
	);
}
