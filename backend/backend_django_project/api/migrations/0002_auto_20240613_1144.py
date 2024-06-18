# Generated by Django 5.0.4 on 2024-06-13 11:44


from django.db import migrations

import json
import os.path
from django.conf import settings
import psycopg2


def create_countries(apps, schema_editor):

    with open(os.path.join(settings.PROJECT_PATH, "assets", "countries.json"), "r") as f:
        countries = json.load(f)

    Country = apps.get_model("api", "Country")

    for country in countries:
        Country.objects.get_or_create(name=country["name"], two_digits_code=country["alpha-2"], three_digits_code=country["alpha-3"])


def connect_to_db():
    conn = psycopg2.connect(
    f'dbname={settings.DATABASES["default"]["NAME"]} user={settings.DATABASES["default"]["USER"]} password={settings.DATABASES["default"]["PASSWORD"]} host={settings.DATABASES["default"]["HOST"]} port={settings.DATABASES["default"]["PORT"]}')

    cur = conn.cursor()

    return conn, cur

def add_id_column(apps, schema_editor):
    """
        Add an id column to almost all tables in the database.
        Also sets column id as unique.
        This is because Django ORM cannot handle composite primary keys.
        The db will continue using the same composite primary keys but
        Django ORM will do all operations using the id column.
    """
    tables = [
        'antennas',
        'apr_coords',
        'aws_sync',
        'data_source',
        'earthquakes',
        'executions',
        'gamit_htc',
        'gamit_soln',
        'gamit_soln_excl',
        'gamit_stats',
        'gamit_subnets',
        'gamit_ztd',
        'keys',
        'locks',
        'networks',
        'ppp_soln',
        'ppp_soln_excl',
        'receivers',
        'rinex',
        'rinex_sources_info',
        'rinex_tank_struct',
        'sources_formats',
        'sources_stations',
        'stacks',
        'stationalias',
        'stationinfo',
        'stations'
    ]
    
    conn, cur = connect_to_db()

    for table in tables:
        try:
            query = f"ALTER TABLE {table} ADD COLUMN api_id SERIAL"
            print("Executing: ", query)
            cur.execute(query)

            query = f"ALTER TABLE {table} ADD UNIQUE(api_id)"
            print("Executing: ", query)
            cur.execute(query)
        except psycopg2.errors.DuplicateColumn:
            print(f"Table {table} already has a api_id column. Continuing...")
            conn.rollback()
        else:
            conn.commit()
    
    cur.close()
    conn.close()


def add_station_country_code_index(conn, cur):

    conn, cur = connect_to_db()

    query = "CREATE INDEX stations_country_code_idx ON stations(country_code)"
    try:
        print("Executing: ", query)
        cur.execute(query)
    except psycopg2.errors.DuplicateTable as e:
        print(f"Index already exists. Continuing...")
        conn.rollback()
    else:
        conn.commit()

    cur.close()
    conn.close()

def add_station_country_code_fk(conn, cur):

    conn, cur = connect_to_db()

    query = "ALTER TABLE stations ADD CONSTRAINT fk_country_code FOREIGN KEY (country_code) REFERENCES api_country(three_digits_code)"

    try:
        print("Executing: ", query)
        cur.execute(query)
    except psycopg2.errors.DuplicateObject:
        print("Constraint fk_country_code already exists. Continuing...")
        conn.rollback()
    else:
        conn.commit()

    cur.close()
    conn.close()

def add_alias_field_to_station(conn, cur):

    conn, cur = connect_to_db()

    query = "ALTER TABLE stations ADD COLUMN alias VARCHAR(4) DEFAULT NULL"
    try:
        print("Executing: ", query)
        cur.execute(query)
    except psycopg2.errors.DuplicateColumn:
        print("Column alias already exists. Continuing...")
        conn.rollback()
    else:
        conn.commit()

    cur.close()
    conn.close()

