import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

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
      .select("*")
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

    // 3. Check if the user has a seasonal_profile for the active season.
    const { data: seasonalProfile, error: profileError } = await supabaseClient
      .from("seasonal_profiles")
      .select("*")
      .eq("profile_id", user.id)
      .eq("season_id", activeSeason.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw profileError;
    }

    let playerProfile = seasonalProfile;
    if (!seasonalProfile) {
      // 4. If not, create a new seasonal_profile.
      // First, check if a profile exists for the user.
      const { data: existingProfile, error: existingProfileError } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfileError && existingProfileError.code !== 'PGRST116') {
          throw existingProfileError;
      }

      if (!existingProfile) {
          // Create a profile if it doesn't exist
          const { error: newProfileError } = await supabaseClient
              .from("profiles")
              .insert({ id: user.id, username: user.email }); // Or a generated username
          if (newProfileError) {
              throw newProfileError;
          }
      }


      const { data: newSeasonalProfile, error: newProfileError } = await supabaseClient
        .from("seasonal_profiles")
        .insert({
          profile_id: user.id,
          season_id: activeSeason.id,
          score: 0,
        })
        .select("*")
        .single();

      if (newProfileError) {
        throw newProfileError;
      }
      playerProfile = newSeasonalProfile;
    }

    // 5. Return the active season information and the player's seasonal profile.
    return new Response(JSON.stringify({
      season: activeSeason,
      profile: playerProfile,
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in join function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
