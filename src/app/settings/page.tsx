import SettingsPage from "@/components/settings/SettingsPage";
import { Suspense } from "react";

export default async function SettingsRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
