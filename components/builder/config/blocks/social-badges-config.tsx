'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FieldGroup } from '../field-group';

interface SocialBadgesConfigProps {
  style: string;
  linkedin: string;
  twitter: string;
  github: string;
  youtube: string;
  instagram: string;
  discord: string;
  email: string;
  portfolio: string;
  onStyleChange: (value: string) => void;
  onLinkedinChange: (value: string) => void;
  onTwitterChange: (value: string) => void;
  onGithubChange: (value: string) => void;
  onYoutubeChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onDiscordChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPortfolioChange: (value: string) => void;
}

export function SocialBadgesConfig({
  style,
  linkedin,
  twitter,
  github,
  youtube,
  instagram,
  discord,
  email,
  portfolio,
  onStyleChange,
  onLinkedinChange,
  onTwitterChange,
  onGithubChange,
  onYoutubeChange,
  onInstagramChange,
  onDiscordChange,
  onEmailChange,
  onPortfolioChange,
}: SocialBadgesConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Badge Style</Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="flat-square">Flat Square</SelectItem>
            <SelectItem value="for-the-badge">For the Badge</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>LinkedIn Username</Label>
        <Input
          value={linkedin}
          onChange={(e) => onLinkedinChange(e.target.value)}
          placeholder="your-linkedin-username"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Twitter/X Username</Label>
        <Input
          value={twitter}
          onChange={(e) => onTwitterChange(e.target.value)}
          placeholder="your-twitter-username"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>GitHub Username</Label>
        <Input
          value={github}
          onChange={(e) => onGithubChange(e.target.value)}
          placeholder="your-github-username"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>YouTube Channel</Label>
        <Input
          value={youtube}
          onChange={(e) => onYoutubeChange(e.target.value)}
          placeholder="your-channel-name"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Instagram Username</Label>
        <Input
          value={instagram}
          onChange={(e) => onInstagramChange(e.target.value)}
          placeholder="your-instagram-username"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Discord Server ID</Label>
        <Input
          value={discord}
          onChange={(e) => onDiscordChange(e.target.value)}
          placeholder="your-discord-server-id"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Portfolio URL</Label>
        <Input
          value={portfolio}
          onChange={(e) => onPortfolioChange(e.target.value)}
          placeholder="https://yourportfolio.com"
        />
      </FieldGroup>
    </>
  );
}
