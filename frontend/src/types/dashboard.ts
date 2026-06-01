export interface FeatureInfo {
  id: string
  label: string
  icon: string
  description: string
  implemented: boolean
  phase: string
}

export interface PhaseInfo {
  name: string
  status: string
  description: string
  features: string[]
}

export interface DashboardResponse {
  title: string
  version: string
  total_features: number
  implemented_features: number
  completed_phases: number
  total_phases: number
  features: FeatureInfo[]
  phases: PhaseInfo[]
}
