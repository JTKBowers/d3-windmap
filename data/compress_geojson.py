#!python
'''
Compress a geojson file by reducing precision and removing closely positioned points.

Usage:
    compress-geojson.py {grid-size} {dist-threshold} {input-file} {output-file}

'''
import sys, json, math
from json import encoder

from geopy.distance import vincenty

def filter_by_dist(points, dist_threshold):
    prev_point = None
    for point in points:
        if prev_point is not None:
            dist = vincenty(point, prev_point).m
            #print(dist)
            # emit only points if they are more than dist_threshold from their neighbours
            if dist > dist_threshold:
                yield point
        prev_point = point

def snap_to_grid(lnglat, grid_size):
    earth_radius = 6.371e6
    longtitude, latitude = lnglat
    # print(latitude, longtitude)
    lat_grid_size_deg = math.degrees(grid_size/earth_radius) # The number of degrees per grid_size of latitude

    local_radius = earth_radius*math.cos(math.radians(latitude))
    lng_grid_size_deg = math.degrees(grid_size/local_radius) # The number of degrees per grid_size of longtitude

    # Snap exactly to grid points
    # lat_grid_multiples = round(latitude / lat_grid_size_deg)
    # lng_grid_multiples = round(longtitude / lng_grid_size_deg)
    #
    # print(lat_grid_multiples)
    # return [lng_grid_size_deg*lng_grid_multiples, lat_grid_size_deg*lat_grid_multiples]

    # Because we're interested in compression, just round to the approximate number of dp for the grid size.
    lat_grid_magnitude = -round(math.log10(lat_grid_size_deg))
    lng_grid_magnitude = -round(math.log10(lng_grid_size_deg))

    return [round(longtitude, lng_grid_magnitude), round(latitude,lat_grid_magnitude)]

def snap_traverse(obj, grid_size):
    '''
    Recurse through a dictionary looking for lat/lng pairs (lists/tuples containing 2 floats).

    Accepts an object and a grid size in m.
    '''
    if (type(obj) is list or type(obj) is tuple) \
        and len(obj) == 2 \
        and all([type(x) is float for x in obj]):
        return snap_to_grid(obj, grid_size)
    elif type(obj) is dict:
        return {k: snap_traverse(v, grid_size) for k, v in obj.items()}
    elif type(obj) is list or type(obj) is tuple:
        return list(map(lambda x: snap_traverse(x, grid_size), obj))
    else:
        return obj
    return obj

if __name__ == "__main__":
    gridsize, dist_threshold, input_file, output_file = sys.argv[1:]
    dist_threshold = float(dist_threshold)
    gridsize = float(gridsize)

    with open(input_file) as geojson_file:
        geojson = json.loads(geojson_file.read())
        geojson = snap_traverse(geojson, gridsize)
        for index, feature in enumerate(geojson["features"]):
            if feature["geometry"]["type"] == "LineString":
                points = feature["geometry"]["coordinates"]
                geojson["features"][index]["geometry"]["coordinates"] = list(filter_by_dist(points, dist_threshold))
            else:
                print(feature["geometry"]["type"])

        with open(output_file, 'w') as f:
            json.dump(geojson, f)
