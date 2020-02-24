
--buildings
CREATE TABLE buildings(
	id SERIAL PRIMARY KEY,
	name VARCHAR(25) NOT NULL,
	geom geometry(polygon,4326),
	created_by VARCHAR(25) NOT NULL,
	created_date timestamp NOT NULL,
	last_edited_by VARCHAR(25) NOT NULL,
	last_edited_date timestamp NOT NULL
);

CREATE INDEX buildings_geom_idx ON public.buildings USING gist (geom) TABLESPACE pg_default;
	

--Defects
CREATE TABLE defects(
   id SERIAL PRIMARY KEY,
   building_id INT references buildings(id),
   type VARCHAR(25) NOT NULL,
   geom geometry(Point,4326),
   created_by VARCHAR(25) NOT NULL,
   created_date timestamp NOT NULL,
   last_edited_by VARCHAR(25) NOT NULL,
   last_edited_date timestamp NOT NULL
)

CREATE INDEX defects_geom_idx ON public.defects USING gist (geom) TABLESPACE pg_default;
	
	
	
	
--Last edit trigger	
CREATE FUNCTION update_stamp() RETURNS trigger AS $update_stamp$
    BEGIN
        -- show who and when
        NEW.last_edited_by := current_user;
        NEW.last_edited_date := current_timestamp;
        RETURN NEW;
    END;
$update_stamp$ LANGUAGE plpgsql;

-- apply to defects
CREATE TRIGGER update_stamp BEFORE INSERT OR UPDATE ON defects
    FOR EACH ROW EXECUTE PROCEDURE update_stamp();
	
-- apply to buildings
CREATE TRIGGER update_stamp BEFORE INSERT OR UPDATE ON buildings
    FOR EACH ROW EXECUTE PROCEDURE update_stamp();
	
	
--Created stamp trigger	
CREATE FUNCTION create_stamp() RETURNS trigger AS $create_stamp$
    BEGIN
        -- show who and when
        NEW.created_by := current_user;
        NEW.created_date := current_timestamp;
        RETURN NEW;
    END;
$create_stamp$ LANGUAGE plpgsql;

-- apply to defects
CREATE TRIGGER create_stamp BEFORE INSERT ON defects
    FOR EACH ROW EXECUTE PROCEDURE create_stamp();
	
-- apply to buildings
CREATE TRIGGER create_stamp BEFORE INSERT ON buildings
    FOR EACH ROW EXECUTE PROCEDURE create_stamp();
	
-- Test an update
update buildings set name = 'Cleveland City Hall' where id > 0



CREATE FUNCTION geom_buildling_check() RETURNS trigger AS $geom_buildling_check$
--DECLARE
--    val valid_detail;
BEGIN
    IF (Select id from buildings where ST_Intersects(geom, NEW.geom)) IS NULL THEN
		RAISE EXCEPTION '% defect does not intersect the building', NEW.type;
	END IF;
	
    --val := ST_IsValidDetail(NEW.geom::Geometry);
    NEW.building_id = (Select  id from buildings where ST_Intersects(geom, NEW.geom) limit 1);
    RETURN NEW;
END;
$geom_buildling_check$ LANGUAGE plpgsql;
CREATE TRIGGER geom_buildling_check BEFORE INSERT OR UPDATE ON defects
    FOR EACH ROW EXECUTE PROCEDURE geom_buildling_check();
	
	