def add_ant_daz_field_to_stationinfo(conn, cur):

    conn, cur = connect_to_db()

    query = "ALTER TABLE stationinfo ADD COLUMN AntDAZ NUMERIC(4, 1)"
    try:
        print("Executing: ", query)
        cur.execute(query)
    except psycopg2.errors.DuplicateColumn:
        print("Column AntDAZ already exists. Continuing...")
        conn.rollback()
    else:
        conn.commit()

    cur.close()
    conn.close()

def create_admin_user(apps, schema_editor):

    Role = apps.get_model("api", "Role")
    User = apps.get_model("api", "User")

    admin_role = Role.objects.get_or_create(name="admin", role_api=False, allow_all=True)

    User.objects.get_or_create(
        password="argon2$argon2id$v=19$m=102400,t=2,p=8$ZHlsUlkxdE44YW1rV2E3OWo0VG44cQ$ZqzbGLeeekVmK99p9zOkPShiZzAnkH03oLOO35TlSvk",
        is_superuser=False,
        username="admin",
        first_name="",
        last_name="",
        email="",
        is_staff=False,
        is_active=True,
        role=admin_role[0]
    )

def create_endpoints(apps, schema_editor):
    Endpoint = apps.get_model("api", "Endpoint")
    endpoints = [
        ("/api/users", "GET"),
        ("/api/users", "POST"),
        ("/api/users/<PATH_PARAM>", "GET"),
        ("/api/users/<PATH_PARAM>", "PUT"),
        ("/api/users/<PATH_PARAM>", "PATCH"),
        ("/api/roles", "GET"),
        ("/api/roles", "POST"),
        ("/api/roles/<PATH_PARAM>", "GET"),
        ("/api/roles/<PATH_PARAM>", "PUT"),
        ("/api/roles/<PATH_PARAM>", "PATCH"),
        ("/api/pages", "GET"),
        ("/api/pages", "POST"),
        ("/api/pages/<PATH_PARAM>", "GET"),
        ("/api/pages/<PATH_PARAM>", "PUT"),
        ("/api/pages/<PATH_PARAM>", "PATCH"),
        ("/api/pages/<PATH_PARAM>", "DELETE"),
        ("/api/endpoints", "GET"),
        ("/api/endpoints", "POST"),
        ("/api/endpoints/<PATH_PARAM>", "GET"),
        ("/api/endpoints/<PATH_PARAM>", "PUT"),
        ("/api/endpoints/<PATH_PARAM>", "PATCH"),
        ("/api/endpoints/<PATH_PARAM>", "DELETE"),
        ("/api/endpoints-clusters", "GET"),
        ("/api/endpoints-clusters", "POST"),
        ("/api/endpoints-clusters/<PATH_PARAM>", "GET"),
        ("/api/endpoints-clusters/<PATH_PARAM>", "PUT"),
        ("/api/endpoints-clusters/<PATH_PARAM>", "PATCH"),
        ("/api/endpoints-clusters/<PATH_PARAM>", "DELETE"),
        ("/api/station-info", "GET"),
        ("/api/station-info", "POST"),
        ("/api/station-info/<PATH_PARAM>", "GET"),
        ("/api/station-info/<PATH_PARAM>", "PUT"),
        ("/api/station-info/<PATH_PARAM>", "PATCH"),
        ("/api/station-info/<PATH_PARAM>", "DELETE"),
        ("/api/networks", "GET"),
        ("/api/networks", "POST"),
        ("/api/networks/<PATH_PARAM>", "GET"),
        ("/api/networks/<PATH_PARAM>", "PUT"),
        ("/api/networks/<PATH_PARAM>", "PATCH"),
        ("/api/networks/<PATH_PARAM>", "DELETE"),
        ("/api/receivers", "GET"),
        ("/api/receivers", "POST"),
        ("/api/receivers/<PATH_PARAM>", "GET"),
        ("/api/receivers/<PATH_PARAM>", "PUT"),
        ("/api/receivers/<PATH_PARAM>", "PATCH"),
        ("/api/receivers/<PATH_PARAM>", "DELETE"),
        ("/api/antennas", "GET"),
        ("/api/antennas", "POST"),
        ("/api/antennas/<PATH_PARAM>", "GET"),
        ("/api/antennas/<PATH_PARAM>", "PUT"),
        ("/api/antennas/<PATH_PARAM>", "PATCH"),
        ("/api/antennas/<PATH_PARAM>", "DELETE"),
        ("/api/stations", "GET"),
        ("/api/stations", "POST"),
        ("/api/stations/<PATH_PARAM>", "GET"),
        ("/api/stations/<PATH_PARAM>", "PUT"),
        ("/api/stations/<PATH_PARAM>", "PATCH"),
        ("/api/stations/<PATH_PARAM>", "DELETE"),
        ("/api/station-codes/<PATH_PARAM>", "GET"),
        ("/api/apr-coords", "GET"),
        ("/api/apr-coords", "POST"),
        ("/api/apr-coords/<PATH_PARAM>", "GET"),
        ("/api/apr-coords/<PATH_PARAM>", "PUT"),
        ("/api/apr-coords/<PATH_PARAM>", "PATCH"),
        ("/api/apr-coords/<PATH_PARAM>", "DELETE"),
        ("/api/aws-sync", "GET"),
        ("/api/aws-sync", "POST"),
        ("/api/aws-sync/<PATH_PARAM>", "GET"),
        ("/api/aws-sync/<PATH_PARAM>", "PUT"),
        ("/api/aws-sync/<PATH_PARAM>", "PATCH"),
        ("/api/aws-sync/<PATH_PARAM>", "DELETE"),
        ("/api/countries", "GET"),
        ("/api/countries", "POST"),
        ("/api/countries/<PATH_PARAM>", "GET"),
        ("/api/countries/<PATH_PARAM>", "PUT"),
        ("/api/countries/<PATH_PARAM>", "PATCH"),
        ("/api/countries/<PATH_PARAM>", "DELETE"),
        ("/api/data-sources", "GET"),
        ("/api/data-sources", "POST"),
        ("/api/data-sources/<PATH_PARAM>", "GET"),
        ("/api/data-sources/<PATH_PARAM>", "PUT"),
        ("/api/data-sources/<PATH_PARAM>", "PATCH"),
        ("/api/data-sources/<PATH_PARAM>", "DELETE"),
        ("/api/earthquakes", "GET"),
        ("/api/earthquakes", "POST"),
        ("/api/earthquakes/<PATH_PARAM>", "GET"),
        ("/api/earthquakes/<PATH_PARAM>", "PUT"),
        ("/api/earthquakes/<PATH_PARAM>", "PATCH"),
        ("/api/earthquakes/<PATH_PARAM>", "DELETE"),
        ("/api/etm-params", "GET"),
        ("/api/etm-params", "POST"),
        ("/api/etm-params/<PATH_PARAM>", "GET"),
        ("/api/etm-params/<PATH_PARAM>", "PUT"),
        ("/api/etm-params/<PATH_PARAM>", "PATCH"),
        ("/api/etm-params/<PATH_PARAM>", "DELETE"),
        ("/api/etms", "GET"),
        ("/api/etms", "POST"),
        ("/api/etms/<PATH_PARAM>", "GET"),
        ("/api/etms/<PATH_PARAM>", "PUT"),
        ("/api/etms/<PATH_PARAM>", "PATCH"),
        ("/api/etms/<PATH_PARAM>", "DELETE"),
        ("/api/events", "GET"),
        ("/api/events", "POST"),
        ("/api/events/<PATH_PARAM>", "GET"),
        ("/api/events/<PATH_PARAM>", "PUT"),
        ("/api/events/<PATH_PARAM>", "PATCH"),
        ("/api/events/<PATH_PARAM>", "DELETE"),
        ("/api/executions", "GET"),
        ("/api/executions", "POST"),
        ("/api/executions/<PATH_PARAM>", "GET"),
        ("/api/executions/<PATH_PARAM>", "PUT"),
        ("/api/executions/<PATH_PARAM>", "PATCH"),
        ("/api/executions/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-htc", "GET"),
        ("/api/gamit-htc", "POST"),
        ("/api/gamit-htc/<PATH_PARAM>", "GET"),
        ("/api/gamit-htc/<PATH_PARAM>", "PUT"),
        ("/api/gamit-htc/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-htc/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-soln", "GET"),
        ("/api/gamit-soln", "POST"),
        ("/api/gamit-soln/<PATH_PARAM>", "GET"),
        ("/api/gamit-soln/<PATH_PARAM>", "PUT"),
        ("/api/gamit-soln/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-soln/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-soln-excl", "GET"),
        ("/api/gamit-soln-excl", "POST"),
        ("/api/gamit-soln-excl/<PATH_PARAM>", "GET"),
        ("/api/gamit-soln-excl/<PATH_PARAM>", "PUT"),
        ("/api/gamit-soln-excl/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-soln-excl/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-stats", "GET"),
        ("/api/gamit-stats", "POST"),
        ("/api/gamit-stats/<PATH_PARAM>", "GET"),
        ("/api/gamit-stats/<PATH_PARAM>", "PUT"),
        ("/api/gamit-stats/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-stats/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-subnets", "GET"),
        ("/api/gamit-subnets", "POST"),
        ("/api/gamit-subnets/<PATH_PARAM>", "GET"),
        ("/api/gamit-subnets/<PATH_PARAM>", "PUT"),
        ("/api/gamit-subnets/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-subnets/<PATH_PARAM>", "DELETE"),
        ("/api/gamit-ztd", "GET"),
        ("/api/gamit-ztd", "POST"),
        ("/api/gamit-ztd/<PATH_PARAM>", "GET"),
        ("/api/gamit-ztd/<PATH_PARAM>", "PUT"),
        ("/api/gamit-ztd/<PATH_PARAM>", "PATCH"),
        ("/api/gamit-ztd/<PATH_PARAM>", "DELETE"),
        ("/api/keys", "GET"),
        ("/api/keys", "POST"),
        ("/api/keys/<PATH_PARAM>", "GET"),
        ("/api/keys/<PATH_PARAM>", "PUT"),
        ("/api/keys/<PATH_PARAM>", "PATCH"),
        ("/api/keys/<PATH_PARAM>", "DELETE"),
        ("/api/locks", "GET"),
        ("/api/locks", "POST"),
        ("/api/locks/<PATH_PARAM>", "GET"),
        ("/api/locks/<PATH_PARAM>", "PUT"),
        ("/api/locks/<PATH_PARAM>", "PATCH"),
        ("/api/locks/<PATH_PARAM>", "DELETE"),
        ("/api/ppp-soln", "GET"),
        ("/api/ppp-soln", "POST"),
        ("/api/ppp-soln/<PATH_PARAM>", "GET"),
        ("/api/ppp-soln/<PATH_PARAM>", "PUT"),
        ("/api/ppp-soln/<PATH_PARAM>", "PATCH"),
        ("/api/ppp-soln/<PATH_PARAM>", "DELETE"),
        ("/api/ppp-soln-excl", "GET"),
        ("/api/ppp-soln-excl", "POST"),
        ("/api/ppp-soln-excl/<PATH_PARAM>", "GET"),
        ("/api/ppp-soln-excl/<PATH_PARAM>", "PUT"),
        ("/api/ppp-soln-excl/<PATH_PARAM>", "PATCH"),
        ("/api/ppp-soln-excl/<PATH_PARAM>", "DELETE"),
        ("/api/rinex", "GET"),
        ("/api/rinex", "POST"),
        ("/api/rinex/<PATH_PARAM>", "GET"),
        ("/api/rinex/<PATH_PARAM>", "PUT"),
        ("/api/rinex/<PATH_PARAM>", "PATCH"),
        ("/api/rinex/<PATH_PARAM>", "DELETE"),
        ("/api/rinex-sources-info", "GET"),
        ("/api/rinex-sources-info", "POST"),
        ("/api/rinex-sources-info/<PATH_PARAM>", "GET"),
        ("/api/rinex-sources-info/<PATH_PARAM>", "PUT"),
        ("/api/rinex-sources-info/<PATH_PARAM>", "PATCH"),
        ("/api/rinex-sources-info/<PATH_PARAM>", "DELETE"),
        ("/api/rinex-tank-struct", "GET"),
        ("/api/rinex-tank-struct", "POST"),
        ("/api/rinex-tank-struct/<PATH_PARAM>", "GET"),
        ("/api/rinex-tank-struct/<PATH_PARAM>", "PUT"),
        ("/api/rinex-tank-struct/<PATH_PARAM>", "PATCH"),
        ("/api/rinex-tank-struct/<PATH_PARAM>", "DELETE"),
        ("/api/sources-formats", "GET"),
        ("/api/sources-formats", "POST"),
        ("/api/sources-formats/<PATH_PARAM>", "GET"),
        ("/api/sources-formats/<PATH_PARAM>", "PUT"),
        ("/api/sources-formats/<PATH_PARAM>", "PATCH"),
        ("/api/sources-formats/<PATH_PARAM>", "DELETE"),
        ("/api/sources-servers", "GET"),
        ("/api/sources-servers", "POST"),
        ("/api/sources-servers/<PATH_PARAM>", "GET"),
        ("/api/sources-servers/<PATH_PARAM>", "PUT"),
        ("/api/sources-servers/<PATH_PARAM>", "PATCH"),
        ("/api/sources-servers/<PATH_PARAM>", "DELETE"),
        ("/api/sources-stations", "GET"),
        ("/api/sources-stations", "POST"),
        ("/api/sources-stations/<PATH_PARAM>", "GET"),
        ("/api/sources-stations/<PATH_PARAM>", "PUT"),
        ("/api/sources-stations/<PATH_PARAM>", "PATCH"),
        ("/api/sources-stations/<PATH_PARAM>", "DELETE"),
        ("/api/stacks", "GET"),
        ("/api/stacks", "POST"),
        ("/api/stacks/<PATH_PARAM>", "GET"),
        ("/api/stacks/<PATH_PARAM>", "PUT"),
        ("/api/stacks/<PATH_PARAM>", "PATCH"),
        ("/api/stacks/<PATH_PARAM>", "DELETE"),
        ("/api/stationalias", "GET"),
        ("/api/stationalias", "POST"),
        ("/api/stationalias/<PATH_PARAM>", "GET"),
        ("/api/stationalias/<PATH_PARAM>", "PUT"),
        ("/api/stationalias/<PATH_PARAM>", "PATCH"),
        ("/api/stationalias/<PATH_PARAM>", "DELETE"),
    ]
    for path, method in endpoints:
        Endpoint.objects.get_or_create(path=path, method=method)

