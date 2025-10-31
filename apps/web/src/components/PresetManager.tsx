import React from 'react';
import { useProfilesStore } from '../store/useProfilesStore';

export const PresetManager: React.FC = () => {
  const { library } = useProfilesStore();
  const profiles: typeof library.profiles = library.profiles;

  return (
    <section className="panel" data-testid="preset-manager">
      <h3>Templates</h3>
      <ul>
        {profiles.map((profile: typeof profiles[number]) => (
          <li key={profile.id}>{profile.name}</li>
        ))}
      </ul>
    </section>
  );
};

export default PresetManager;
