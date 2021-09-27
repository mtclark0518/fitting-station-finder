import * as mapboxgl from 'mapbox-gl';
import { Extent } from '../models/classes';

export function extentAsNumberArray(extent: Extent): number[] {
    return [extent.minX, extent.minY, extent.maxX, extent.maxY];
}
export function extentAsBounds(extent: Extent): mapboxgl.LngLatBounds {
    console.log('getting as bounds');
    return new mapboxgl.LngLatBounds([extent.minX, extent.minY, extent.maxX, extent.maxY]);
}

export function boundsAsExtent(bounds: mapboxgl.LngLatBounds): Extent {
    console.log('getting extent');
    let extent = new Extent();
    extent.minX = bounds.getWest(); extent.minY = bounds.getSouth(); extent.maxX = bounds.getEast(); extent.maxY = bounds.getNorth();
    return extent;
}

export function boundsFromFeatures(features: any[]): mapboxgl.LngLatBounds | undefined {
    if (features.length > 0) {

        let bounds = new mapboxgl.LngLatBounds(features[0].geometry.coordinates[0], features[0].geometry.coordinates[0]);
        features.forEach((feature: any) => {
            bounds = extendBounds(bounds, feature);
        });
        return bounds;
    }
    else {
        return undefined;

    }
}
export function extendBounds(bounds: mapboxgl.LngLatBounds, feature: any) {
    const coordinates = feature.geometry.coordinates;
    for (const coord of coordinates) {
        bounds.extend(coord);
    }
    return bounds;
}

export function boundsFromPoint(coords: number[]) {
    let x = coords[0], y = coords[1],
    n = x + 0.0005,
    s = x - 0.0005,
    e = y + 0.0005,
    w = y - 0.0005;
    let bounds = new mapboxgl.LngLatBounds([s,w,n,e]);
    console.log(bounds);
    return bounds;
}