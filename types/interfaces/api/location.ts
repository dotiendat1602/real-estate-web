export interface ProvinceData {
  id: number;
  name: string;
}

export interface DistrictData {
  id: number;
  name: string;
  provinceId: number;
}

export interface WardData {
  id: number;
  name: string;
  districtId: number;
}
