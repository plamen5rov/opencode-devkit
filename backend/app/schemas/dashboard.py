from __future__ import annotations

from pydantic import BaseModel


class FeatureInfo(BaseModel):
    id: str
    label: str
    icon: str
    description: str
    implemented: bool
    phase: str


class PhaseInfo(BaseModel):
    name: str
    status: str
    description: str
    features: list[str]


class DashboardResponse(BaseModel):
    title: str
    version: str
    total_features: int
    implemented_features: int
    completed_phases: int
    total_phases: int
    features: list[FeatureInfo]
    phases: list[PhaseInfo]