def create_endpoints_cluster_types(apps, schema_editor):
    ClusterType = apps.get_model("api", "ClusterType")

    cluster_types = ["read", "create-update", "read-create-update", "create-update-delete", "read-create-update-delete"]

    for cluster_type in cluster_types:
        ClusterType.objects.get_or_create(name=cluster_type)

def create_resources(apps, schema_editor):
    Resource = apps.get_model("api", "Resource")

    resources = ["users", "roles", "pages", "endpoints", "endpoints-clusters", "station-info", "networks", "receivers", "antennas", "stations", "station-codes", "apr-coords", "aws-sync", "countries", "data-sources", "earthquakes", "etm-params", "etms", "events", "executions", "gamit-htc", "gamit-soln", "gamit-soln-excl", "gamit-stats", "gamit-subnets", "gamit-ztd", "keys", "locks", "ppp-soln", "ppp-soln-excl", "rinex", "rinex-sources-info", "rinex-tank-struct", "sources-formats", "sources-servers", "sources-stations", "stacks", "stationalias"]

    for resource in resources:
        Resource.objects.get_or_create(name=resource)

def create_endpoints_cluster(apps, schema_editor):
    EndPointsCluster = apps.get_model("api", "EndPointsCluster")
    Endpoint = apps.get_model("api", "Endpoint")
    ClusterType = apps.get_model("api", "ClusterType")
    Page = apps.get_model("api", "Page")
    Role = apps.get_model("api", "Role")
    Resource = apps.get_model("api", "Resource")

    read_create_update_delete_station_endpoints = [Endpoint.objects.get(path="/api/stations", method="GET").id, Endpoint.objects.get(path="/api/stations", method="POST").id, Endpoint.objects.get(path="/api/stations/<PATH_PARAM>", method="GET").id, Endpoint.objects.get(path="/api/stations/<PATH_PARAM>", method="PUT").id, Endpoint.objects.get(path="/api/stations/<PATH_PARAM>", method="DELETE").id]
    
    read_station_endpoints = [Endpoint.objects.get(path="/api/stations", method="GET").id, Endpoint.objects.get(path="/api/stations/<PATH_PARAM>", method="GET").id]

    read_create_update_delete_antennas_endpoints = [Endpoint.objects.get(path="/api/antennas", method="GET").id, Endpoint.objects.get(path="/api/antennas", method="POST").id, Endpoint.objects.get(path="/api/antennas/<PATH_PARAM>", method="GET").id, Endpoint.objects.get(path="/api/antennas/<PATH_PARAM>", method="PUT").id, Endpoint.objects.get(path="/api/antennas/<PATH_PARAM>", method="DELETE").id]

    read_antennas_endpoints = [Endpoint.objects.get(path="/api/antennas", method="GET").id, Endpoint.objects.get(path="/api/antennas/<PATH_PARAM>", method="GET").id]

    station_read_create_update_delete_cluster = EndPointsCluster.objects.get_or_create(resource = Resource.objects.get(name="stations"), cluster_type = ClusterType.objects.get(name="read-create-update-delete"))
    
    if station_read_create_update_delete_cluster[0] is not None:
        for endpoint in read_create_update_delete_station_endpoints:
            station_read_create_update_delete_cluster[0].endpoints.add(endpoint)

    station_read_cluster = EndPointsCluster.objects.get_or_create(resource = Resource.objects.get(name="stations"), cluster_type = ClusterType.objects.get(name="read"))

    if station_read_cluster[0] is not None:
        for endpoint in read_station_endpoints:
            station_read_cluster[0].endpoints.add(endpoint)

    antennas_read_create_update_delete_cluster = EndPointsCluster.objects.get_or_create(resource = Resource.objects.get(name="antennas"), cluster_type = ClusterType.objects.get(name="read-create-update-delete"))

    if antennas_read_create_update_delete_cluster[0] is not None:
        for endpoint in read_create_update_delete_antennas_endpoints:
            antennas_read_create_update_delete_cluster[0].endpoints.add(endpoint)
    
    antennas_read_cluster = EndPointsCluster.objects.get_or_create(resource = Resource.objects.get(name="antennas"), cluster_type = ClusterType.objects.get(name="read"))

    if antennas_read_cluster[0] is not None:
        for endpoint in read_antennas_endpoints:
            antennas_read_cluster[0].endpoints.add(endpoint)

    stations_read_create_update_delete_page =  Page.objects.get_or_create(url = "/stations", description = "stations read-create-update-delete")
    
    if stations_read_create_update_delete_page[0] is not None:
        stations_read_create_update_delete_page[0].endpoints_clusters.add(station_read_create_update_delete_cluster[0].id)

    stations_read_page = Page.objects.get_or_create(url = "/stations", description = "stations read")

    if stations_read_page[0] is not None:
        stations_read_page[0].endpoints_clusters.add(station_read_cluster[0].id)

    antennas_read_create_update_delete_page =  Page.objects.get_or_create(url = "/antennas", description = "antennas read-create-update-delete")

    if antennas_read_create_update_delete_page[0] is not None:
        antennas_read_create_update_delete_page[0].endpoints_clusters.add(antennas_read_create_update_delete_cluster[0].id)

    antennas_read_page = Page.objects.get_or_create(url = "/antennas", description = "antennas read")

    if antennas_read_page[0] is not None:
        antennas_read_page[0].endpoints_clusters.add(antennas_read_cluster[0].id)
    
