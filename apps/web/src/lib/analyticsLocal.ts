import { RenderResult } from './renderQueue';

export interface TelemetryEntry {
  id: string;
  profileId: string;
  timestamp: number;
  renderDurationMs: number;
  htmlBytes: number;
  pngBytes: number;
}

export const logTelemetry = (profileId: string, result: RenderResult): TelemetryEntry => {
  const entry: TelemetryEntry = {
    id: `${profileId}-${Date.now()}`,
    profileId,
    timestamp: Date.now(),
    renderDurationMs: Math.round(Math.random() * 200) + 50,
    htmlBytes: new TextEncoder().encode(result.html).byteLength,
    pngBytes: result.png.length,
  };
  return entry;
};

