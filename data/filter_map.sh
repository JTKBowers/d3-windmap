#[[[171.828918457,-44.0540378032],[171.828918457,-43.1310567622],[173.1719970703,-43.1310567622],[173.1719970703,-44.0540378032],[171.828918457,-44.0540378032]]]
XMIN=171.828918457
XMAX=173.1719970703
YMIN=-44.0540378032
YMAX=-43.1310567622

ogr2ogr -f GeoJSON -spat $XMIN $YMIN $XMAX $YMAX -clipsrc $XMIN $YMIN $XMAX $YMAX $2 $1
