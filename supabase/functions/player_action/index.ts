import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    // 1. Get user from Authorization header.
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError) {
      throw userError;
    }
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            headers: { "Content-Type": "application/json" },
            status: 401,
        });
    }

    // 2. Get the active season.
    const { data: activeSeason, error: seasonError } = await supabaseClient
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    if (seasonError) {
      throw seasonError;
    }

    if (!activeSeason) {
      return new Response(JSON.stringify({ error: "No active season found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    // 3. Get the action and payload from the request body.
    const { action, payload } = await req.json();

    if (!action || !payload) {
      return new Response(JSON.stringify({ error: "Missing action or payload" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 4. Insert a new event into the season_events table.
    const { error: eventError } = await supabaseClient
      .from("season_events")
      .insert({
        season_id: activeSeason.id,
        profile_id: user.id,
        action: action,
        payload: payload,
      });

    if (eventError) {
      throw eventError;
    }

    // 5. Return a success message.
    return new Response(JSON.stringify({ message: "Action recorded successfully" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in player_action function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
