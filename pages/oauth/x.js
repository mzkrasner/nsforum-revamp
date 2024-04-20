import React from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import Header from "../../components/Header";

import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { LoadingCircle } from "../../components/Icons";
import useUserProfile from "../../hooks/useUserProfile";

export default function Post() {
	const searchParams = useSearchParams();
	const oauth_verifier = searchParams.get("oauth_verifier");
	const oauth_token = searchParams.get("oauth_token");

	const { XOauthCallbackQuery } = useUserProfile({
		oauth_verifier,
		oauth_token,
	});
	const { data, error } = XOauthCallbackQuery;
	const errorMessage = error?.message || data?.error;

	return (
		<>
			<Head>
				{/** Title */}
				<title key="title">Verifying X username</title>
				<meta
					property="og:title"
					content="Verifying X account"
					key="og_title"
				/>

				{/** Description */}
				<link rel="icon" href="/favicon.png" />
			</Head>
			<div className="antialiased flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip bg-main">
				<Header />
				<main className="grow">
					<section>
						<div className="flex max-w-6xl mx-auto px-4 sm:px-6 pt-6">
							<div className="relative md:flex md:gap-6 md:justify-between w-full">
								{/* Content */}
								<div className="flex gap-3 justify-center items-center w-full text-secondary">
									{XOauthCallbackQuery.isLoading ? (
										<>
											<LoadingCircle />
											Verifying your X account
										</>
									) : data?.success ? (
										"Your username has been verified, redirecting"
									) : errorMessage ? (
										errorMessage
									) : (
										"Sorry, we could not verify your username"
									)}
								</div>
								<Sidebar />
							</div>
						</div>
					</section>
				</main>
				{/* Site footer*/}
				<Footer />
			</div>
		</>
	);
}
