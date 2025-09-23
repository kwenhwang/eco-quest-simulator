"use client";

import { useState } from "react";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export default function EcoQuestTester() {
  const [supabaseUrl, setSupabaseUrl] = useState<string>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"
  );
  const [anonKey, setAnonKey] = useState<string>(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [seasonId, setSeasonId] = useState<string>("");
  const [eventType, setEventType] = useState<string>("ACTION_SAMPLE");
  const [payload, setPayload] = useState<string>("{\n  \"value\": 1\n}");
  const [userIdForJoin, setUserIdForJoin] = useState<string>("");
  const [output, setOutput] = useState<Json | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const setResult = (label: string, data: Json) => {
    setOutput({ [label]: data });
    setLoading(null);
  };

  const toJson = (err: unknown): Json => {
    if (err instanceof Error) return { message: err.message } as unknown as Json;
    if (typeof err === "string" || typeof err === "number" || typeof err === "boolean" || err === null) return err;
    try {
      return JSON.parse(JSON.stringify(err));
    } catch {
      return String(err) as Json;
    }
  };

  const handleLogin = async () => {
    try {
      setLoading("login");
      const res = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw json;
      setAccessToken(json.access_token);
      setResult("login", json);
    } catch (e: unknown) {
      setResult("login_error", toJson(e));
    }
  };

  const callFunction = async (
    fn: string,
    init?: RequestInit,
    requireAuth = true
  ) => {
    const url = `${supabaseUrl}/functions/v1/${fn}`;
    const mergedInitHeaders = init?.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {} as Record<string, string>;
    const headers: Record<string, string> = {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...mergedInitHeaders,
    };
    if (requireAuth && accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const res = await fetch(url, { ...init, headers });
    const text = await res.text();
    try {
      return { status: res.status, json: JSON.parse(text) };
    } catch {
      return { status: res.status, json: text };
    }
  };

  const getSeasonState = async () => {
    try {
      setLoading("get-season-state");
      const result = await callFunction("get-season-state");
      setResult("get-season-state", result);
    } catch (e: unknown) {
      setResult("get-season-state_error", toJson(e));
    }
  };

  const joinSeason = async () => {
    try {
      setLoading("join");
      const result = await callFunction(
        "join",
        {
          method: "POST",
          body: JSON.stringify({ user: { id: userIdForJoin, email } }),
        },
        false
      );
      setResult("join", result);
    } catch (e: unknown) {
      setResult("join_error", toJson(e));
    }
  };

  const sendPlayerAction = async () => {
    try {
      setLoading("player_action");
      const parsed = payload ? JSON.parse(payload) : {};
      const result = await callFunction("player_action", {
        method: "POST",
        body: JSON.stringify({ season_id: seasonId, event_type: eventType, payload: parsed }),
      });
      setResult("player_action", result);
    } catch (e: unknown) {
      setResult("player_action_error", toJson(e));
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1>Eco Quest Edge Functions Tester</h1>
      <p style={{ color: "#555" }}>Quickly verify local Supabase + Edge Functions.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Config</h2>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, alignItems: "center" }}>
          <label>Supabase URL</label>
          <input value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} placeholder="http://127.0.0.1:54321" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
          <label>Anon Key</label>
          <input value={anonKey} onChange={(e) => setAnonKey(e.target.value)} placeholder="NEXT_PUBLIC_SUPABASE_ANON_KEY" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Auth</h2>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, alignItems: "center" }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test@test.com" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
          <div />
          <button onClick={handleLogin} disabled={loading==="login"} style={{ padding: "8px 12px" }}>Login</button>
          <label>Access Token</label>
          <textarea value={accessToken} onChange={(e) => setAccessToken(e.target.value)} rows={3} style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Functions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, alignItems: "center" }}>
          <label>Get Season State</label>
          <button onClick={getSeasonState} disabled={loading==="get-season-state"} style={{ padding: "8px 12px" }}>Call</button>

          <label>Join</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={userIdForJoin} onChange={(e) => setUserIdForJoin(e.target.value)} placeholder="user UUID" style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            <button onClick={joinSeason} disabled={loading==="join"} style={{ padding: "8px 12px" }}>Call</button>
          </div>

          <label>Player Action</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input value={seasonId} onChange={(e) => setSeasonId(e.target.value)} placeholder="season UUID" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            <input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="EVENT_TYPE" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={4} style={{ gridColumn: "1/3", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} />
            <div style={{ gridColumn: "1/3" }}>
              <button onClick={sendPlayerAction} disabled={loading==="player_action"} style={{ padding: "8px 12px" }}>Send</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Output</h2>
        <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 8, overflowX: "auto" }}>
          {output ? JSON.stringify(output, null, 2) : "No output yet"}
        </pre>
      </section>
    </div>
  );
}
