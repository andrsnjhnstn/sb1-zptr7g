export interface Supplier {
  SupplierName: string
  SupplierID: string
  SupplierLocation: string
}

export interface Material {
  MaterialType: string
  MaterialWeight: number
  Processing: string
  EmissionsFactorInstructions: string
}

export interface Shipping {
  Origin: string
  Destination: string
  ModeOfTransport: string
  Distance: number
  DistanceUnit: string
  EmissionsFactorInstructions: string
}

export interface Manufacturing {
  Process: string
  EmissionsFactorInstructions: string
}

export interface CarbonFootprint {
  Absolute: {
    AbsolutePartCarbonValue: number
  }
  Calculate: {
    Material: {
      PrimaryMaterial: Material
      SecondaryMaterial: Material
    }
    Manufacturing: Manufacturing
    Shipping: Shipping
  }
}

export interface Part {
  PartName: string
  PartID: string
  Supplier: Supplier
  CarbonFootprint: CarbonFootprint
}

export interface Assembly {
  AbsoluteValue: {
    AbsoluteAssemblyCarbonValue: number
  }
  Calculate: {
    AssemblyDetails: string
    AssemblyLocation: string
    EmissionsFactorInstructions: string
  }
}

export interface Packaging {
  AbsoluteValue: {
    AbsolutePackagingCarbonValue: number
  }
  Calculate: {
    PrimaryPackagingMaterial: Material
    SecondaryPackagingMaterial: Material
  }
}

export interface Product {
  ProductName: string
  ProductID: string
  Parts: Part[]
  Assembly: Assembly
  Packaging: Packaging
}