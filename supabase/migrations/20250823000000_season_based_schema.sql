-- Drop old tables
drop table if exists layer_events;
drop table if exists layers;
drop table if exists global_events;
drop table if exists global_state_snap;

-- Create new tables

-- 시즌 정보 관리
create table seasons (
  id bigserial primary key,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_active boolean not null default false
);

-- 현재 시즌의 환경 상태 (주기적으로 스냅샷)
create table seasonal_state_snap (
  id bigserial primary key,
  season_id bigint not null references seasons(id),
  as_of timestamptz not null,
  pollution numeric not null,
  sewage numeric not null,
  unique(season_id, as_of)
);

-- 플레이어 프로필 및 시즌별 데이터
create table profiles (
  id uuid primary key references auth.users(id),
  username text not null unique
);

create table seasonal_profiles (
    profile_id uuid not null references profiles(id),
    season_id bigint not null references seasons(id),
    score numeric not null default 0,
    -- 기타 시즌별 플레이어 데이터
    primary key (profile_id, season_id)
);


-- 시즌 내 플레이어 행동 이벤트
create table season_events (
  id uuid primary key default gen_random_uuid(),
  season_id bigint not null references seasons(id),
  profile_id uuid not null,
  action text not null, -- 'RUN_FACTORY'|'BUILD_FACTORY'|'RUN_WTP'|'RUN_STP'|...
  payload jsonb not null, -- 강도/시간/효율 등
  at timestamptz not null default now(),
  foreign key (profile_id, season_id) references seasonal_profiles (profile_id, season_id)
);
