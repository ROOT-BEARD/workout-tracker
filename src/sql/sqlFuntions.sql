drop function if exists get_exercise_max(text, uuid);

create or replace function get_exercise_max(exercise_name text, userid uuid)
returns numeric as $$
  select coalesce(max(weight),0)
  from sets
  where exercise = exercise_name
  AND sets.user_id = userid;
$$ language sql;

drop function if exists exercise_max_name_date(text, numeric, numeric, uuid);

create or replace function exercise_max_name_date(exercise_name text, low numeric, high numeric, userid uuid)
RETURNS TABLE(
  workout_date date,
  max_weight numeric,
  set_reps numeric
 ) as $$
  SELECT DISTINCT ON (workouts.created_at::DATE)
  workouts.created_at::DATE AS workout_date,
  sets.weight AS max_weight,
  sets.reps AS set_reps
  FROM sets
  JOIN workouts ON sets.workout_id = workouts.id
  WHERE sets.exercise = exercise_name
  AND sets.reps >= low
  AND sets.reps <= high
  AND workouts.user_id = userid
  ORDER BY workouts.created_at::DATE ASC, sets.weight DESC, sets.reps DESC;

$$ language sql;


create or replace function get_workoutsets_for_exercise(exercise_name text, low numeric, high numeric, userid uuid)
RETURNS TABLE(
  workout_date date,
  set_weight numeric,
  set_reps numeric
 ) as $$
  SELECT
  workouts.created_at::DATE AS workout_date,
    sets.weight AS set_weight,
  sets.reps AS set_reps
  FROM sets
  JOIN workouts ON sets.workout_id = workouts.id
  WHERE sets.exercise = exercise_name
  AND sets.reps >= low
  AND sets.reps <= high
  AND workouts.user_id = userid
  ORDER BY workouts.created_at ASC;

$$ language sql;


CREATE or replace function get_range_volume(userid uuid, start_date timestamp, end_date timestamp)
RETURNS TABLE(
  week_start date,
  primary_muscle text,
  total_volume numeric
) AS $$
SELECT 
date_trunc('week', workouts.created_at)::DATE AS week_start,
movements.primary_muscle AS primary_muscle,
coalesce(sum(sets.weight * sets.reps),0) AS total_volume
FROM sets
JOIN workouts on workouts.id = sets.workout_id
JOIN movements on movements.name = sets.exercise
WHERE workouts.user_id = userid
AND workouts.created_at >= start_date
AND workouts.created_at <= end_date
GROUP BY
  date_trunc('week', workouts.created_at)::DATE,
  movements.primary_muscle

$$ language sql;

CREATE OR REPLACE FUNCTION calculate_one_rep_max(movement_name text)
RETURNS NUMERIC AS $$
  SELECT CAST ROUND(coalesce(sub.max_weight, 0) * (1 + (0.0333 * sub.max_weight_reps)))
  FROM (
    select
        weight as max_weight,
        reps as max_weight_reps
      FROM sets
      WHERE exercise = movement_name
      ORDER BY weight desc
      LIMIT 1
  ) AS sub;
$$ language sql;
