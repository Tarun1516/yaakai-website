import * as airtable from "@/lib/airtable-service"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json()

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  try {
    const user = await airtable.createUser({
      email,
      password: hashedPassword,
      name,
    })
    return new Response(JSON.stringify({ success: true, user }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 })
  }
}
