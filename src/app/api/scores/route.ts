import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("dino_scores")
    .select("name, score")
    .order("score", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 12) || "anonymous" : "anonymous";
  const score = typeof body.score === "number" ? Math.floor(body.score) : 0;

  const { data, error } = await supabase
    .from("dino_scores")
    .insert({ name, score })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
