from __future__ import annotations

from fastapi import APIRouter

from app.data.features import FEATURES, PHASES
from app.schemas.dashboard import DashboardResponse, FeatureInfo, PhaseInfo

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard() -> DashboardResponse:
    features = [FeatureInfo(**f) for f in FEATURES]
    phases = [PhaseInfo(**p) for p in PHASES]
    implemented: int = len([f for f in features if f.implemented])
    completed: int = len([p for p in phases if p.status == "complete"])

    return DashboardResponse(
        title="OpenCode DevKit",
        version="0.1.0",
        total_features=len(features),
        implemented_features=implemented,
        completed_phases=completed,
        total_phases=len(phases),
        features=features,
        phases=phases,
    )
