import type { HealthReadinessResponse } from '@startup-stack/shared/api/health';
import { useEffect, useState } from 'react';

export function App() {
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    // TODO: test api response - remove
    fetch('/api/v1/health/ready')
      .then((res) => res.json())
      .then((data: HealthReadinessResponse) => {
        setVersion(data.data?.version);
      });
  }, []);

  return (
    <main>
      <h1>Startup Stack</h1>
      <p>Version: {version ?? 'loading...'}</p>
    </main>
  );
}
