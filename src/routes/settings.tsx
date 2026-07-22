import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — GlowFlow AI" },
      {
        name: "description",
        content: "Manage your profile, preferences, and appearance.",
      },
      { property: "og:title", content: "Settings — GlowFlow AI" },
      { property: "og:description", content: "Manage account and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);
  const [cyclePairing, setCyclePairing] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  };

  return (
    <AppShell>
      <PageHeader
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        description="Personalize GlowFlow AI to fit your workflow."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue="Sarah Chen" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="sarah@glowflow.ai" />
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row
              label="Dark mode"
              icon={dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              checked={dark}
              onChange={toggleDark}
            />
            <Row label="Email notifications" checked={notif} onChange={setNotif} />
            <Row
              label="Sync with period tracker"
              checked={cyclePairing}
              onChange={setCyclePairing}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
