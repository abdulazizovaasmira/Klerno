import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy init Stripe to avoid crashing on start if API key is not configured yet.
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24-preview" as any, // use safe API version
    });
  }
  return stripeClient;
}

// Lazy init Supabase to allow server-side database updates
let supabaseClient: any = null;
function getSupabase(): any {
  if (!supabaseClient) {
    // We can reuse the project's Supabase settings or service role if needed, 
    // but the environment standard public URL/anon key is in supabaseKlerno.js.
    // Let's use the hardcoded credentials to ensure perfect connectivity.
    const url = "https://auokctzchcdjzbrumjfz.supabase.co";
    const anonKey = "sb_publishable_SB9edvSRQORqyVpClD3JLw_ooePt7f-";
    supabaseClient = createClient(url, anonKey);
  }
  return supabaseClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // API ROUTE: HEALTH CHECK
  // ==========================================
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ==========================================
  // API ROUTE: TEACHER ONBOARDING (CONNECT)
  // ==========================================
  app.post("/api/stripe/onboard", async (req, res) => {
    const { userId, email, country, name } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: "userId and email are required" });
    }

    try {
      const stripe = getStripe();
      const origin = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

      // Create a Stripe Express account
      const account = await stripe.accounts.create({
        type: "express",
        email: email,
        country: country === "United Kingdom" ? "GB" : country === "Canada" ? "CA" : "US", // standard fallback
        business_type: "individual",
        individual: {
          first_name: name ? name.split(" ")[0] : undefined,
          last_name: name && name.split(" ").length > 1 ? name.split(" ").slice(1).join(" ") : "Teacher",
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      // Update teacher profile in Supabase with the stripe account ID
      const supabase = getSupabase();
      await supabase
        .from("users")
        .update({ 
          stripeExpressStatus: "pending_onboarding",
          stripeConnectId: account.id 
        })
        .eq("id", userId);

      // Create account onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${origin}/?stripe_onboard=refresh&userId=${userId}&account_id=${account.id}`,
        return_url: `${origin}/?stripe_onboard=success&userId=${userId}&account_id=${account.id}`,
        type: "account_onboarding",
      });

      res.json({ url: accountLink.url });
    } catch (err: any) {
      console.error("Stripe Onboarding Error:", err);
      res.status(500).json({ error: err.message || "Internal Stripe onboarding error" });
    }
  });

  // ==========================================
  // API ROUTE: CHECK STRIPE CONNECT STATUS
  // ==========================================
  app.post("/api/stripe/status", async (req, res) => {
    const { userId, accountId } = req.body;
    if (!userId || !accountId) {
      return res.status(400).json({ error: "userId and accountId are required" });
    }

    try {
      const stripe = getStripe();
      const account = await stripe.accounts.retrieve(accountId);

      let status: "active" | "pending_onboarding" = "pending_onboarding";
      if (account.details_submitted && account.charges_enabled) {
        status = "active";
      }

      // Sync with Supabase database
      const supabase = getSupabase();
      await supabase
        .from("users")
        .update({ 
          stripeExpressStatus: status,
          stripeConnectId: accountId
        })
        .eq("id", userId);

      res.json({ status, detailsSubmitted: account.details_submitted, chargesEnabled: account.charges_enabled });
    } catch (err: any) {
      console.error("Stripe Status Check Error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch account status" });
    }
  });

  // ==========================================
  // API ROUTE: STRIPE EXPRESS DASHBOARD LOGIN LINK
  // ==========================================
  app.post("/api/stripe/login-link", async (req, res) => {
    const { accountId } = req.body;
    if (!accountId) {
      return res.status(400).json({ error: "accountId is required" });
    }

    try {
      const stripe = getStripe();
      const loginLink = await stripe.accounts.createLoginLink(accountId);
      res.json({ url: loginLink.url });
    } catch (err: any) {
      console.error("Stripe Login Link Error:", err);
      res.status(500).json({ error: err.message || "Failed to create Stripe Express dashboard login link" });
    }
  });

  // ==========================================
  // API ROUTE: STRIPE CHECKOUT FOR STUDENT
  // ==========================================
  app.post("/api/stripe/checkout", async (req, res) => {
    const { lessonId, studentId, studentName, teacherId, teacherName, subject, date, time, price, teacherStripeId } = req.body;
    if (!lessonId || !price || !teacherStripeId) {
      return res.status(400).json({ error: "Missing required booking details or teacher Stripe ID" });
    }

    try {
      const stripe = getStripe();
      const origin = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

      const amountInCents = Math.round(price * 100);
      // We take a flat 10% platform fee
      const applicationFeeInCents = Math.round(amountInCents * 0.10);

      // Create checkout session using Stripe Connect (Direct Charges with Application Fee)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Academic Lesson with ${teacherName}`,
                description: `${subject} lesson scheduled on ${date} at ${time}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        payment_intent_data: {
          application_fee_amount: applicationFeeInCents,
          transfer_data: {
            destination: teacherStripeId,
          },
        },
        success_url: `${origin}/?stripe_checkout=success&lessonId=${lessonId}`,
        cancel_url: `${origin}/?stripe_checkout=cancelled&lessonId=${lessonId}`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("Stripe Checkout Error:", err);
      res.status(500).json({ error: err.message || "Failed to construct checkout session" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
