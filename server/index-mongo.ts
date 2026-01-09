import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { connectDB } from "./mongodb";
import { registerRoutes } from "./routes-mongo";

const app = express();
const httpServer = createServer(app);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// CORS configuration for Vercel frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any vercel.app subdomain
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Session configuration with MongoDB store
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 30 * 24 * 60 * 60, // 30 days
    }),
    secret: process.env.SESSION_SECRET || "default_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  await connectDB();
  await registerRoutes(httpServer, app);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

export default app;
