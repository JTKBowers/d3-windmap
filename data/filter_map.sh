# Usage:
# filter-map.sh {input-shp file} {output geoJSON file}

#[[[171.828918457,-44.0540378032],[171.828918457,-43.1310567622],[173.1719970703,-43.1310567622],[173.1719970703,-44.0540378032],[171.828918457,-44.0540378032]]]
XMIN=171.828918457
XMAX=173.1719970703
YMIN=-44.0540378032
YMAX=-43.1310567622

temp_dir=`mktemp -d`
temp_geojson=$temp_dir/tmp.geojson
ogr2ogr -f GeoJSON -spat $XMIN $YMIN $XMAX $YMAX -clipsrc $XMIN $YMIN $XMAX $YMAX $temp_geojson $1
python compress_geojson.py 100 10 $temp_geojson $2
rm $temp_geojson
rmdir $temp_dir
