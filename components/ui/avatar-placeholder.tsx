import { User } from "lucide-react"

interface AvatarPlaceholderProps {
  size?: number
  username?: string
}

export function AvatarPlaceholder({ size = 40, username }: AvatarPlaceholderProps) {
  const initials = username ? username.substring(0, 2).toUpperCase() : ""

  return (
    <div
      className="flex items-center justify-center bg-muted text-muted-foreground rounded-full"
      style={{ width: size, height: size }}
    >
      {initials ? <span className="text-xs font-medium">{initials}</span> : <User className="h-4 w-4" />}
    </div>
  )
}