def create_underprivileged_front_user(apps, schema_editor):
    
        Role = apps.get_model("api", "Role")
        User = apps.get_model("api", "User")
        EndPointsCluster = apps.get_model("api", "EndPointsCluster")
        ClusterType = apps.get_model("api", "ClusterType")
        Page = apps.get_model("api", "Page")

        underprivileged_role = Role.objects.get_or_create(name="underprivileged_front", role_api=False, allow_all=False)

        underprivileged_role[0].pages.add(Page.objects.get(url = "/stations", description = "stations read").id)

        User.objects.get_or_create(
            password="argon2$argon2id$v=19$m=102400,t=2,p=8$azNFTmxWNmw3TmtwaUh4OFBsNXF5TA$bZfPpIW+vzqgk1X0mrRioyWOmJBRTYSxpXwelY50kpk",
            is_superuser=False,
            username="underprivileged_front",
            first_name="",
            last_name="",
            email="",
            is_staff=False,
            is_active=True,
            role=underprivileged_role[0]
        )
    
def create_underprivileged_api_user(apps, schema_editor):
        
        Role = apps.get_model("api", "Role")
        User = apps.get_model("api", "User")
        EndPointsCluster = apps.get_model("api", "EndPointsCluster")
        ClusterType = apps.get_model("api", "ClusterType")
        Page = apps.get_model("api", "Page")

        underprivileged_role = Role.objects.get_or_create(name="underprivileged_api", role_api=True, allow_all=False)

        underprivileged_role[0].endpoints_clusters.add(EndPointsCluster.objects.get(resource__name="stations", cluster_type__name = "read").id)

        User.objects.get_or_create(
            password="argon2$argon2id$v=19$m=102400,t=2,p=8$d05JM2VxVDRNYml6dDlBRkVIMWZxYQ$kVtHD0ErTt7DGDPmOqXykvZJagvgYoZ6nLdqy9Z381Q",
            is_superuser=False,
            username="underprivileged_api",
            first_name="",
            last_name="",
            email="",
            is_staff=False,
            is_active=True,
            role=underprivileged_role[0]
        )


class Migration(migrations.Migration):
    """
    First, alters the database schema to add new fields and constraints.
    Then, populate some tables with initial data.
    """
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_countries),
        migrations.RunPython(add_id_column),
        migrations.RunPython(add_station_country_code_index),
        #migrations.RunPython(add_station_country_code_fk),
        migrations.RunPython(add_alias_field_to_station),
        migrations.RunPython(add_ant_daz_field_to_stationinfo),
        migrations.RunPython(create_admin_user),
        migrations.RunPython(create_endpoints),
        migrations.RunPython(create_endpoints_cluster_types),
        migrations.RunPython(create_resources),
        migrations.RunPython(create_endpoints_cluster),
        migrations.RunPython(create_underprivileged_front_user),
        migrations.RunPython(create_underprivileged_api_user)
    ]