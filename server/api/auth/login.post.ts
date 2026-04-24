import { compare } from "bcrypt";
import { SignJWT } from "jose";

interface User {
  id: number;
  password: string;
  email: string;
  name: string;
  role: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return {
      success: false,
      message: "Missing required fields: email, password"
    };
  }

  try {
    const user = await db.prepare("SELECT id, password, email, name, role FROM users WHERE email = ?").get(email) as User | null;

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid password" };
    }

    const token = await new SignJWT({ 
      userId: user.id, 
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }
  catch (err) {
    console.error("[login] Error:", err);
    return { success: false, message: "Login failed" };
  }
});