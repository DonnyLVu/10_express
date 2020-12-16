DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB[]
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id BIGINT REFERENCES recipes(id),
  date_of_event TEXT NOT NULL,
  notes TEXT,
  rating INT CHECK (rating > 0 AND rating < 11)
);
