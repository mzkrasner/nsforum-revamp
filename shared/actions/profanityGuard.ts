export const checkProfanity = async (text: string) => {
    try {
        const response = await fetch("/api/guard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        return data.flagged;
    } catch (error) {
        console.error("Profanity check failed", error);
        return false;
    }
};
