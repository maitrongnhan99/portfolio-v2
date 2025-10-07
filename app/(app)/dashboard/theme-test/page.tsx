"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Monitor } from "@phosphor-icons/react";

const ThemeTestPage: FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Theme Test Page</h1>
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
          >
            <Monitor className="w-4 h-4 mr-2" />
            System
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Theme: {theme}</p>
            <p className="text-muted-foreground">System: {systemTheme}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 bg-background border rounded">Background</div>
            <div className="p-2 bg-card border rounded">Card</div>
            <div className="p-2 bg-primary text-primary-foreground rounded">Primary</div>
            <div className="p-2 bg-secondary text-secondary-foreground rounded">Secondary</div>
            <div className="p-2 bg-accent text-accent-foreground rounded">Accent</div>
            <div className="p-2 bg-muted text-muted-foreground rounded">Muted</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Default</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-foreground">Foreground Text</p>
            <p className="text-muted-foreground">Muted Foreground Text</p>
            <p className="text-card-foreground">Card Foreground Text</p>
            <p className="text-destructive">Destructive Text</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeTestPage;