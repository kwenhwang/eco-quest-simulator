import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    // 1. Get the active season.
    const { data: activeSeason, error: seasonError } = await supabaseClient
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    if (seasonError) {
      throw seasonError;
    }

    if (!activeSeason) {
      // No active season, so nothing to do.
      return new Response(JSON.stringify({ message: "No active season." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 2. Get the last seasonal_state_snap for the active season.
    const { data: lastSnap, error: snapError } = await supabaseClient
      .from("seasonal_state_snap")
      .select("as_of, pollution, sewage")
      .eq("season_id", activeSeason.id)
      .order("as_of", { ascending: false })
      .limit(1)
      .single();

    if (snapError && snapError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw snapError;
    }

    const lastAsOf = lastSnap ? new Date(lastSnap.as_of) : new Date(0);
    let currentPollution = lastSnap?.pollution || 0;
    let currentSewage = lastSnap?.sewage || 0;

    // 3. Get all season_events since the last snapshot for the active season.
    const { data: newEvents, error: eventsError } = await supabaseClient
      .from("season_events")
      .select("action, payload, at")
      .eq("season_id", activeSeason.id)
      .gt("at", lastAsOf.toISOString())
      .order("at", { ascending: true });

    if (eventsError) {
      throw eventsError;
    }

    // 4. Process the events and calculate the new pollution and sewage levels.
    for (const event of newEvents) {
      if (event.action === "RUN_FACTORY") {
        currentPollution += event.payload.pollution_increase || 10;
        currentSewage += event.payload.sewage_increase || 5;
      } else if (event.action === "RUN_WTP") {
        currentSewage = Math.max(0, currentSewage - (event.payload.sewage_decrease || 5));
      } else if (event.action === "RUN_STP") {
        currentPollution = Math.max(0, currentPollution - (event.payload.pollution_decrease || 5));
      }
    }

    // 5. Apply decay and transfer logic.
    const decayFactor = 0.99;
    currentPollution *= decayFactor;
    currentSewage *= decayFactor;

    const transferRate = 0.005;
    const transferredPollution = currentSewage * transferRate;
    currentPollution += transferredPollution;
    currentSewage -= transferredPollution;

    // 6. Insert a new seasonal_state_snap for the active season.
    const now = new Date();
    const { error: upsertError } = await supabaseClient
      .from("seasonal_state_snap")
      .insert({
        season_id: activeSeason.id,
        as_of: now.toISOString(),
        pollution: currentPollution,
        sewage: currentSewage,
      });

    if (upsertError) {
      throw upsertError;
    }

    // 7. Return a success message.
    return new Response(JSON.stringify({
      message: "Seasonal state rolled up successfully",
      new_pollution: currentPollution,
      new_sewage: currentSewage,
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in rollupSeasonal function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
