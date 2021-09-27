import { Injectable } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { BehaviorSubject } from "rxjs";
import { Extent, InspectionSite } from "src/app/models/classes";
import { changingStations } from "src/app/utilities";
import * as inspectionSites from "src/assets/json/cps_inspection_stations.json";
@Injectable({
  providedIn: "root",
})
export class StateService {

  map: mapboxgl.Map;
  inspectionSites: InspectionSite[];
  cardList = new BehaviorSubject<InspectionSite[]>([]);
  hovered = new BehaviorSubject<number | undefined>(undefined);
  selected = new BehaviorSubject<number | undefined>(undefined);
  defaultExtent: Extent = {
    minX: -87.7913555870355,
    minY: 24.1833657804932,
    maxX: -79.759563547487,
    maxY: 31.2458363737886,
  };
  marker: mapboxgl.Marker | undefined;
  isShowingAboutUsModal = false;
  constructor() {
    let sites:any = inspectionSites;
    this.inspectionSites = sites.features.map((site: any) => {
      return {id: site.id, ...site.geometry, ...site.properties} as InspectionSite;
    })
  }
  get activePanels() {
    if (this.hasLeftPanel && !this.hasBottomPanel) {
      return "left";
    }
    if (this.hasBottomPanel && !this.hasLeftPanel) {
      return "bottom";
    }
    if (this.hasBottomPanel && this.hasLeftPanel) {
      return "both";
    }
    return "none";
  }

  get hasLeftPanel(): boolean {
    return this.selected.value !== undefined;
  }
  get hasBottomPanel(): boolean {
    return this.cardList.value.length > 0;
  }
  get mapPadding() {
    return {
      top: 110,
      bottom: this.hasBottomPanel ? 240 : 30,
      left: this.hasLeftPanel ? 435 : 30,
      right: 35,
    };
  }
  public getSelectedSite = (id: number) => {
    return this.inspectionSites.find(site => site.id === id);
  }

  public async removeSelectedFeature() {
    this.map.removeFeatureState({
      source: changingStations,
      sourceLayer: changingStations,
    });
  }
  public select = async (key: number) => {
    await this.removeSelectedFeature();
    this.setFeatureState("selected", true, key);
    this.hovered.next(undefined);
    this.selected.next(key);
    let site = this.getSelectedSite(key);
    if(site) this.zoomToPoint(site.coordinates);
  };

  public setFeatureState(state: string,stateValue: boolean,id: string | number) {
    let options: any = {source: changingStations,id: id,sourceLayer: changingStations,};
    let stateObject: any = {};
    stateObject[state] = stateValue;
    this.map.setFeatureState(options, stateObject);
  }
  public updateMapPadding() {
    if (this.map) {
      this.map.setPadding(this.mapPadding);
    }
  }
  addMarker(coordinates: number[]) {
    if (!this.map) return;
    const marker = new mapboxgl.Marker()
    .setLngLat(<mapboxgl.LngLatLike>coordinates)
    .addTo(this.map);
    this.marker = marker;
  }
  async removeMarker() {
    if (!this.map || !this.marker) return;
    this.marker.remove();
    this.marker = undefined;
  }
  public zoomToPoint(point: number[]): void {

    let options: mapboxgl.CameraOptions = {
        padding: this.mapPadding,
        center: [point[0], point[1]],
        zoom: 13
    };
    this.map.easeTo(options);
  }
}
