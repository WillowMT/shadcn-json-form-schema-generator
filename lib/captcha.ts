export async function verifyCaptchaToken(token: string) {
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    // Make a request to verify the CAPTCHA token
    const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: process.env.CAPTCHA_KEY!,
            response: token,
        }),
    });

    const data = await response.json();

    return data.success as boolean; // Return true if CAPTCHA verification is successful, false otherwise
}