import { SignatureProfile } from '@smart-signature/shared';

interface HistoryEntry {
  profileId: string;
  snapshot: SignatureProfile;
}

export class HistoryStack {
  private stack: HistoryEntry[] = [];

  push(entry: HistoryEntry) {
    this.stack.push(entry);
  }

  pop(profileId: string) {
    for (let index = this.stack.length - 1; index >= 0; index -= 1) {
      const entry = this.stack[index];
      if (entry.profileId === profileId) {
        return this.stack.splice(index, 1)[0];
      }
    }
    return undefined;
  }
}
