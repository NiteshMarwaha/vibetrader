const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const COOKIE_NAME = "auth_token";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const createToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  return req.cookies[COOKIE_NAME];
};

const requireAuth = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return res.status(409).json({ error: "Email is already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name ? String(name).trim() : null,
      providers: {
        create: {
          provider: "EMAIL",
          providerUserId: normalizedEmail,
          passwordHash,
        },
      },
    },
    select: { id: true, email: true, name: true },
  });

  const token = createToken(user);
  setAuthCookie(res, token);
  return res.status(201).json({ user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const provider = await prisma.authProvider.findUnique({
    where: {
      provider_providerUserId: {
        provider: "EMAIL",
        providerUserId: normalizedEmail,
      },
    },
    include: { user: true },
  });

  if (!provider?.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isValid = await bcrypt.compare(password, provider.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const user = {
    id: provider.user.id,
    email: provider.user.email,
    name: provider.user.name,
  };

  const token = createToken(user);
  setAuthCookie(res, token);
  return res.status(200).json({ user });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ success: true });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

app.get("/api/dashboard", requireAuth, (req, res) => {
  return res.status(200).json({
    message: `Welcome back, ${req.user.name || req.user.email}.`,
  });
});

app.listen(PORT, () => {
  console.log(`Auth API running on port ${PORT}`);
});
